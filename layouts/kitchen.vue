<template>
  <v-app>
    <v-app-bar :clipped-left="clipped" app hide-on-scroll elevate-on-scroll dark color="primary">
      <v-toolbar-title v-text="title" />
      <v-spacer />
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
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    SnackBar
  },
  data() {
    return {
      drawer: true,
      clipped: false,
      title: "Restaurant kitchen"
    };
  },
  methods: {},
  computed: {},
  watch: {}
};
</script>
