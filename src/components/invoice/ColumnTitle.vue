<template>
<div class="p-2">
    <span class="text-gray-800 text-base font-medium">{{name}}</span>
    <div class="mt-2">
        <div v-for="(item,index) in columns" 
        :key="index" class="flex item-center"
        :class="{
       'flex-1 w-full flex-col': checkedName.name === 'others' && item.value === 'others',
        }">
            <Radio classes="ml-2 mb-1"                             
                v-model:checked="checkedName.name" 
                :true-value="item.value" false-value="">
                {{item.name}}
            </Radio>
            <div :class="{
                'p-2': checkedName.name === 'others' && item.value === 'others',
                }">
            <input 
                type="text" class="form-control w-full block" 
                v-model="checkedName.value"
                v-if="checkedName.name == 'others' && item.value == 'others'" />
            </div>
        </div>                                        
    </div>
</div>
</template>

<script>
import { defineComponent} from "vue";
export default defineComponent({
  props : ['name','columns','checkedName'],
  setup(props) {

      return{
          name : props.name,
          columns : props.columns,
          checkedName : props.checkedName
      }
  }

})
</script>