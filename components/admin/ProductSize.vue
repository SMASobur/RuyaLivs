<template>
  <div>
    <v-card flat elevation="1">
      <v-card-title> Add Product Size Details </v-card-title>
      <v-card-text>
        <div class="ml-1">
          <v-form ref="sizeForm" v-model="isSizeFormValid">
            <v-row>
              <v-col cols="2">
                <v-text-field
                  v-model="productSizeDefination.size"
                  label="Size *"
                  placeholder="e.g small"
                  :rules="requiredFieldRule"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="productSizeDefination.price"
                  label="Price *"
                  placeholder="e.g 100"
                  :rules="priceRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="productSizeDefination.offer"
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
              <v-col>
                <v-btn
                  :disabled="!isSizeFormValid"
                  color="primary"
                  class="mt-4"
                  tile
                  @click="onClickAddSize"
                  >Add</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </div>

        <v-data-table
          :headers="productSizeTableHeader"
          :items="sizeAndPrice"
          class="elevation-1"
          hide-default-footer
          disable-sort
        >
          <template v-slot:item.offer="{ item }"> {{ item.offer }} % </template>
          <template v-slot:item.netPrice="{ item }">
            {{ getNetPrice(item.price, item.offer) }}
          </template>
          <template v-slot:item.isDefault="{ item }">
            <v-switch
              small
              :disabled="item.isDefault"
              v-model="item.isDefault"
              @change="onChangeDefault(item)"
            />
          </template>
          <template v-slot:item.isAvailable="{ item }">
            <v-switch v-model="item.isAvailable"> </v-switch>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)"
              >mdi-pencil</v-icon
            >
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="editDialog" max-width="700px" persistent>
      <edit-product-size
        :item="sizeToBeEdited"
        @onClickUpdateSize="onClickUpdateSize"
        @onCancelSizeEdit="onCancelSizeEdit"
      />
    </v-dialog>
    <v-dialog v-model="deleteDialog" max-width="400px">
      <delete-item
        :items="sizeAndPrice"
        :deleteIndex="editIndex"
        @onClickDelete="onClickDelete"
        @onClickCancel="onClickCancel"
      />
    </v-dialog>
  </div>
</template>

<script>
import authRules from "@/utils/authRuls";
import EditProductSize from "@/components/admin/EditProductSize";
import DeleteItem from "@/components/admin/DeleteItem";

export default {
  components: {
    EditProductSize,
    DeleteItem,
  },
  props: {
    sizeAndPrice: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      productSizeDefination: {
        isDefault: false,
        size: "",
        offer: "",
        price: "",
        netPrice: "",
        isAvailable: true,
      },
      priceRules: authRules.requiredNumberRules,
      offerRules: authRules.notRequiredNumberRules,
      requiredFieldRule: authRules.requiredFieldRule,
      isSizeFormValid: false,
      productSizeTableHeader: [
        { text: "Size", value: "size" },
        { text: "Price", value: "price" },
        { text: "Discount (%)", value: "offer" },
        { text: "Net price", value: "netPrice" },
        { text: "Is default", value: "isDefault" },
        { text: "Is Available", value: "isAvailable" },
        { text: "Actions", value: "actions" },
      ],
      editDialog: false,
      deleteDialog: false,
      editIndex: -1,
      sizeToBeEdited: null,
    };
  },
  methods: {
    onClickAddSize() {
      this.productSizeDefination.price = parseFloat(
        this.productSizeDefination.price
      );
      this.productSizeDefination.offer = !this.productSizeDefination.offer
        ? 0
        : parseFloat(this.productSizeDefination.offer);
      this.productSizeDefination.netPrice = parseFloat(this.netPrice);
      if (this.sizeAndPrice.length == 0)
        this.productSizeDefination.isDefault = true;
      else this.productSizeDefination.isDefault = false;

      const productSizeDefinationCopy = JSON.parse(
        JSON.stringify(this.productSizeDefination)
      );
      this.sizeAndPrice.push(productSizeDefinationCopy);
      this.$refs.sizeForm.reset();
    },
    getNetPrice(price, offer) {
      if (!isNaN(price) && !isNaN(offer)) {
        return price - (price * offer) / 100;
      }
      return 0;
    },
    editItem(item) {
      this.editIndex = this.sizeAndPrice.indexOf(item);
      this.sizeToBeEdited = JSON.parse(JSON.stringify(item));
      this.editDialog = true;
    },
    deleteItem(item) {
      this.editIndex = this.sizeAndPrice.indexOf(item);
      this.sizeToBeEdited = item;
      this.deleteDialog = true;
    },
    onChangeDefault(item) {
      const itemIndex = this.sizeAndPrice.indexOf(item);
      //   console.log("itemIndex", itemIndex);
      this.sizeAndPrice.forEach((item, index) => {
        if (itemIndex != index) {
          item.isDefault = false;
        }
      });
    },
    onClickUpdateSize(editedItem) {
      Object.assign(this.sizeAndPrice[this.editIndex], editedItem);
      this.editDialog = false;
    },
    onCancelSizeEdit() {
      this.editDialog = false;
    },
    onClickDelete() {
      this.deleteDialog = false;
    },
    onClickCancel() {
      this.deleteDialog = false;
    },
  },
  computed: {
    netPrice: {
      get() {
        if (
          !isNaN(this.productSizeDefination.price) &&
          !isNaN(this.productSizeDefination.offer)
        ) {
          return (
            this.productSizeDefination.price -
            (this.productSizeDefination.price *
              this.productSizeDefination.offer) /
              100
          );
        } else if (
          this.productSizeDefination.price &&
          !this.productSizeDefination.offer
        ) {
          return this.productSizeDefination.price;
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