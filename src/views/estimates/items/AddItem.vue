<template>
  <tr>
    <td colspan="6" class="border-b" style="padding: 0px !important" v-if="!itemLoaded">
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
    <div class="text-left">
      <button
        type="button"
        class="btn btn-md btn-primary mx-auto my-3 px-3"
        v-if="!showItemsDropdown"
        @click="addItem"
      >
        <Lucide icon="PlusCircle" class="w-4 h-4 font-bold" />
        <span class="ml-1 align-middle">Add Item</span>
      </button>
    </div>
      <div v-if="showItemsDropdown" v-click-away="hideItemDropdown">
        <ItemDropdown
          :product-list="items"
          :permissions="permissions"
          placeholder="Select Item"
          @selectItem="selectItem"
          @addNewItem="addNewItem"
        />
      </div>
    </td>
  </tr>
</template>

<script>
import { defineComponent, ref, watchEffect } from "vue";
import ItemDropdown from "./ItemDropdown.vue";
import { useEstimateItems } from "@/compositions/estimates/items";

export default defineComponent({
  components: {
    ItemDropdown,
  },
  setup() {
    const itemLoaded = ref(false);

    const {
      addItem,
      addNewItem,
      fetchItems,
      hideItemDropdown,
      showItemsDropdown,
      selectItem,
      isItemLoaded,
      items,
      permissions,
    } = useEstimateItems();

    fetchItems();

    watchEffect(() => {
      if (isItemLoaded.value) itemLoaded.value = true;
    });

    return {
      addItem,
      addNewItem,
      hideItemDropdown,
      showItemsDropdown,
      selectItem,
      itemLoaded,
      items,
      permissions,
    }
  }
})
</script>