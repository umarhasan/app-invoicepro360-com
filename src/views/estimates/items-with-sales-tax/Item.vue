<template>
<tr class="item px-2 border-t">
    <td class="w-54">
        <div class="flex">
            <div class="text-gray-800 font-medium w-1/4">
                <input v-model="item.name" type="text" class="form-control" v-if="item.isNew"/>
                <div v-if="!item.isNew" class="pl-2 pt-3">
                    {{item.name}}
                </div>
            </div>
            <div class="text-gray-800 text-sm ml-2 whitespace-nowrap w-3/4">
                <input v-model="item.description" type="text" class="form-control"/>
            </div>
        </div>    
    </td>
    <td class="w-20">
        <input type="text" class="form-control text-right" v-model="item.quantity" @keydown="updateItemTotal(item)" @change="updateItemTotal(item)" v-decimal/>
    </td>
    <td class="w-20">
        <input type="text" class="form-control text-right" v-model="item.price" @keydown="updateItemTotal(item)" @change="updateItemTotal(item)" v-decimal="'auto'" />
    </td>
    <td class="text-center w-10 font-medium">
        {{ $h.formatCurrency(item.total) }}
    </td>
    <td class="w-10 text-center">
        <Lucide icon="Trash2" class="ml-3 -mt-2 hover:text-theme-6 cursor-pointer" @click="deleteItem(itemIndex)" />
    </td>
</tr>

<SalesTaxes 
    v-for="tax in item.salesTax" 
    :key="tax.id"
    :taxes="taxes"  
    :item-index="itemIndex" 
    :selected-ids="item.selectedTaxId"
    :tax="tax"></SalesTaxes>

<AddSalesTax :taxes="taxes" 
    :item-index="itemIndex" 
    :selected-ids="item.selectedTaxId"></AddSalesTax>

</template>

<script>
import { defineComponent } from "vue";
import { useInvoiceItems } from "@/compositions/invoices/items"

import  SalesTaxes  from "../sales-tax/Main.vue"
import  AddSalesTax  from "../sales-tax/AddSalesTax.vue"

export default defineComponent({
    props : {
        item : Object,
        taxes : Array,
        itemIndex : Number  
    },

    components : {
        SalesTaxes,
        AddSalesTax
    },
    setup(props) {

        const { deleteItem, updateItemTotal, calcTax } = useInvoiceItems()

        return {
            taxes : props.taxes,
            item  : props.item,
            itemIndex : props.itemIndex,
            updateItemTotal,
            deleteItem,
            calcTax,
        }
    }

})
</script>

<style>
    tr.item td{
        padding: 0.5em !important;
    }
</style>
