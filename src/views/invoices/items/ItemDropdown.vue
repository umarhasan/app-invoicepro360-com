<template>
    <div class="invoice-product-list rounded relative mx-10 mt-2 border">
            <div class="relative text-left border-b">
                <div class="px-3 py-2 flex-1 bg-white shadow-sm">
                    <input type="text" :placeholder="placeholder"  class="form-control w-full" v-model="search"/>  
                    <Lucide icon="Search" class="w-4 h-4 absolute my-auto inset-y-0 mr-5 right-0"/>
                </div>    
            </div>
            <div class="max-h-64 overflow-scroll bg-white">
                <div class="relative text-left border-b" v-for="(product,key) in filteredProducts" :key="key">
                <div class="px-3 py-2 flex-1 bg-white shadow-sm hover:bg-gray-200" 
                    @click="$emit('selectItem',product)">
                    <div class="font-medium capitalize">{{product.name}}</div>
                    <div class="text-gray-600 text-xs capitalize">{{product.description}}</div>
                </div>
                </div>
            </div>
            <div class="relative text-center border-t" v-if="permissions.newItem">
                
                <div class="p-3 flex-1 bg-white text-theme-1 hover:bg-theme-1 hover:text-white">
                <Lucide icon="PlusCircle" class="w-5 h-5 font-bold" />
                <a href="javascript:void(0)" class="font-bold align-middle text-base" @click="$emit('addNewItem',search)"> 
                    Create <span v-if="search">"{{search}}" as </span> a new item
                    </a>
                </div>
            </div>
    </div>  
</template>

<script>
import {ref,computed} from 'vue'
export default {
    props: ["placeholder","productList","permissions"],    
    setup(props) {

        const search = ref()

        const filteredProducts = computed( () => {
            return props.productList.filter( (product) => product.name.toLowerCase().match(search.value) || product.description.match(search.value)) 
        })

        return {
            search,
            filteredProducts,
            placeholder : props.placeholder,
            permissions : props.permissions,
        }
    }

}
</script>

<style>

</style>