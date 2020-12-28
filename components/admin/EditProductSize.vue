<template>
  <v-card>
    <v-card-title> Update Product Size Details </v-card-title>
    <v-card-text>
      <v-form ref="sizeForm" v-model="isSizeFormValid">
        <v-row>
          <v-col cols="2">
            <v-text-field
              v-model="item.size"
              label="Size *"
              placeholder="e.g small"
              :rules="requiredFieldRule"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="item.price"
              label="Price *"
              placeholder="e.g 100"
              :rules="priceRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="item.offer"
              append-icon="mdi-percent-outline"
              label="Offer"
              :rules="[offerRules]"
              placeholder="e.g 20"
              hint="discouct percentage"
              persistent-hint
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              readonly
              v-model="netPrice"
              label="Net price"
              hint="auto calculated"
              persistent-hint
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-col>
        <v-btn
          :disabled="!isSizeFormValid"
          color="primary"
          tile
          small
          @click="onClickUpdateSize"
          >Update</v-btn
        >
        <v-btn
          :disabled="!isSizeFormValid"
          color="warning"
          tile
          small
          @click="onCancelSizeEdit"
          >Cancel</v-btn
        >
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import authRules from "@/utils/authRuls";
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      priceRules: authRules.requiredNumberRules,
      offerRules: authRules.notRequiredNumberRules,
      requiredFieldRule: authRules.requiredFieldRule,
      isSizeFormValid: false,
    };
  },
  methods: {
    onClickUpdateSize() {
      if (!this.item.offer || this.item.offer.length == 0) this.item.offer = 0;
      this.$emit("onClickUpdateSize", this.item);
    },
    onCancelSizeEdit() {
      this.$emit("onCancelSizeEdit");
    },
  },
  computed: {
    netPrice: {
      get() {
        if (!isNaN(this.item.price) && !isNaN(this.item.offer)) {
          return this.item.price - (this.item.price * this.item.offer) / 100;
        } else if (this.item.price && !this.item.offer) {
          return this.item.price;
        } else {
          return 0;
        }
      },
      set() {
        return 0;
      },
    },
  },
};
</script>

<style>
</style>