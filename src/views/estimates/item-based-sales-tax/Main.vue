<template>
<tr>
    <td class="text-right text-sm font-medium">Tax</td>
    <td colspan="2" class="text-right relative">
        
        <TaxDropDown 
            :taxes="taxes" 
            :selected-ids="selectedIds" 
            :taxName="tax.taxName +' ' + tax.taxRate + '%'"
            placeholder="Select a tax"
            @selectTax="selectTax"></TaxDropDown>
    </td>
    <td class="w-10 text-center font-medium">{{$h.formatCurrency(tax.taxAmount)}}</td>
    <td class="w-10 text-center">
        <Lucide icon="Trash2" class="-mt-2 text-theme-6 hover:text-theme-6 cursor-pointer" @click="deleteTax(itemIndex,tax)" />
    </td>
</tr>    
</template>

<script>
import {defineComponent,ref} from 'vue'
import TaxDropDown from './Dropdown.vue';
import { useInvoiceItems } from "@/compositions/invoices/items"
export default defineComponent({
    components : {
        TaxDropDown
    },
    props : ['taxes','itemIndex',"tax","selectedIds"],
    setup(props){

        const { updateTax,deleteTax } = useInvoiceItems()

        const selectTax = (data) => {
            
            let tax = {
                id : data.id,
                taxName : data.taxName,
                taxAbbreviation : data.taxAbbreviation,
                taxNumber : data.taxNumber,
                taxRate : data.taxRate,
                taxAmount : 0
            }
            
            updateTax(props.itemIndex,tax,props.tax.id)
        }

        return {
            itemIndex : props.itemIndex,
            selectedIds : props.selectedIds,
            tax : props.tax,
            taxes : props.taxes,
            selectTax,
            deleteTax,
        }

    }

})
</script>

<style>

</style>