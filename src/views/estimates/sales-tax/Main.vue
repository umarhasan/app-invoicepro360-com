<template>
  <div class="text-base flex justify-between">
    <div class="text-left">{{ tax.taxName }} {{ tax.taxRate }}%</div>
    <div class="text-right relative pr-3">
      <span v-html="$h.formatCurrency(tax.taxAmount)"></span>
      <span class="absolute -right-3">
        <Lucide icon="Trash2Icon"
          class="w-4 h-4 text-theme-6 hover:text-theme-6 cursor-pointer"
          @click="deleteTax(tax)"
        />
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import { useInvoiceItems } from "@/compositions/invoices/items";
export default defineComponent({
  props: ["tax"],
  setup(props) {
    const { deleteTax } = useInvoiceItems();

    return {
      tax: props.tax,
      deleteTax,
    };
  },
});
</script>

<style></style>
