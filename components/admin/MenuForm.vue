<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title v-if="!isEditForm">Menu creation form</v-card-title>
        <v-card-title v-else-if="isEditForm">Menu edit form</v-card-title>
        <v-card-text>
          <v-form ref="productForm" v-model="isProductFormValid">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="product.productName"
                  label="Product title *"
                  :rules="[(v) => !!v || 'This field is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <v-select
                  v-model="product.category"
                  :items="remoteCategories"
                  item-text="name"
                  item-value="id"
                  label="Product Categories *"
                  return-object
                  :rules="[(v) => !!v || 'This field is required']"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  v-model="product.articleNumber"
                  label="Product article number*"
                  :rules="[(v) => !!v || 'This field is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="product.qtyPerBox"
                  label="Quantity per box*"
                  :rules="requiredNumberRules"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-file-input
                  prepend-icon="mdi-image-plus"
                  type="file"
                  accept="image/*"
                  label="Thumbnail"
                  :loading="imageUpload"
                  @change="handleFileUpload"
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col
                    v-for="thumbnail in product.thumbnail"
                    :key="thumbnail"
                    cols="6"
                    md="3"
                    sm="3"
                    xs="3"
                  >
                    <div class="d-flex flex-column">
                      <v-img v-if="thumbnail" :src="thumbnail" contain></v-img>
                      <v-icon small @click="onClickDeleteThumbnail(thumbnail)"
                        >mdi-delete</v-icon
                      >
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-text-field
              v-model="product.description"
              label="Description *"
              :rules="[(v) => !!v || 'This field is required']"
              required
            ></v-text-field>
            <div>
              <v-switch
                v-model="product.hasMultipleSize"
                label="Has multiple size ?"
                messages="Some item might have multiple size e.g. Pizza"
              ></v-switch>
            </div>
            <div v-if="product.hasMultipleSize" class="mt-4">
              <product-size :sizeAndPrice="product.sizeAndPrice" />
            </div>
            <div v-if="!product.hasMultipleSize">
              <v-row>
                <v-col cols="3">
                  <v-text-field
                    v-model="product.price"
                    label="Price *"
                    :rules="requiredNumberRulesSupportFloat"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="product.offer"
                    append-icon="mdi-percent-outline"
                    label="Offer"
                    :rules="[offerRules]"
                    hint="discouct percentage"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    readonly
                    v-model="netPrice"
                    label="Net Price"
                    hint="auto calculated"
                    persistent-hint
                  ></v-text-field>
                </v-col>

                <v-col md="3">
                  <v-switch
                    v-model="product.isAvailable"
                    label="Available now ?"
                  ></v-switch>
                </v-col>
              </v-row>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="!isEditForm"
            color="primary"
            :loading="addingProduct"
            tile
            small
            :disabled="!isProductFormValid || !passedForMultiSize"
            @click="addProduct"
            >Save Product</v-btn
          >

          <v-btn
            v-if="isEditForm"
            color="primary"
            :loading="addingProduct"
            tile
            small
            :disabled="!isProductFormValid"
            @click="updateProduct"
            >Update Product</v-btn
          >
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import fileUploadMutation from "@/gql/mutation/uploadFile.gql";
import addProductMutation from "@/gql/mutation/addProduct.gql";
import updateProductMutation from "@/gql/mutation/updateProduct.gql";
import authRules from "@/utils/authRuls";
import ProductSize from "@/components/admin/ProductSize.vue";

export default {
  layout: "admin",
  props: {
    product: {
      type: Object,
    },
    isEditForm: {
      type: Boolean,
    },
  },
  components: {
    ProductSize,
  },
  async fetch() {
    this.fetchCategories();
  },
  data() {
    return {
      isFormValid: false,
      imageUpload: false,
      addingProduct: false,
      fieldMandatoryRules: [(v) => !!v || "Name is required"],
      isProductFormValid: false,
      hasMultipleSize: false,
      requiredNumberRules: authRules.requiredNumberRules,
      requiredNumberRulesSupportFloat: authRules.requiredNumberRulesSupportFloat,
      offerRules: authRules.notRequiredNumberRules,
    };
  },
  methods: {
    ...mapActions("menu", ["fetchCategories"]),

    async handleFileUpload(file) {
      if (!file) {
        return;
      }
      this.imageUpload = true;
      const response = await this.$apollo.mutate({
        mutation: fileUploadMutation,
        variables: { file },
      });

      this.imageUpload = false;
      const data = response.data.uploadFile;
      console.log("file upload data", data);
      if (data.success) {
        this.product.thumbnail.push(data.url);
        this.$notifier.showMessage({
          content: data.message,
          color: "success",
        });
      } else if (!data.success) {
        this.$notifier.showMessage({
          content: data.error,
          color: "error",
        });
      }
    },
    async addProduct() {
      // converting price and offer to nmber from string

      try {
        if (this.product.hasMultipleSize) {
          this.product.sizeAndPrice.forEach((element) => {
            if (element.isDefault) {
              this.product.price = parseFloat(element.price);
              this.product.offer = parseFloat(element.offer)
                ? parseFloat(element.offer)
                : 0;
              this.product.isAvailable = element.isAvailable
                ? element.isAvailable
                : false;
            }
          });
        } else {
          this.product.price = parseFloat(this.product.price);
          this.product.qtyPerBox = parseInt(this.product.qtyPerBox);
          this.product.offer = parseFloat(this.product.offer)
            ? parseFloat(this.product.offer)
            : 0;
          this.product.isAvailable = this.product.isAvailable
            ? this.product.isAvailable
            : false;
        }
        this.product.category = this.product.category.id
          ? this.product.category.id
          : this.product.category;

        console.log("product data", this.product);
        // return;
        this.addingProduct = true;
        const response = await this.$apollo.mutate({
          mutation: addProductMutation,
          variables: { product: this.product },
        });

        this.addingProduct = false;
        const data = response.data.addProduct;

        if (data.success) {
          this.$notifier.showMessage({
            content: data.message,
            color: "success",
          });
          this.$refs.productForm.reset();
          this.product.thumbnail = [];
        } else {
          this.$notifier.showMessage({
            content: data.message,
            color: "error",
          });
        }
      } catch (error) {
        this.$notifier.showMessage({
          content: error.message,
          color: "error",
        });
        this.addingProduct = false;
      }
    },
    async updateProduct() {
      try {
        const updatedProduct = {
          productName: this.product.productName,
          articleNumber: this.product.articleNumber,
          qtyPerBox: parseInt(this.product.qtyPerBox),
          price: parseFloat(this.product.price),
          offer: isNaN(parseFloat(this.product.offer))
            ? 0
            : parseFloat(this.product.offer),
          thumbnail: this.product.thumbnail,
          description: this.product.description,
          isAvailable: this.product.isAvailable,
          category: this.product.category.id
            ? this.product.category.id
            : this.product.category,
        };
        console.log("uuu", isNaN(parseFloat(this.product.offer)));
        console.log("updated product", updatedProduct);

        this.addingProduct = true;

        const response = await this.$apollo.mutate({
          mutation: updateProductMutation,
          variables: { id: this.product.id, product: updatedProduct },
        });

        this.addingProduct = false;
        const data = response.data.updateProduct;

        if (data.success) {
          this.$notifier.showMessage({
            content: data.message,
            color: "success",
          });

          this.onSaveEditedItem(this.netPrice);
        } else {
          this.$notifier.showMessage({
            content: data.message,
            color: "error",
          });
        }
        // this.$refs.productForm.reset();
        this.product.thumbnail = [];
      } catch (error) {
        this.$notifier.showMessage({
          content: error.message,
          color: "error",
        });
        this.addingProduct = false;
      }
    },
    // onRemovePhoto() {
    //   this.product.thumbnail = "";
    // },
    onClickDeleteThumbnail(val) {
      const thumbnailIndex = this.product.thumbnail.findIndex(
        (th) => th === val
      );
      console.log("thumbnailIndex", thumbnailIndex);
      this.product.thumbnail.splice(thumbnailIndex, 1);
    },
    onSaveEditedItem(item) {
      this.$emit("onSaveEditedItem", item);
    },
  },
  computed: {
    ...mapGetters("menu", ["remoteCategories"]),
    netPrice: {
      get() {
        if (!isNaN(this.product.price) && !isNaN(this.product.offer)) {
          return (
            this.product.price - (this.product.price * this.product.offer) / 100
          );
        } else if (!isNaN(this.product.price) && !this.product.offer) {
          return this.product.price;
        } else {
          return 0;
        }
      },
      set() {
        return 0;
      },
    },
    passedForMultiSize() {
      if (this.product.hasMultipleSize) {
        if (this.product.sizeAndPrice.length == 0) return false;
      }
      return true;
    },
  },
};
</script>

<style>
</style>