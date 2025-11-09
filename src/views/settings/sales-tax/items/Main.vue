<template>
  <div class="pb-5">
    <table class="table">
      <thead>
        <tr class="border-t-2 border-b-2 uppercase">
          <th class="whitespace-nowrap w-20">Name</th>
          <th class="text-left whitespace-nowrap w-20" v-if="showTaxAgencyField">Tax Agency</th>
          <th class="text-left whitespace-nowrap w-20">Rate</th>
          <th class="w-10"></th>
        </tr>
      </thead>
      <tbody>
        <Item
          v-for="(item, index) in taxItems"
          :key="item.uid"
          :item-index="item.uid"
          :item="item"
        ></Item>
        <AddItem></AddItem>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Item from "./Item.vue";
import AddItem from "./AddItem.vue";
import { useTaxItems } from "@/compositions/settings/sales-tax";

export default defineComponent({
  components: {
    Item,
    AddItem,
  },
  setup(props) {
    const { taxItems, showTaxAgencyField } = useTaxItems();

    return {
      taxItems,
      showTaxAgencyField,
    };
  },
});
</script>
