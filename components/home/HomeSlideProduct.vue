<template>
<v-card outlined shaped>
  <v-row no-gutters>
    <h3 class="mt-5 ml-5"><v-icon large color="orange darken-2 ">mdi-new-box</v-icon>Products</h3>
    </v-row>



<v-card   elevation="5" >
    <v-sheet
    class="mx-auto ma-1"
  >
    <v-slide-group
      v-model="model"
      class="pa-1 pb-3"

    >
      <v-slide-item
        v-for="n in 10"
        :key="n"
      >

   <v-hover v-slot="{ hover }">
    <v-card @click="onDetailsClicked" hover height="100%" tile  max-width="170"
     max-hight="150" class="ma-1 mb-2 vertical">
      <v-img
        height="150"
        contain
        class="green lighten-4 "
        src="img/olivesalad.png"
        
        
      >
          <p
            v-if="false"
            class="font-italic mr-2 error--text my-0 text-decoration-line-through bottom-right"
          >
            <b>SEK 320</b>
          </p>
          
        <v-expand-transition>
          <div
            v-if="hover"
            class="d-flex transition-fast-in-fast-out primary darken-4 v-card--reveal"
            style="height: 100%"
          >
            <v-btn small outlined dark> View Details </v-btn>
          </div>
        </v-expand-transition>

                  <v-btn
                  class="mr-16 mt-5 rotate lighten-3 red--text"
                  v-if="false"
                  color="orange"
                  dark
                  tile
                  x-small
                  absolute
                  top
                  right
                >
                 <strong>Rabatt: 12.01</strong> 
                </v-btn>
        </v-img>

      

 
      <p class="text-truncate mx-4 mt-2 mb-0 font-weight-bold">A super product title</p>
    


      <v-card-subtitle class=" mt-0 pt-0">
        12*12 description</v-card-subtitle
      >

      <v-card-text>
        <div class="d-flex">


          <p
            :class="{ 'mx-2': true }"
            class="success--text my-0 font-weight-bold text-truncate"
          >
            SEK 500

          </p>

        </div>
      </v-card-text>
      
 


      <v-btn
      class="mb-7"
      fab
      @click.stop="say('Added to Cart')"
      x-small
      absolute
      bottom
      right
      color="primary"
    >
      <v-icon>
        mdi-cart-plus
      </v-icon>
    </v-btn>
    </v-card>
    
  </v-hover>

      </v-slide-item>
    </v-slide-group>
  </v-sheet>
  <v-divider></v-divider>
<div class="text-right">
  <small class="primary--text"><v-icon small color="primary darken-2">mdi-information </v-icon>click the button to</small>
    <v-btn
    small
     rounded
      color="primary"
      class="ma-1 white--text text-right"
    >
      View All
        <v-icon
          dark
          right
        >
         mdi-hand-pointing-right
        </v-icon>
    </v-btn>
    </div>
</v-card>

</v-card>

</template>


<script>
export default {
     data: () => ({
      model: null,
    }),
  methods: {
         say(message) {
      alert(message)
    },
}
};
</script>

<style>

.rotate{
  transform: rotate(310deg);
}
.bottom-right {
  position: absolute;
  bottom: 1px;
  right: 7px;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  width: 100%;
} 
.vertical {
 overflow-y: auto;
}
  
</style>
