<template>
  <v-app>
    <!-- navigation drawer starts -->
    <v-navigation-drawer v-model="drawer" disable-resize-watcher fixed app>
      <div
        v-if="
          authUserResponse.success && authUser && authUser.userType == 'USER'
        "
      >
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="/img/users/icon_user.png" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ authUser.fullName }}</v-list-item-title>
            <v-list-item-subtitle>User</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </div>

      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            v-if="
              authUserResponse.success &&
              authUser &&
              authUser.userType == 'USER'
            "
            block
            color="accent"
            @click="onLogout"
            >Logout</v-btn
          >
        </div>
      </template>
    </v-navigation-drawer>
    <!-- navigation drawer ends -->

    <!-- cart drawer starts -->
    <v-navigation-drawer
      v-model="rightDrawer"
      temporary
      right
      fixed
      width="450"
    >
      <v-list>
        <v-list-item>
          <v-btn class="mr-2" text rounded @click="rightDrawer = !rightDrawer">
            <v-icon color="primary">mdi-arrow-right-thick</v-icon>
          </v-btn>
          <v-list-item-title>My Cart</v-list-item-title>
        </v-list-item>
        <shopping-cart></shopping-cart>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            v-if="!isReservationWithPreOrderActive"
            :disabled="cartLength === 0"
            color="primary"
            block
            to="/checkout"
            >Checkout</v-btn
          >
          <v-btn
            v-else
            :disabled="cartLength === 0"
            color="primary"
            block
            to="/preorder"
            >Pre Order Reservation</v-btn
          >
        </div>
      </template>
    </v-navigation-drawer>
    <!-- cart drawer ends -->

    <v-app-bar :clipped-left="clipped" app dark color="primary">
      <div>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      </div>

      <v-toolbar-title v-text="title" />
      <v-spacer />

      <!-- tab starts -->
      <!-- <v-tabs right >
          <v-tab to="/" nuxt>Home page</v-tab>
          <v-tab to="/menu" nuxt>Menu</v-tab>
          <v-tab to="/reservation" nuxt>Reservation</v-tab>
          <v-tab to="/order" nuxt>My Order</v-tab>
      </v-tabs>-->
      <!-- tab ends -->

      <div class="d-none d-md-block">
        <v-btn text to="/">Home</v-btn>
        <v-btn text to="/shop">Shop</v-btn>
        <v-btn text to="/order">My Order</v-btn>
        <!-- <v-btn text to="/reservation">Reservation</v-btn>  -->
      </div>

      <!-- user icon starts -->
      <!-- <v-btn v-if="authUserResponse.success" icon>
        <v-avatar size="35">
          <v-img src="/img/users/icon_user.png"></v-img>
        </v-avatar>
      </v-btn> -->
      <!-- user icon ends -->

      <!-- login button starts -->
      <v-btn
        outlined
        v-if="authUser.userType != 'USER'"
        text
        @click="showLogin = true"
        class="ml-2"
      >
        <v-icon left>mdi-account</v-icon>Login
      </v-btn>
      <!-- login button ends -->
      <!-- logout button starts -->
      <!-- <v-btn v-if="authUserResponse.success" text @click="onLogout">
        <v-icon left>mdi-account</v-icon>Logout
      </v-btn>-->
      <!-- logout button ends -->
      <!-- cart icon starts -->
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-badge avatar color="green" overlap>
          <template v-slot:badge>
            <v-avatar>{{ cartLength }}</v-avatar>
          </template>
          <v-icon size="40">mdi-cart</v-icon>
        </v-badge>
      </v-btn>
      <!-- cart icon ends -->
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
        <SnackBar />
        <UserLogin v-model="showLogin" userType="USER" />
      </v-container>
    </v-main>

    <v-bottom-navigation v-model="bottomNav" app class="d-md-none">
      <v-btn to="/">
        <span>Home</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn to="/shop">
        <span>Shop</span>
        <v-icon>mdi-cart</v-icon>
      </v-btn>
      <v-btn to="/order">
        <span>About</span>
        <v-icon>mdi-book-open-page-variant</v-icon>
      </v-btn>
      <!-- <v-btn to="reservation">
        <span>Reservation</span>
        <v-icon>mdi-seat-passenger</v-icon>
      </v-btn> -->
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import ShoppingCart from "@/components/ShoppingCart.vue";
import UserLogin from "@/components/auth/UserLogin.vue";
import UserRegistration from "@/components/auth/UserRegistration.vue";
import SnackBar from "@/components/SnackBar.vue";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  components: {
    ShoppingCart,
    UserLogin,
    UserRegistration,
    SnackBar,
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-book-open-page-variant",
          title: "My Shop",
          to: "/shop",
        },
        // {
        //   icon: "mdi-seat-passenger",
        //   title: "My reservations",
        //   to: "/current_reservation"
        // }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Ruya Livs AB",
      showLogin: false,
      showRegistration: false,
      bottomNav: 0,
    };
  },
  methods: {
    async onLogout() {
      await this.$apolloHelpers.onLogout();
      this.removeAuthResponse();
      this.removeAuthUser();
      this.$cookies.remove("user-id");
      this.$cookies.remove("loggedInUser");
    },
    ...mapActions("auth", ["removeAuthResponse", "removeAuthUser"]),
  },
  computed: {
    cartLength() {
      return this.$store.state.menu.cart.length;
    },
    ...mapGetters("auth", {
      authUser: "authUser",
      authUserResponse: "authUserResponse",
    }),
    ...mapGetters("reservation", ["isReservationWithPreOrderActive"]),
  },
  watch: {
    authUserResponse(newVal, oldVal) {
      if (newVal.code === 201) {
        this.showRegistration = false;
      }
      if (newVal.code === 200) {
        this.showLogin = false;
      }
    },
  },
};
</script>
