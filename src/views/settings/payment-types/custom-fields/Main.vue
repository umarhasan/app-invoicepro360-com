<template>
  <div class="pb-5">
    <div class="flex items-center pb-5">
      <h2 class="text-xl font-medium mr-auto truncate content-heading">Custom Fields</h2>

      <button type="button" class="btn btn-primary btn-sm" @click="addField">
        <Lucide icon="Plus" class="w-3 h-3 font-bold" />
        <span class="mx-1 align-middle">New</span>
      </button>
    </div>

    <table class="table">
      <tbody>
        <Item
          v-for="(item, index) in paymentTypes.custom_fields"
          :key="item.uid"
          :item-index="item.uid"
          :item="item"
        ></Item>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Item from "./Item.vue";

import { useCustomFields } from "@/compositions/settings/payment-types";

export default defineComponent({
  components: {
    Item,
  },
  setup(props) {
    const { paymentTypes, addField } = useCustomFields();

    return {
      paymentTypes,
      addField,
    };
  },
});
</script>
