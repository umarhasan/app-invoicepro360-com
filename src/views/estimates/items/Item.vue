<template>
  <tr class="item px-2 border-t">
    <td class="w-54">
      <div class="flex">
        <div class="text-gray-800 font-medium w-1/4">
          <input v-model="item.name" type="text" class="form-control" v-if="item.isNew" />
          <div v-if="!item.isNew" class="pl-2 pt-3">
            {{ item.name }}
          </div>
        </div>
        <div class="text-gray-800 text-sm ml-2 whitespace-nowrap w-3/4">
          <input v-model="item.description" type="text" class="form-control" />
        </div>
      </div>
    </td>
    <td class="w-20">
      <input
        type="text"
        class="form-control text-right"
        v-model="item.quantity"
        @keydown="updateItemTotal(item)"
        @change="updateItemTotal(item)"
        v-decimal
      />
    </td>
    <td class="w-20">
      <input
        type="text"
        class="form-control text-right"
        v-model="item.price"
        @keydown="updateItemTotal(item)"
        @change="updateItemTotal(item)"
        v-decimal="'auto'"
      />
    </td>
    <td class="w-20">
      <label class="yr-checkbox" :class="{ checked: item.isTaxable }">
        <div class="div-checkbox">
          <input
            type="checkbox"
            class="opacity-0 absolute cursor-pointer"
            :checked="item.isTaxable"
            disabled
          />
          <svg viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z" /></svg>
        </div>
        <div class="select-none">
          <slot></slot>
        </div>
      </label>
    </td>
    <td class="text-center w-10 font-medium" v-html="$h.formatCurrency(item.total)"></td>
    <td class="w-10 text-center">
      <Lucide icon="Trash2Icon"
        class="ml-3 -mt-2 hover:text-theme-6 cursor-pointer"
        @click="deleteItem(itemIndex)"
      />
    </td>
  </tr>
</template>

<script>
import { defineComponent } from "vue";
import { useInvoiceItems } from "@/compositions/invoices/items";

export default defineComponent({
  props: {
    item: Object,
  },
  setup(props) {
    const { deleteItem, updateItemTotal } = useInvoiceItems();

    return {
      item: props.item,
      updateItemTotal,
      deleteItem,
    };
  },
});
</script>

<style>
tr.item td {
  padding: 0.5em !important;
}
</style>
