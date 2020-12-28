<template>
  <v-container>
    <!-- notice starts -->
    <v-row>
      <v-col>
       
      </v-col>
    </v-row>
    <!-- notice ends -->

    <!-- Special Menu starts -->
    <v-row>
      <v-col class="pb-0">
        <p class="text-left display-1 text-md-center">Nawras Special</p>
        <br>
      </v-col>
    </v-row>
    <v-sheet class="mx-auto" elevation="2">
      <v-slide-group
        v-model="model"
        class="pa-4"
        active-class="success"
        show-arrows
      >
        <v-slide-item
          v-for="n in 15"
          :key="n"
          v-slot:default="{ active, toggle }"
        >
          <v-card
            :color="active ? undefined : 'grey lighten-1'"
            class="ma-4"
            height="200"
            width="100"
            @click="toggle"
          >
            <v-row class="fill-height" align="center" justify="center">
              <v-scale-transition>
                <v-icon
                  v-if="active"
                  color="white"
                  size="48"
                  v-text="'mdi-close-circle-outline'"
                ></v-icon>
              </v-scale-transition>
            </v-row>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
    <!-- Special Menu ends -->

    <!-- promo starts -->
    <v-row>
      <v-col>
        <v-card class="d-inline-block mx-auto" width="100%">

          
        
        </v-card>
      </v-col>
    </v-row>
    <!-- promo ends -->

    <!-- photo gallery starts -->
    <v-row>
      <v-col class="pb-0">
        <h3 class="left display-1 text-md-center" >Photo Gallery</h3>
        <br>
      </v-col>
      
    </v-row>
    <v-row>
      <v-col>
        <v-carousel height="420">
          <v-carousel-item
            v-for="(i, j) in 4"
            :key="i"
            :src="`/img/foods/ruya${j + 1}.jpg`"
          >
            <v-row class="fill-height" align="center" justify="center">
              <div id="sliderText" class="d-flex flex-column slider-background">
                <!-- <h1 style="font-size:10vw;">Responsive Text</h1> -->
                <span class="display-3 white--text"
                  >Photo heading</span
                >
                <span class="display-1 white--text"
                  >Photo sub heading</span
                >
              </div>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <!-- photo gallery ends -->
  </v-container>
</template>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";

export default {
  components: {
    Logo,
    VuetifyLogo,
  },
  data() {
    return {
      model: 0,
      colors: ["primary", "secondary", "yellow darken-2"],
    };
  },
};
</script>

<style>
.slider-background {
  background-color: rgba(80, 80, 80, 0.493);
  width: 100%;
  height: 40%;
  text-align: center;
  margin-top: auto;
  padding-top: 20px;
}

@media screen and (min-width: 601px) {
  slider-background {
    font-size: 65px;
  }
}

@media screen and (max-width: 600px) {
  slider-background {
    font-size: 30px;
  }
  @media only screen and (max-width: 600px) {
    body {
      background-color: lightblue;
    }
  }
}
</style>


