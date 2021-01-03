<template>
  <div class="grey lighten-5">
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="6"
        md="6"
      >
    <v-card class="ma-2" elevation="2" shaped>
            
            <v-img
              src="https://cdn.vuetifyjs.com/images/cards/road.jpg"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="300px"
              
            >
            <v-card-title  class="txtgb">Sales and Offers</v-card-title>

            </v-img>
            <v-card-actions>
                     <h3 class="font-weight-light mx-1">we are here to serve you best with afortable price. we are here to serve you best with afortable price.</h3>
            </v-card-actions>
          </v-card>
      </v-col>
      <v-col
        sm="6"
        md="6"
      >
          <v-card class="ma-2" elevation="2" shaped>
            
            <v-img
              src="https://cdn.vuetifyjs.com/images/cards/plane.jpg"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="300px"
              
            >
            <v-card-title  class="txtgb">Sales and Offers</v-card-title>

            </v-img>
            <v-card-actions>
                     <h3 class="font-weight-light mx-1">we are here to serve you best with afortable price. we are here to serve you best with afortable price.</h3>
            </v-card-actions>
          </v-card>
      </v-col>
    </v-row>
  </div>
</template>



<script>
export default {

    data: () => ({
      cards: [
        { title: 'Try Our Online Order System and you will never go back', subtitle: 'we are here to serve you best with afortable price. we are here to serve you best with afortable price.we are here to serve you best with afortable price',src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 12 , button_text:'go to shop',},
        { title: 'Sales and Offers',  subtitle: 'we are here to serve you best with afortable price. we are here to serve you best with afortable price. we are here to serve you best with afortable price.', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 6 ,},
        { title: 'Transport Partner',subtitle: 'we are here to serve you best with afortable price. we are here to serve you best with afortable price. we are here to serve you best with afortable price. ', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 6,},
    

      ],
    }),
}
</script>

<style>

</style>