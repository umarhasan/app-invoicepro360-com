<template>
    <tbody>
        <Item v-for="(item,index) in invoiceItems" :key="item.uid" :item-index="item.uid" :item="item" :taxes="records"></Item>
        <AddItem></AddItem>                
    </tbody>
</template>

<script>
import { defineComponent, ref} from "vue";
import Item from "./Item.vue";
import AddItem from "./AddItem.vue";
import {fetchSalesTax} from '@/compositions/settings/sales-tax'

export default defineComponent({
  components: {
    Item,
    AddItem,
  },
  props : ['items'],
  setup(props) {
      const invoiceItems = props.items

      const { records } = fetchSalesTax()

      return{
          invoiceItems,
          records
      }
  }

})

</script>
