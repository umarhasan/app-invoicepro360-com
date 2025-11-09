<template>
    <div class="invoice-customer-list rounded relative">
        <div class="text-left border-b absolute w-full b-white top-0 z-25">
            <div class="px-3 py-1 flex-1 bg-white shadow-sm dark:bg-dark-3">
                <input type="text" :placeholder="placeholder"  class="form-control w-full dark:bg-dark-2" v-model="search"/>  
                <Lucide icon="Search" class="w-4 h-4 absolute my-auto inset-y-0 mr-5 right-0"/>
            </div>    
        </div>
        <div class="max-h-24 overflow-scroll bg-white dark:bg-dark-3 mt-16">
            <div class="relative text-left border-b" v-for="(c,key) in filteredCustomers" :key="key">
            <div class="px-3 py-2 flex-1 shadow-sm hover:bg-gray-200" 
                :class="{'bg-theme-3 selected hover:bg-theme-3' : c.id === customerId}"   
                @click="$emit('selectCustomer',c)">
                <div class="font-medium text-gray-600 text-xs"># {{c.uid}}</div>
                <div class="font-medium">{{c.customer}}</div>
                <div class="text-gray-600 text-xs">{{c.email}}</div>
                <div class="text-gray-600 text-xs">{{c.phone_number}}</div>
            </div>
            </div>
        </div>
        <div class="relative text-center border-t" v-if="permissions.newCustomer">
            <div class="p-3 flex-1 bg-white text-theme-1 hover:bg-theme-1 hover:text-white dark:bg-dark-3">
                <Lucide icon="PlusCircle" class="w-5 h-5 font-bold" />
                <a href="#" class="font-bold align-middle text-base" @click="$emit('showCustomerModal')"> 
                    Create <span v-if="search">"{{search}}" as </span> a new customer
                    </a>
            </div>    
        </div>
    </div>  
</template>

<script>
import { ref, computed } from 'vue'
export default {
    props : ['customerList','customerId','placeholder','permissions'],
    setup(props) {

        const search = ref('')
        const filteredCustomers = computed(() => {
          return props.customerList.filter(customer => customer.customer.match(search.value) || customer.email.match(search.value))
        })

        return {
            search,
            filteredCustomers,
            customerId : props.customerId,
            placeholder : props.placeholder,
            permissions : props.permissions,
        }
    }

}
</script>

<style>

</style>