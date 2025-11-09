<template>
  <div class="flex justify-between relative">
    <span class="absolute -left-[20px]">
        <Lucide icon="Trash2Icon"
          class="w-4 h-4 text-theme-6 hover:text-theme-6 cursor-pointer"
          @click="deleteTax(tax)"
        />
      </span>
    <div class="text-left font-bold">{{ tax.taxName }} {{ tax.taxRate }}%</div>
    <div class="text-right">
      <span v-html="$h.formatCurrency(tax.taxAmount)"></span>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

import { useInvoiceItems } from "@/compositions/invoices/items";
export default defineComponent({
  props: ["tax"],
  setup(props) {
    const tax = ref(props.tax);
    const { deleteTax } = useInvoiceItems();
    return {
      tax,
      deleteTax,
    };
  },
});
</script>
