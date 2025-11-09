<template>

    <div class="invoice-tax-list" :class="{'z-50':showDropDown}">
        <div class="relative text-left">
            <div class="px-3 py-2 w-full" @click="() => {showDropDown = !showDropDown }">
                {{taxName}}    
                <Lucide icon="chevronDown" class="w-4 h-4 absolute my-auto inset-y-0 mr-2 right-0"/>
            </div>    
        </div>

        <div v-if="showDropDown">
            <div class="text-left bg-white border-t">
                <div class="p-1 flex-1 relative">
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
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
export default defineComponent({
    props : ['taxes','selectedIds','taxName'],
    setup(props,{emit}) {

        const search = ref('')
        const taxName = ref(props.taxName)
        const showDropDown = ref(false)

        const selectTax = (tax) => {
            emit('selectTax',tax)
            taxName.value = tax.taxName +' ' + tax.taxRate + '%'
            showDropDown.value = false
        }        

        const filteredTaxes = computed(() => {
          return props.taxes.filter(tax => tax.taxName.match(search.value))
        })

        return {
            taxName,
            search,
            selectTax,
            showDropDown,
            filteredTaxes,
            selectedIds : props.selectedIds,
            placeholder : props.placeholder,
        }
    }

})
</script>

<style>

</style>