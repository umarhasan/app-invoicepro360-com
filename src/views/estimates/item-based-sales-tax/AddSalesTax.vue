<template>
<tr class="add-sales-tax">
    <td class="text-right text-base font-medium">Tax</td>
    <td colspan="2" class="text-right relative">
        <div class="invoice-tax-list rounded" :class="{'z-50':showDropDown}">
            <div class="relative text-left">
                <div class="px-3 py-2 w-full" @click="() => {showDropDown = !showDropDown }">
                    {{taxName}}    
                    <Lucide icon="chevronDown" class="w-4 h-4 absolute my-auto inset-y-0 mr-2 right-0"/>
                </div>    
            </div>

            <div v-if="showDropDown" >
                <div class="text-left bg-white border-t">
                    <div class="p-1 flex-1  relative">
                        <input type="text" placeholder="Select a tax"  class="form-control w-full" v-model="search"/>  
                        <Lucide icon="Search" class="w-4 h-4 absolute my-auto inset-y-0 mr-2 right-0"/>
                    </div>    
                </div>
                <div class="tax-options">
                    <div v-for="(tax,key) in filteredTaxes" :key="key">
                        <div class="item" @click="selectTax(tax)" v-if="!selectedIds.includes(tax.id)">
                            {{tax.taxName}} - {{tax.taxRate}} %
                        </div>

                        <div class="item" :class="{'disabled': selectedIds.includes(tax.id) }" v-if="selectedIds.includes(tax.id)">
                            {{tax.taxName}} - {{tax.taxRate}} %
                        </div>
                    </div>
                </div>            
                <div class="text-center border-t">
                    <div class="p-3 flex-1 bg-white text-theme-1 hover:bg-theme-1 hover:text-white">
                        <Lucide icon="PlusCircle" class="w-5 h-5 font-bold" />
                        <a href="#" class="font-bold align-middle text-base" @click="$emit('showTaxModal')"> 
                            Create <span v-if="search">"{{search}}" as </span> a new tax
                        </a>
                    </div>    
                </div>
            </div>
        </div>
    </td>
    <td class="w-10 text-center font-medium"></td>
    <td class="w-10 text-center"></td>
</tr>    
</template>

<script>
import {defineComponent,ref, computed} from 'vue'
import { useInvoiceItems } from "@/compositions/invoices/items"
export default defineComponent({
    props : ['taxes','itemIndex','selectedIds'],
    setup(props){
        const search = ref('')
        const taxName = ref('Select a tax')
        const showDropDown = ref(false)        

        const { addTax } = useInvoiceItems()

        const selectTax = (data) => {

            let tax = {
                id : data.id,
                taxName : data.taxName,
                taxAbbreviation : data.taxAbbreviation,
                taxNumber : data.taxNumber,
                taxRate : data.taxRate,
                taxAmount : 0
            }


            addTax(props.itemIndex,tax)
            showDropDown.value = false
        }
      
        const filteredTaxes = computed(() => {
          return props.taxes.filter(tax => tax.taxName.match(search.value))
        })

        return {
            search,
            taxName,
            showDropDown,
            filteredTaxes,
            selectTax,
            selectedIds : props.selectedIds,
        }

    }

})
</script>

<style>

</style>