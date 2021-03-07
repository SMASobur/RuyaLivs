<template>
      <v-row dense>
        <v-col
          v-for="card in cards"
          :key="card.title"
          
        >
          <v-card class="ma-2"  elevation="2" >
            
            <v-img
              src="img/intro.png"
              class="primary--text align-end"
              max-height="350"
              
            >
            <div class="topright">
    
         <v-icon
          dark
          right
        
        >
         mdi-facebook
        </v-icon>
          <v-icon
          dark
          right
        
        >
         mdi-twitter
        </v-icon>
               
          <v-icon
          dark
          right
        
        >
         mdi-instagram 
        </v-icon>


   
        </div>
        
    
    
            
            </v-img>
            <v-card-actions>

 <p>{{card.subtitle}}
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
      </v-btn></p>
      
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
</template>

<script>

export default {
 
    data: () => ({
      cards: [
        { title: 'Try Our Online Order System and you will never go back', subtitle: 'we are here to serve you best with afortable price. we are here to serve you best with afortable price.we are here to serve you best with afortable price. we are here to serve you best with afortable price. we are here to serve you best with afortable price. ', flex: 12 , button_text:'go to shop', link:'/shop'},
        
    

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

  /* .txtgb{
  text-shadow:0px 0px 10px white;
  color:white;

} */

.topright {
  position: absolute;
  top: 8px;
  right: 16px;
  font-size: 18px;
}
     
</style>


