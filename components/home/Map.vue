<template>
  <div class="d-flex flex-column justify-space-between align-center">
    <v-slider
      v-model="width"
      class="align-self-stretch"
      min="200"
      max="500"
      step="1"
    ></v-slider>

    <v-img
      :aspect-ratio="16/9"
      :width="width"
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    ></v-img>
    <v-card-actions :aspect-ratio="16/9"
      :width="width" > 

                  <iframe src="https://www.google.com/maps/d/embed?mid=1yLyeV_SxGJv8fxJQMpyfwfrpIXRnmfJT" width="640" height="480"></iframe>  
                </v-card-actions>
  </div>
</template>


    <script>
    export default {
        data: () => ({
        width: 300,
        }),
    }
    </script>
