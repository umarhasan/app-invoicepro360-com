<template>
  <!-- <div class="text-right pb-2">
    <button 
        class="btn btn-secondary btn-sm text-primary hover:bg-theme-5 h-8 dark:text-white dark:border-dark-3"
        @click="$emit('showModal')">
      <Lucide icon="Edit2" class="w-3 h-3 mr-1 text-md" />
      Edit columns
    </button>
  </div> -->

  <table class="table table-invoice">
    <thead class="">
        <tr class="capitalize">
          <th class="whitespace-nowrap">
              <div class="flex flex-row justify-between">
                <div :class="{
                  'mt-4': 
                   !setting.invoice_columns.items.hide && ( 
                    setting.invoice_columns.units.hide ||
                    setting.invoice_columns.price.hide ||
                    setting.invoice_columns.taxable.hide ||
                    setting.invoice_columns.amount.hide )
                  }">{{ 
                    setting.invoice_columns.items.name == 'others' ?
                    setting.invoice_columns.items.value :
                    setting.invoice_columns.items.name 
                    }}</div>
                    <Lucide icon="EyeOff" class="w-4 h-4" v-if="setting.invoice_columns.items.hide" />
              </div>
          </th>
          <th class="text-right whitespace-nowrap w-20">
              <div class="flex flex-row justify-between">
                <div :class="{
                  'mt-4': 
                    !setting.invoice_columns.units.hide && (
                    setting.invoice_columns.items.hide || 
                    setting.invoice_columns.price.hide ||
                    setting.invoice_columns.taxable.hide ||
                    setting.invoice_columns.amount.hide )
                  }">{{ 
                    setting.invoice_columns.units.name == 'others' ?
                    setting.invoice_columns.units.value :
                    setting.invoice_columns.units.name 
                    }}</div>
                    <Lucide icon="EyeOff" class="w-4 h-4" v-if="setting.invoice_columns.units.hide" />
              </div>
          </th>

          <th class="text-center whitespace-nowrap w-20">
            <div class="flex flex-row justify-between">
              <div :class="{
                  'mt-4':
                    !setting.invoice_columns.taxable.hide && ( 
                    setting.invoice_columns.items.hide || 
                    setting.invoice_columns.units.hide ||
                    setting.invoice_columns.price.hide ||                                        
                    setting.invoice_columns.amount.hide )
                  }">{{ 
                    setting.invoice_columns.taxable.name == 'others' ?
                    setting.invoice_columns.taxable.value :
                    setting.invoice_columns.taxable.name 
                    }}</div>
                  <Lucide icon="EyeOff" class="w-4 h-4" v-if="setting.invoice_columns.taxable.hide" />
            </div>
          </th>

          <th class="text-right  whitespace-nowrap w-20">
            <div class="flex flex-row justify-between">
              <div :class="{
                  'mt-4': 
                    !setting.invoice_columns.price.hide && (
                    setting.invoice_columns.items.hide || 
                    setting.invoice_columns.units.hide ||
                    setting.invoice_columns.taxable.hide ||
                    setting.invoice_columns.amount.hide )
                  }">{{ 
                    setting.invoice_columns.price.name == 'others' ?
                    setting.invoice_columns.price.value :
                    setting.invoice_columns.price.name 
                    }}</div>
                  <Lucide icon="EyeOff" class="w-4 h-4" v-if="setting.invoice_columns.price.hide" />
            </div>
          </th>
          
          <th class="text-right whitespace-nowrap w-10">
            <div class="flex flex-row justify-between">
              <div :class="{
                  'mt-4': 
                    !setting.invoice_columns.amount.hide && (
                    setting.invoice_columns.items.hide || 
                    setting.invoice_columns.units.hide ||
                    setting.invoice_columns.price.hide ||
                    setting.invoice_columns.taxable.hide )
                    
                  }">{{ 
                    setting.invoice_columns.amount.name == 'others' ?
                    setting.invoice_columns.amount.value :
                    setting.invoice_columns.amount.name 
                    }}</div>
                  <Lucide icon="EyeOff" class="w-4 h-4" v-if="setting.invoice_columns.amount.hide" />
            </div>
          </th>
          <th class="w-10 action-col"></th>
        </tr>
    </thead>
    <tbody>
        <Item v-for="(item,index) in invoiceItems" :key="index" :item-index="index" :item="item" ></Item>
        <AddItem></AddItem>                
    </tbody>
 </table>
</template>

<script setup>

import { ref} from "vue";
import Item from "./Item.vue";
import AddItem from "./AddItem.vue";
const props = defineProps(['items','setting'])
const invoiceItems =  ref(props.items)
const setting =  ref(props.setting)

</script>
