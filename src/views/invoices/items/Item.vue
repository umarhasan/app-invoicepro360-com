<template>
  <tr class="item px-2 border-t" v-if="!item.isDeleted">
    <td width="50%">
      <div class="flex items-center">
        <div class="font-medium">
          <input v-model="item.name" type="text" class="form-control" v-if="item.isNew" />
          <div v-if="!item.isNew" class="capitalize font-semibold">
            {{ item.name }} <br>
            <span class="font-xs font-normal"> {{ item.description }}</span>
          </div>
        </div>
      </div>
    </td>
    <td width="10%">
      <input
        type="number"
        class="form-control text-right"
        v-model="item.quantity"
        @keydown="updateItemTotal(item)"
        @change="updateItemTotal(item)"
        v-decimal
      />
    </td>
    <td width="10%">
      <label class="yr-checkbox" >
        {{item.isTaxable ? 'Yes' : 'No'}}
      </label>
    </td>

    <td width="15%">
      <input
        type="text"
        class="form-control text-right"
        v-model="item.price"
        @keydown="updateItemTotal(item)"
        @change="updateItemTotal(item)"
        v-decimal="'auto'"
      />
    </td>
    <td class="text-right font-medium" v-html="$h.formatCurrency(item.total)" width="20%">

    </td>
    <td class="text-center" width="20%">
      <Lucide icon="Trash2Icon"
        class="text-danger dark:text-dark-3 w-4 h-4 cursor-pointer"
        @click="deleteItem(item.uid)"
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
    itemIndex : Number
  },
  setup(props) {
    const { deleteItem, updateItemTotal } = useInvoiceItems();

    return {
      item: props.item,
      itemIndex : props.itemIndex,
      updateItemTotal,
      deleteItem,
    };
  },
});
</script>
<style scoped>
tr.item td {
  padding: 0.5em !important;
}
</style>
