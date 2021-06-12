<template>
  <div>
    
    <HomeIntroOne />
    <v-divider></v-divider>
    <v-divider></v-divider>
    <HomeSlideProduct class="mb-3"/>
    <sales class="mb-3"/>    
    <HomeColumn />  
    <home-footer/>
    
  </div>
</template>

<script>
import HomeFooter from "@/components/home/HomeFooter.vue";
import HomeIntroOne from "@/components/home/HomeIntroOne.vue";
import HomeColumn from "@/components/home/HomeColumn.vue";
import HomeSlideProduct from "@/components/home/HomeSlideProduct.vue";
import Sales from '~/components/home/sales.vue';
export default {
  components: { HomeFooter, HomeIntroOne, HomeColumn, HomeSlideProduct, Sales,},
  data() {
    return {};
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


