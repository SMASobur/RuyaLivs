const menu = [

    { header: 'Apps' },
    { divider: true },
    {
        action: 'mdi-moped',
        title: 'Orders',
        active: true,
        items: [
            { title: 'All Orders', to:'/admin/order/all_orders' }
        ],
    },
    {
        action: 'mdi-book-open-page-variant',
        title: 'Product',
        active: true,
        items: [
            { title: 'Create Product', to:'/admin/menu/create_menu' },
            { title: 'Show Product', to:'/admin/menu/show_menu' },
        ],
    },

    {
        action: 'mdi-table-chair',
        title: 'Reservation',
        active: true,
        items: [
            { title: 'All Reservations', to:'/admin/reservation/all_reservations' }
        ],
    },

    {
        action: 'mdi-format-list-bulleted-type',
        title: 'Category',
        active: true,
        items: [
            { title: 'Create Category', to:'/admin/category/create_category' },
            { title: 'Show Category', to:'/admin/category/show_category' },
        ],
    }

]

export default menu;