<template>
  <v-card>
    <v-card-title> Are you sure you want to delete this item ? </v-card-title>
    <v-card-actions>
      <v-col class="d-flex flex-row-reverse">
        <v-btn color="warning" text @click="onClickDelete"> Ok</v-btn>
        <v-btn color="primary" text @click="onClickCancel">Cancel</v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import authRules from "@/utils/authRuls";
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    deleteIndex: {
      type: Number,
    },
  },
  data() {
    return {};
  },
  methods: {
    onClickDelete() {
      this.items.splice(this.deleteIndex, 1);
      this.$emit("onClickDelete");
    },
    onClickCancel() {
      this.$emit("onClickCancel");
    },
  },
  computed: {},
};
</script>

<style>
</style>