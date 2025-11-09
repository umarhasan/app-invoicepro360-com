<template>
    <div class="overflow-auto lg:overflow-visible pt-5" v-if="accounts.length > 0">
        <table class="table">
            <tbody>
            <tr class="py-3" v-for="(account,index) in accounts" :key="index">
                <td class="border-b font-medium text-gray-700">{{ account.name }}</td>
                <td class="table-report__action border-b text-right">
                    <a class="btn btn-sm btn-danger rounded-full px-3 py-1" href="javascript:void(0);"> Delete</a>                    
                </td>
            </tr><!--v-if-->
            </tbody>
        </table>
    </div>
    <div v-if="!ischartofAccountLoaded" class="flex flex-col items-center py-10">
        <LoadingIcon icon="grid" class="w-20" />
        <div class="text-center text-xl mt-2">Loading...</div>
    </div>

</template>


<script>
import { defineComponent, onMounted, watchEffect } from "vue";
import { useChartofAccount } from "@/compositions/intuit/integrations";

export default defineComponent({
    
  setup() {
    const {
    //   fetchChartofAccounts,
      accounts,
      ischartofAccountLoaded,
    } = useChartofAccount();

    // onMounted( ()=> {
    //     fetchChartofAccounts()
    // })

    // watchEffect(() => { 
    //     console.log(ischartofAccountLoaded.value)
    //     fetchChartofAccounts()
                
    // },[ischartofAccountLoaded.value])

    return {
        accounts,
        ischartofAccountLoaded,
    };
  },
});
</script>