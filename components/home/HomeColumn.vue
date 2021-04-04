<template>
  <div class="grey lighten-3">
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="6"
        md="6"
      >
    <v-card class="ma-2" elevation="2">
            
            <v-img
              src="img/NawrasSwedenLogo.png"
              class="white--text align-end fullimage"
              gradient="to bottom, rgba(0,0,0,.2), rgba(0,0,0,.1)"
              
              
            >

            </v-img>
             <div class="mt-3 text-center">
              Senast uppdaterat:2021-04-03
           </div>
          
            <v-btn
            depressed
            class="mt-2"
            rounded
            block
            elevation="6"
            large
            href="https://nawrasfoods.se/onewebmedia/ProductList%20senast.pdf" 
            target="_blank"
            color="primary"
          >
            Visa alla produkter
          </v-btn>
          
          </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="6"
      >
          <v-card class="ma-2" elevation="2">
            
            
                <v-card-actions>

                  <iframe src="https://www.google.com/maps/d/embed?mid=1yLyeV_SxGJv8fxJQMpyfwfrpIXRnmfJT" width="640" height="480"></iframe>  
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