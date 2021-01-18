<template>
  <v-container>
    <v-row v-if="!$fetchState.pending" class="mt-2">
      <v-col>
        <MenuFilter />
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <v-col v-if="isPreOrder" cols="12" md="12" sm="12">
        <div class="d-flex justify-end">
          <v-switch
            @change="onPreOrderChange"
            v-model="isPreOrder"
            label="Reservation with pre order"
          ></v-switch>
        </div>
      </v-col>
    </v-row>
    <div class="d-flex justify-center mr-2">
      <v-progress-circular
        :size="50"
        color="accent"
        indeterminate
        v-if="$fetchState.pending || isMenuLoading"
        class="align-self-center"
      ></v-progress-circular>
    </div>
    <v-row
      v-if="!$fetchState.pending && !isMenuLoading && totalProductPage == 0"
    >
      <v-col>
        <p>Sorry, no product is found with this catagory :(</p>
      </v-col>
    </v-row>
    <v-row
      v-if="!$fetchState.pending && !isMenuLoading && totalProductPage != 0"
      class="mt-1"
    >
      <v-col
        cols="6"
        sm="3"
        xs="6"
        md="2"
        v-for="(item, index) in allMenu"
        :key="index"
      >
        <div>
          <ProductCard
            :id="item.id"
            :title="item.productName"
            :thumbnail="item.thumbnail"
            :category="item.category.name"
            :price="item.netPrice.toString()"
            :originalPrice="item.price"
            :description="item.description"
            :isAddedToCart="item.isAddedToCart"
            :sizeAndPrice="item.sizeAndPrice"
            @onDetailsClicked="onMenuItemClick(item)"
          />
        </div>
      </v-col>
    </v-row>
    <v-pagination
      v-if="!$fetchState.pending && !isMenuLoading && totalProductPage > 1"
      :value="getMenuPageNo"
      class="my-4"
      :length="totalProductPage"
      @input="onPaginationInput"
    ></v-pagination>
    <ProductDetails
      v-if="isMenuItemClicked"
      :item="selectedItem"
      v-model="isMenuItemClicked"
    />
  </v-container>
</template>

<script>
import ProductCard from "@/components/ProductCard.vue";
import MenuFilter from "@/components/MenuFilter.vue";
import ProductDetails from "@/components/ProductDetails.vue";
import gql from "graphql-tag";
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  async fetch() {
    await this.fetchMenus();
  },
  components: {
    ProductCard,
    MenuFilter,
    ProductDetails,
  },
  created() {
    this.setPageNo(1);
  },
  data() {
    return {
      // isPreOrder: false
      page: 1,
      isMenuItemClicked: false,
      selectedItem: null,
    };
  },

  methods: {
    ...mapActions("reservation", ["deActivateReservationWithPreOrder"]),
    ...mapActions("menu", ["fetchMenus", "setPageNo"]),
    onPreOrderChange(val) {
      if (!val) {
        this.deActivateReservationWithPreOrder();
      }
    },
    onPaginationInput(val) {
      console.log("pagination page clicked", val);
      this.setPageNo(val);
      this.fetchMenus();
      window.scrollTo(0, 0);
    },
    onMenuItemClick(item) {
      this.selectedItem = item;
      this.isMenuItemClicked = true;
    },
  },
  mounted() {
    console.log("all menu", this.allMenu);
  },
  computed: {
    ...mapState({
      items: (state) => state.menu.items,
    }),
    ...mapGetters("reservation", ["isReservationWithPreOrderActive"]),
    ...mapGetters("menu", [
      "totalProductPage",
      "isMenuLoading",
      "getMenuPageNo",
      "allMenu",
    ]),
    isPreOrder: {
      get() {
        return this.isReservationWithPreOrderActive;
      },
      set(newVal) {},
    },
  },
  watch: {
    $route(to, from) {},
  },

  // middleware: ['isAuth']
};
</script>
