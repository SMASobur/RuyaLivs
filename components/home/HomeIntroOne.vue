<template>
      <v-row dense>
        <v-col
          v-for="card in cards"
          :key="card.title"

        >
          <v-card class="ma-2"  elevation="2" >

            <v-img
              :src="card.src"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="300px"

            >
            <v-card-title  class="txtgb" v-text="card.title"></v-card-title>



            </v-img>
            <v-card-actions>
                     <h3 class="font-weight-light mx-1">{{card.subtitle}}</h3>

        <v-btn
      rounded
      v-if="card.link"
        class="ma-2"
        color="primary "
        dark
        :to=card.link
      >
      {{card.button_text}}
        <v-icon
          dark
          right
        >
         mdi-hand-pointing-right 
        </v-icon>
      </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
</template>

<script>
import HomeSlideProduct from '@/components/home/HomeSlideProduct'
export default {
  components: { HomeSlideProduct },
    data: () => ({
      cards: [
        { subtitle: 
        'Our short-term goal is to be able to deliver a complete solution of dry goods consisting of 580-600 items under many different brands (Nawras, Sefer, Peros, Fairy, Yurttan, Papilion, ABC) that will be able to meet the need for a versatile range in the oriental stores.'
        ,src: 'img/intro.png', flex: 12 , button_text:'go to shop', link:'/shop'},



      ],
    }),
  }
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

  .txtgb{
  text-shadow:0px 0px 10px white;
  color:white;

}

</style>


