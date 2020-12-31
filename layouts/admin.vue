<template>
  <v-app>
    <!-- navigation drawer starts -->
    <v-navigation-drawer v-model="drawer" disable-resize-watcher fixed app>

      <div v-if="authUserResponse.success">
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="/img/users/icon_user.png" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{authUser.firstName}} {{authUser.lastName}}</v-list-item-title>
            <v-list-item-subtitle>{{authUser.userType}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </div>

      <v-list dense>
        <template v-for="(item, i) in menus">
          <v-subheader class="ml-2" v-if="item.header" :key="i"
            ><strong> {{ item.header }}</strong>
          </v-subheader>
          <v-list-group
            v-else-if="item.items"
            :key="item.title"
            v-model="item.active"
            :prepend-icon="item.action"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="subItem in item.items"
              :key="subItem.title"
              :to="subItem.to"
            >
              <v-list-item-content>
                <v-list-item-title v-text="subItem.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>

      <!-- <template v-slot:append>
        <div class="pa-2">
          <v-btn v-if="authUserResponse.success" block color="accent" @click="onLogout">Logout</v-btn>
        </div>
      </template> -->
    </v-navigation-drawer>
    <!-- navigation drawer ends -->

    <v-app-bar :clipped-left="clipped" app dark color="primary">
      <div>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      </div>

      <v-toolbar-title v-text="title" />
      <v-spacer />

      <v-btn outlined  v-if="authUserResponse.success" @click="onLogout" text  class="ml-2">
        <v-icon left>mdi-account</v-icon> LOGOUT
      </v-btn>

      <!-- logout button ends -->
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
        <SnackBar />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import menu from "@/api/menu";
import SnackBar from "@/components/SnackBar.vue";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  components: {
    SnackBar,
  },
  data() {
    return {
      drawer: true,
      clipped: false,
      menus: menu,
      title: "Ruya livs Admin Panel",
    };
  },
  methods: {
    async onLogout() {
      await this.$apolloHelpers.onLogout();
      this.removeAuthResponse();
      this.removeAuthUser();
      this.$cookies.remove("user-id");
      this.$cookies.remove("loggedInUser");
      this.$router.push("/admin/login")
    },
    ...mapActions("auth", ["removeAuthResponse", "removeAuthUser"]),
  },
  computed: {
    ...mapGetters("auth", ["authUser", "authUserResponse"]),
  },
  watch: {},
  middleware: ["isAdmin"],
};
</script>
