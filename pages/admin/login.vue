<template>
  <div>
    <UserLogin persist v-model="showLogin" userType="ADMIN" />
  </div>
</template>

<script>
import UserLogin from "@/components/auth/UserLogin.vue";
export default {
  components: {
    UserLogin,
  },
  data() {
    return {
      showLogin: true,
    };
  },
};
</script>

<style>
</style>