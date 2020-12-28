<template>
  <v-app>
    <!-- navigation drawer starts -->
    <v-navigation-drawer v-model="drawer" disable-resize-watcher fixed app>
      <v-list dense>
        <template v-for="(item, i) in menus">
          <v-subheader class="ml-2" v-if="item.header" :key="i"><strong> {{ item.header }}</strong> </v-subheader>
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
            <v-list-item v-for="subItem in item.items" :key="subItem.title" :to="subItem.to">
              <v-list-item-content>
                <v-list-item-title v-text="subItem.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <!-- navigation drawer ends -->

    <v-app-bar :clipped-left="clipped" app  dark color="primary">
      <div>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      </div>

      <v-toolbar-title v-text="title" />
      <v-spacer />


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
export default {
  components: {
    SnackBar
  },
  data() {
    return {
      drawer: true,
      clipped: false,
      menus: menu,
      title: "Ruya livs Admin Panel"
    };
  },
  methods: {},
  computed: {},
  watch: {}
};
</script>
