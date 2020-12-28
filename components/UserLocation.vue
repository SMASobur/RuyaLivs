<template>
  <div>
    <!-- <GMap
      ref="gMap"
      language="en"
      :cluster="{options: {styles: clusterStyle}}"
      :center="{lat: locations[0].lat, lng: locations[0].lng}"
      :options="{fullscreenControl: false, styles: mapStyle}"
      :zoom="15"
    >
      <GMapMarker
        v-for="location in locations"
        :key="location.id"
        :position="{lat: location.lat, lng: location.lng}"
        :options="{icon: location === currentLocation ? pins.selected : pins.notSelected}"
        @click="currentLocation = location"
      >
        <GMapInfoWindow :options="{maxWidth: 200}">
          <code>
            lat: {{ location.lat }},
            lng: {{ location.lng }}
          </code>
        </GMapInfoWindow>
      </GMapMarker>
      <GMapCircle :options="circleOptions" />
    </GMap>-->
    <v-text-field id="searchTextField" v-model="input"></v-text-field>
  </div>
</template>

<script>
import imageSelected from "@/assets/images/map/map_pin_selected.png";
import imageUnSelected from "@/assets/images/map/map_pin_unselected.png";
export default {
  data() {
    return {
      currentLocation: {},
      circleOptions: {},
      locations: [
        {
          lat: 44.933076,
          lng: 15.629058,
        },
        {
          lat: 45.815,
          lng: 15.9819,
        },
        {
          lat: 45.12,
          lng: 16.21,
        },
      ],
      pins: {
        selected: imageSelected,
        notSelected: imageUnSelected,
      },
      mapStyle: [],
      clusterStyle: [
        {
          url:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
          width: 56,
          height: 56,
          textColor: "#fff",
        },
      ],
      input: "",
    };
  },
  methods: {
    async getStreetAddressFrom(lat, long) {
      try {
        var { data } = await this.$axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
            lat +
            "," +
            long +
            "&key=AIzaSyA7hcdnNTKyEyxGiCtQ_FTRNU-lQktGeac"
        );
        if (data.error_message) {
          console.log(data.error_message);
        } else {
          this.address = data.results[0].formatted_address;
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  },
  mounted() {
    // var input = document.getElementById("searchTextField");
    // var options = {
    //   bounds: defaultBounds,
    //   types: ["establishment"],
    // };
    // this.autocomplete = new google.maps.places.Autocomplete(input, options);

    navigator.geolocation.getCurrentPosition((position) => {
      console.log("user location", position.coords);
      this.getStreetAddressFrom(position.coords.latitude, position.coords.longitude)
    });
  },
};
</script>

<style>
</style>