<template>
<v-card shaped>
  <v-row no-gutters>
      <v-col
      >
     <h3 class="mt-5 ml-5">Current Discount</h3>
      </v-col>

      <v-col
      >
         <div class="text-right">
  <v-btn
  rounded
      color="primary"
      class="ma-2 white--text"
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
      </v-col>

    </v-row>



<v-card   elevation="5" rounded >
    <v-sheet
    class="mx-auto ma-1"
  >
    <v-slide-group
      v-model="model"
      class="pa-1"

    >
      <v-slide-item
        v-for="n in 10"
        :key="n"
      >

  <v-card
    hover
    class="ma-2 vertical"
    max-width="150"
    max-hight="100"
  >
    <v-img
    contain

      src="img/olivesalad.png"
      height="100"
    >
             <v-btn
                  small
                  color="deep-orange"
                  outlined
                  dark
                  class="mt-2 mr-2 bgcolor"
                >

                <div> <h2>66:-</h2></div>
                </v-btn>

    </v-img>


    <v-card-title>
      Top western road trips
    </v-card-title>
    <v-card-subtitle>
      1,000 miles of wonder
    </v-card-subtitle>

    <v-card-actions>
    </v-card-actions>
  </v-card>

      </v-slide-item>
    </v-slide-group>
  </v-sheet>
</v-card>

</v-card>

</template>

<script>
  export default {
    data: () => ({
      model: null,
    }),
  }
</script>

<style>
.bgcolor{
  background-color: white;
}
</style>
