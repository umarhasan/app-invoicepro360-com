<template>
<div class="pb-5">
  <div class="text-left">
    <button 
        class="btn btn-outline-primary hover:bg-theme-5 border-dashed rounded-none rounded-t-md ml-5 h-8 border-b-0"
        @click="$emit('showModal')">
      <Lucide icon="Edit2" class="w-4 h-4 mr-1 text-md" />
      Edit columns
    </button>
  </div>
  <table class="table">
    <thead>
        <tr class="border-t-2 border-b-2 uppercase">
          <th class="whitespace-nowrap w-54">
              <div class="flex flex-col">
                <Lucide icon="EyeOff" class="w-4 h-4" v-if="setting.invoice_columns.items.hide" />
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
              </div>
          </th>
          <th class="text-right whitespace-nowrap w-20">
              <div class="flex flex-col">
                <Lucide icon="EyeOff" class="w-4 h-4" v-if="setting.invoice_columns.units.hide" />     
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
              </div>
          </th>
          <th class="text-left whitespace-nowrap w-20">
            <div class="flex flex-col">
              <Lucide icon="EyeOff" class="w-4 h-4" v-if="setting.invoice_columns.price.hide" />                  
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
            </div>
          </th>
          <th class="text-left whitespace-nowrap w-20">
            <div class="flex flex-col">
              <Lucide icon="EyeOff" class="w-4 h-4" v-if="setting.invoice_columns.taxable.hide" />
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
            </div>                      
          </th>
          <th class="text-right whitespace-nowrap w-10">
            <div class="flex flex-col">
              <Lucide icon="EyeOff" class="w-4 h-4" v-if="setting.invoice_columns.amount.hide" />            
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
            </div>
          </th>
          <th class="w-10"></th>
        </tr>
    </thead>
    <tbody>
        <Item v-for="(item,index) in invoiceItems" :key="item.uid" :item-index="item.uid" :item="item" ></Item>
        <AddItem></AddItem>                
    </tbody>
  </table>
</div>    
</template>

<script>
import { defineComponent} from "vue";
import Item from "./Item.vue";
import AddItem from "./AddItem.vue";

export default defineComponent({
  components: {
    Item,
    AddItem,
  },
  props : ['items','setting'],
  setup(props) {
      return{
          invoiceItems : props.items,
          setting : props.setting
      }
  }

})

</script>
