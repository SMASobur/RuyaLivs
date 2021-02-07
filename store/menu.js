import gql from 'graphql-tag';
import getProductsQuery from '../gql/query/getProducts.gql';
import getAllCategoriesQuery from '../gql/query/getAllCategories.gql';

export const state = () => ({
    cart: [],
    items: [],
    // selectedItem: {},
    categories: [],
    menuFilter: {
        pageNo: 1,
        limit: 18,
        categories: [],
        searchText: ''
    },
    totalProductCount: 1,
    isMenuLoading: false,


})

export const mutations = {
    SET_MENU(state, items) {
        items.forEach(item => {
            if (item.hasMultipleSize) {
                //console.log('item', item);
                item.sizeAndPrice.forEach(sp => sp.isAddedToCart = false)
            } else {
                item.isAddedToCart = false
            }
        });
        state.items = items;
    },

    PUSH_ITEM_TO_CART(state, cartItem) {
        state.cart.push(cartItem);
    },
    REMOVE_ITEM_FROM_CART(state, payload) {

        //console.log('payload',payload);
        let index = state.cart.findIndex(
            element => element.size === payload.size && element.id === payload.cartItemId
        );

        state.cart.splice(index, 1);
    },

    INCREMENT_ITEM_QUANTITY(state, cartItem) {
        cartItem.quantity++;
    },
    DECREMENT_ITEM_QUANTITY(state, cartItem) {
        cartItem.quantity--;
    },
    TOGGLE_ITEM_ADDED_TO_CART(state, payload) {
        const { productId, size } = payload;
        //console.log('payload in toggle',payload);
        const item = state.items.find(item => item.id === productId);
        //console.log('item in toggle',item);
        if (item.hasMultipleSize) {
            //console.log('item in toggle', item);
            const sizeAndPrice = item.sizeAndPrice.find(sp => sp.size === size);
            sizeAndPrice.isAddedToCart = !sizeAndPrice.isAddedToCart;
        } else {
            item.isAddedToCart = !item.isAddedToCart
        }
    },
    RESET_CART(state) {
        state.cart = [];
    },
    SET_PAGE_NO(state, pageNo) {
        state.menuFilter.pageNo = pageNo
    },
    SET_PER_PAGE(state, limit) {
        state.menuFilter.limit = limit;
    },
    SET_MENU_CATEGORY(state, categories) {
        state.menuFilter.categories = categories
    },
    SET_REMOTE_CATEGORIES(state, categories) {
        state.categories = categories;
    },
    SET_MENU_SEARCH_TEXT(state, text) {
        state.menuFilter.searchText = text;
    },
    SET_TOTAL_PRODUCT_COUNT(state, count) {
        state.totalProductCount = count;
    },
    TOGGLE_MENU_LOADING(state, val) {
        state.isMenuLoading = val;
    },
    SET_ITEM_ADDED_TO_CART_IF_ALREADY_IN_CART(state) {
        // state.items.forEach(product => {
        //     const item = state.cart.find(item => item.id === product.id);
        //     if (item) {
        //         product.isAddedToCart = true;
        //     }
        // })
    },

    RESET_FILTER(state) {
        state.menuFilter = {
            pageNo: 1,
            limit: 18,
            categories: [],
            searchText: ''
        }
    }

}

export const actions = {

    async fetchMenus({ state, commit }) {
        let client = this.app.apolloProvider.defaultClient;
        commit("TOGGLE_MENU_LOADING", true);
        const productsInput = {
            pageNo: state.menuFilter.pageNo,
            limit: state.menuFilter.limit,
            categories: state.menuFilter.categories,
            searchText: state.menuFilter.searchText.trim()
        }
        // //console.log('products input', productsInput);
        const response = await client.query({
            query: getProductsQuery,
            variables: { productsInput },
            fetchPolicy: 'network-only'

        });
        const products = response.data.getProducts.products;
        const totalProductCount = response.data.getProducts.count;

        commit("TOGGLE_MENU_LOADING", false);

        commit('SET_MENU', products);
        commit("SET_TOTAL_PRODUCT_COUNT", totalProductCount);
        commit('SET_ITEM_ADDED_TO_CART_IF_ALREADY_IN_CART');
    },
    async fetchCategories({ state, commit }) {
        let client = this.app.apolloProvider.defaultClient;
        const response = await client.query({
            query: getAllCategoriesQuery
        })
        const categories = response.data.getCategories;

        commit('SET_REMOTE_CATEGORIES', categories)

    },
    setMenuCategories({ commit }, categories) {
        // //console.log('menuCategories', categories);
        commit('SET_MENU_CATEGORY', categories);
    },
    addItemToCart(context, payload) {
        const { productId, size } = payload;
        //console.log('productId', productId);
        //console.log('size', size);
        const cartItem = context.state.cart.find(item => item.id === productId && item.size === size);
        if (!cartItem) {
            const product = context.state.items.find(item => item.id === productId);
            //console.log('product', product);
            let cartItem;
            if (product.hasMultipleSize) {
                const selectedSize = product.sizeAndPrice.find(sp => sp.size === size);
                //console.log('selectedSize', selectedSize);
                cartItem = {
                    id: product.id,
                    title: product.productName,
                    thumbnail: product.thumbnail,
                    price: selectedSize.netPrice,
                    size: size,
                    quantity: 1
                }
            } else {
                cartItem = {
                    id: product.id,
                    title: product.productName,
                    thumbnail: product.thumbnail,
                    price: product.netPrice,
                    size: size,
                    quantity: 1
                }
            }
            context.commit('PUSH_ITEM_TO_CART', cartItem)
        }
    },
    removeItemFromCart({ commit }, payload) {
        commit('REMOVE_ITEM_FROM_CART', payload);
    },
    toggleItemAddedToCart(context, payload) {
        context.commit('TOGGLE_ITEM_ADDED_TO_CART', payload)
    },
    incrementCartQuantity(context, payload) {

        const { cartItemId, size } = payload;
        //console.log('payload',payload);
        // return;
        const cartItem = context.state.cart.find(item => item.id === cartItemId && item.size === size);
        //console.log('cartItem', cartItem);
        // return;
        context.commit('INCREMENT_ITEM_QUANTITY', cartItem);
    },
    decrementCartQuantity(context, payload) {
        const { cartItemId, size } = payload;
        const cartItem = context.state.cart.find(item => item.id === cartItemId && item.size === size);
        if (cartItem.quantity > 1) {
            context.commit('DECREMENT_ITEM_QUANTITY', cartItem);
        }
    },
    resetCart({ commit }) {
        commit('RESET_CART');
    },
    resetFilter({ commit }) {
        commit('RESET_FILTER');
    },
    setPageNo({ commit }, pageNo) {
        commit('SET_PAGE_NO', pageNo);
    },
    setMenuSearchText({ commit }, text) {
        commit('SET_MENU_SEARCH_TEXT', text);
    }

}

export const getters = {
    allMenu(state) {
        return state.items;
    },
    // getSelectedItemSelectedSize(state) {
    //     return state.selectedItem.selectedSize;
    // },
    cartItems(state) {
        return state.cart;
    },
    cartItemByIdAndSize(state, payload) {
        const { productId, size } = payload;
        return state.cart.find(x => x.id === productId && size === size);
    },
    cartTotalPrice(state) {
        return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    orderItems(state) {
        return state.cart.map(item => {
            return {
                productId: item.id,
                productName: item.title,
                pricePerUnit: item.price,
                productSize: item.size,
                productQuantity: item.quantity
            }
        })
    },
    remoteCategories(state) {
        return state.categories;
    },
    totalProductPage(state) {
        const limit = state.menuFilter.limit;
        const totalProductCount = state.totalProductCount;
        const totalProductPage = Math.ceil(totalProductCount / limit);
        return totalProductPage;
    },
    isMenuLoading(state) {
        return state.isMenuLoading;
    },
    getMenuPageNo(state) {
        return state.menuFilter.pageNo;
    }

}