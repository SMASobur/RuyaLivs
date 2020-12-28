<template>
  <v-dialog v-model="show" max-width="500">
    <v-card class="mx-auto" outlined>
      <v-card-title>Registration</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isFormValid">
          <v-text-field
            type="text"
            v-model="firstName"
            label="First name"
            :rules="nameRules"
            prepend-icon="mdi-account-circle"
          ></v-text-field>
          <v-text-field
            type="text"
            v-model="lastName"
            label="Last name"
            :rules="nameRules"
            prepend-icon="mdi-account-circle"
          ></v-text-field>
          <v-text-field
            type="email"
            v-model="email"
            label="Email"
            :rules="emailRules"
            prepend-icon="mdi-email"
          ></v-text-field>
          <v-text-field
            type="text"
            v-model="emergencyContactNo"
            label="Emergency contact number"
            :rules="emergencyContactNoRules"
            prepend-icon="mdi-phone"
          ></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            :type="showPassword ? 'text':'password'"
            :rules="passwordRules"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye':'mdi-eye-off'"
            @click:append="showPassword=!showPassword"
          ></v-text-field>
          <v-text-field
            label="Re-enter password"
            v-model="rePassword"
            :type="showRePassword ? 'text':'password'"
            :rules="passwordConfirmRules"
            prepend-icon="mdi-lock"
            :append-icon="showRePassword ? 'mdi-eye':'mdi-eye-off'"
            @click:append="showRePassword=!showRePassword"
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
        >Register</v-btn>
        <v-spacer></v-spacer>
        <span class="caption mx-1">Already have account ?</span>
        <v-btn @click="showLogin=true;closeRegistrationDialog()" text small color="primary">Login</v-btn>
      </v-card-actions>
    </v-card>
    <!-- <UserLogin  /> -->
    <UserLogin v-model="showLogin"></UserLogin>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// import UserLogin from "@/components/auth/UserLogin.vue";
import registerUserGql from "@/gql/mutation/registerUser.gql";
export default {
  name: "UserRegistration",
  components: {
    UserLogin: () => import("../auth/UserLogin.vue")
  },
  props: {
    value: Boolean
  },
  data() {
    return {
      showPassword: false,
      showRePassword: false,
      isFormValid: false,
      firstName: "",
      lastName: "",
      nameRules: [v => !!v || "Name is required"],
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      emergencyContactNo: "",
      emergencyContactNoRules: [
        v => !!v || "Contact number is required",
        v =>
          /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})/.test(v) ||
          "Invalid contact number format"
      ],
      password: "",
      rePassword: "",
      passwordRules: [
        v => !!v || "Password is required",
        v => (v && v.length >= 6) || "Password must have 6+ characters",
        // v => /(?=.*[A-Z])/.test(v) || "Must have one uppercase character",
        v => /(?=.*\d)/.test(v) || "Must have one number"
      ],
      passwordConfirmRules: [
        v => !!v || "Password is required",
        v => this.password === this.rePassword || "Password must match"
      ],
      loading: false,
      showLogin: false
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate();
      this.sendUserToBackend();
    },
    closeRegistrationDialog() {
      // this.$emit("loginButtonClick");
      this.$emit("input", false);
    },

    async onSubmit() {
      const user = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        emergencyContactNo: this.emergencyContactNo
      };
      this.loading = true;
      try {
        const response = await this.$apollo.mutate({
          mutation: registerUserGql,
          variables: { user }
        });
        const data = response.data.addUser;
        this.setAuthUser(data.user);
        this.setOrderUser(data.user);
        this.$cookies.set("user-id", data.user.id, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365
        });
        this.loading = false;
        const registrationResponse = {
          code: data.code,
          success: data.success,
          message: data.message,
          token: data.token
        };
        let color = "success";
        if (data.code === 11000) {
          color = "error";
        }
        if (data.code === 201) {
          this.closeRegistrationDialog();
        }
        await this.$apolloHelpers.onLogin(data.token);
        this.setAuthResponse(registrationResponse);
        this.$notifier.showMessage({
          content: data.message,
          color: color
        });

        // await this.$apolloHelpers.onLogin(res.token);
      } catch (err) {
        console.error("err", err);
        this.loading = false;
      }
    },
    ...mapActions("auth", ["setAuthUser", "setAuthResponse"]),
    ...mapActions("order", ["setOrderUser"])
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>