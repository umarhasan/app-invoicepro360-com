<template>
  <tr>
    <td colspan="3" class="border-b" style="padding: 0px !important" v-if="!itemLoaded">
      <div class="w-12 mx-auto">
        <LoadingIcon icon="oval" color="grey" class="w-2 h-2" />
        loading...
      </div>
    </td>

    <td
      colspan="6"
      class="border-b border-t"
      style="padding: 0px !important"
      v-if="itemLoaded"
    >
      <button type="button" class="invoice-add-item w-full" @click="addItem">
        <Lucide icon="PlusCircle" class="w-5 h-5 font-bold" />
        <span class="ml-2 align-middle">Add Tax Rate</span>
      </button>
    </td>
  </tr>
</template>

<script>
import { defineComponent, ref, watchEffect } from "vue";

import { useTaxItems } from "@/compositions/settings/sales-tax";

export default defineComponent({
  setup() {
    const itemLoaded = ref(false);

    const { addItem, isItemLoaded, fetchtaxAgencies } = useTaxItems();

    fetchtaxAgencies();

    watchEffect(() => {
      if (isItemLoaded.value) itemLoaded.value = true;
    });

    return {
      addItem,
      itemLoaded,
    };
  },
});
</script>
