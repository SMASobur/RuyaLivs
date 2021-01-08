<template>
  <div>
    <v-dialog persistent v-model="shouldOpen" max-width="700px">
      <v-card>
        <v-card-title class="headline">Edit Order Item</v-card-title>
        <v-card-text>
          <!-- <pre>{{ items }}</pre> -->
          <v-data-table
            :headers="headers"
            :items="orderItems"
            hide-default-footer
            disable-sort
          >
            <template v-slot:item.productQuantity="{ item }">
              <v-text-field
                class="mt-2"
                dense
                :rules="requiredNumberRules"
                :value="item.productQuantity"
                @input="onInputQuantity($event, item)"
              >
                {{ item.productQuantity }}
              </v-text-field>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="onclickDelete(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" :disabled="loading" text @click="onClickClose"
            >Close</v-btn
          >
          <v-btn
            color="accent"
            :disabled="isQuantityValid"
            :loading="loading"
            text
            @click="onClickUpdate"
            >Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete the item ?</v-card-title
        >
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="accent"
            :disabled="loading"
            text
            @click="showDeleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn color="accent" text @click="onConfirmDelete">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { requiredNumberRules } from "@/utils/authRuls.js";
import { mapActions, mapGetters } from "vuex";
console.log(requiredNumberRules);
export default {
  props: {
    shouldOpen: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.orderItems = JSON.parse(JSON.stringify(this.items.cartItems));
    console.log(this.orderItems);
  },
  data() {
    return {
      headers: [
        { text: "Product Name", value: "productName" },
        { text: "Price/Unit", value: "pricePerUnit" },
        { text: "Ordered Quantity", value: "productQuantity" },
        { text: "Actions", value: "actions" },
      ],
      deleteIndex: -1,
      itemToBeDeleted: null,
      requiredNumberRules: requiredNumberRules,
      orderItems: null,
      showDeleteDialog: false,
      loading: false,
    };
  },
  methods: {
    ...mapActions("order", ["updateOrderItems"]),

    onclickDelete(orderItem) {
      const deletItemIndex = this.orderItems.findIndex(
        (item) => item.productId === orderItem.productId
      );
      this.deleteIndex = deletItemIndex;
      console.log("deletItemIndex", deletItemIndex);
      this.itemToBeDeleted = orderItem;
      this.showDeleteDialog = true;
    },
    onConfirmDelete() {
      this.orderItems.splice(this.deleteIndex, 1);
      this.showDeleteDialog = false;
    },
    onInputQuantity(quanitity, item) {
      item.productQuantity = quanitity;
    },
    onClickClose() {
      this.$emit("onClickClose");
    },
    async onClickUpdate() {
      try {
        this.loading = true;
        this.orderItems.forEach((element) => {
          element.productQuantity = parseInt(element.productQuantity);
          delete element.__typename;
        });
        console.log("order items", this.orderItems);

        const input = {
          id: this.items.id,
          items: this.orderItems,
        };
        const updateOrderItemsData = await this.updateOrderItems(input);
        console.log("updateOrderItemsData", updateOrderItemsData);

        if (updateOrderItemsData.success) {
          const updatedData = {
            cart: updateOrderItemsData.cart,
            message: updateOrderItemsData.message,
          };
          this.$emit("onSuccessUpdateOrderItems", updatedData);
        }
      } catch (error) {
        console.log("onClickUpdate error", error);
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    isQuantityValid() {
      const anyNonInt = this.orderItems.some(
        (item) => /^\d+(,\d{1,2})?$/.test(item.productQuantity) == false
      );
      // console.log("anyNonInt", anyNonInt);
      return anyNonInt;
    },
  },
};
</script>

<style>
</style>