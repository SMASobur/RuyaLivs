<template>
  <v-dialog :persistent="persist" v-model="show" max-width="500">
    <v-card class="mx-auto" outlined>
      <v-card-title v-if="userType == 'USER'">User Login</v-card-title>
      <v-card-title v-else-if="userType == 'ADMIN'">Admin Login</v-card-title>
      <v-card-text>
        <!-- <pre>{{userType}}</pre> -->
        <v-form v-model="isFormValid">
          <v-text-field
            type="email"
            v-model="email"
            :rules="emailRules"
            label="email"
            prepend-icon="mdi-email"
          ></v-text-field>
          <v-text-field
            label="password"
            v-model="password"
            :rules="passwordRules"
            :type="showPassword ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          :loading="loading"
          :disabled="!isFormValid"
          @click="onSubmit"
          depressed
          small
          color="primary"
          >Login</v-btn
        >
        <v-spacer></v-spacer>
        <span v-if="userType == 'USER'" class="caption mx-1"
          >Not an user ?</span
        >
        <v-btn
          v-if="userType == 'USER'"
          @click.stop="
            closeLoginDialog();
            showRegistration = true;
          "
          small
          text
          color="primary"
          >Register</v-btn
        >
      </v-card-actions>
    </v-card>
    <UserRegistration v-model="showRegistration" />
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import UserRegistration from "@/components/auth/UserRegistration.vue";
import loginUserGql from "@/gql/mutation/loginUser.gql";
export default {
  name: "UserLogin",
  components: {
    UserRegistration,
  },
  props: {
    value: Boolean,
    userType: {
      type: String,
      required: true,
    },
    persist: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showPassword: false,
      email: "",
      password: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 6) || "Password must have 6+ characters",
      ],
      isFormValid: false,
      loading: false,
      showRegistration: false,
    };
  },
  created() {},
  methods: {
    closeLoginDialog() {
      // this.$emit("registerButtonClick");
      this.$emit("input", false);
    },
    async onSubmit() {
      this.loading = true;
      const user = {
        email: this.email,
        password: this.password,
        userType: this.userType,
      };
      console.log("user type in login", user);
      try {
        const response = await this.$apollo.mutate({
          mutation: loginUserGql,
          variables: { user },
        });
        const data = response.data.loginUser;
        console.log("login user", data);
        if (data.success) {
          this.setAuthUser(data.user);
          if (this.userType == "USER") this.setOrderUser(data.user);
          await this.$apolloHelpers.onLogin(data.token);
          const loginResponse = {
            code: data.code,
            success: data.success,
            message: data.message,
            token: data.token,
          };
          this.setAuthResponse(loginResponse);
          if (this.userType == "ADMIN")
            this.$router.push("/admin/menu/show_menu");
          else this.closeLoginDialog();
          this.$cookies.set("user-id", data.user.id, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
          });
          this.$cookies.set("loggedInUser", data.user, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
          });
        }

        this.loading = false;
        let color = "success";
        if (data.code !== 200) {
          color = "error";
        }
        this.$notifier.showMessage({
          content: data.message,
          color: color,
        });
      } catch (err) {
        console.error("err", err);
        this.loading = false;
        this.$notifier.showMessage({
          content: err.message,
          color: "error",
        });
      }
    },
    ...mapActions("auth", ["setAuthUser", "setAuthResponse"]),
    ...mapActions("order", ["setOrderUser"]),
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>