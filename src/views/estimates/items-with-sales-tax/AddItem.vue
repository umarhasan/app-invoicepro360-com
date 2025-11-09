<template>

    <tr>
        <td colspan="5" class="border-b" style="padding:0px !important" v-if="!itemLoaded">
            <div class="w-12 mx-auto">
                <LoadingIcon icon="oval" color="grey" class="w-2 h-2" />
                loading...
            </div>             
        </td>

        <td colspan="5" class="border-b border-t" style="padding:0px !important" v-if="itemLoaded">
            <button type="button" class="invoice-add-item w-full" v-if="!showItemsDropdown" @click="addItem">
                <Lucide icon="PlusCircle" class="w-5 h-5 font-bold" />
                <span class="ml-2 align-middle">Add an Item</span>
            </button>

            <div v-if="showItemsDropdown" v-click-away="hideItemDropdown">
                <ItemDropdown :product-list="items" placeholder="Select Item" @selectItem="selectItem" @addNewItem="addNewItem" />
            </div>  
        </td>
    </tr>
</template>

<script>
import { defineComponent, ref, watchEffect } from 'vue';
import ItemDropdown from "./ItemDropdown.vue";
import { useInvoiceItems } from "@/compositions/invoices/items"

export default defineComponent({
    components : {
        ItemDropdown
    },
    setup() {
        
        const itemLoaded = ref(false)

        const {
            addItem,
            addNewItem,
            fetchItems,
            hideItemDropdown,
            showItemsDropdown,
            selectItem,
            isItemLoaded,
            items,
        } = useInvoiceItems()

        fetchItems()

        watchEffect(() => {
            if(isItemLoaded.value) itemLoaded.value = true            
        })

        return {
            addItem,
            addNewItem,
            hideItemDropdown,
            showItemsDropdown,
            selectItem,
            itemLoaded,
            items,
        }
    }
})
</script>