<template>
<table class="table">
    <thead class="border-b">
        <tr>
            <th class="text-left">
                <div class="align-middle">Company Name</div>                
            </th>
            <th class="text-right">
                <div class="align-middle"></div>                
            </th>
        </tr>
    </thead>
<tbody>
<tr v-for="(row, index) in rows" :key="index" class="py-5 border-gray-400 " :class="{ 'border-t' : index > 0 }">

    <td class="text-normal text-gray-700 whitespace-nowrap">
        <div class="flex">
            {{row.companyName}} 
        </div>
    </td>
    <td class="table-report__action flex justify-end ">
        <set-business :defaultId="user.default_business_id"  :id="row.id" @set="setDefaultBusiness"></set-business>
        <Tippy tag="div" class="pl-5" content="Edit Business">
            <router-link class="btn-outline-dark  w-16 ml-auto" 
            :to="{ name : 'edit-businesses' ,params: { business_id: row.id } }">
                <Lucide icon="Settings" />
            </router-link>
        </Tippy>
    </td>
</tr>
</tbody>

</table>    
</template>

<script>
import setBusiness from "@/components/set-business/Main.vue"
import { useAuth } from "@/compositions/auth"

export default {
    props : ['columns','records','defaultBusinessId'],
    components : {
        setBusiness
    },
    setup(props){
        const cols      = props.columns
        const rows      = props.records        

        const {user, setDefaultBusiness} = useAuth()

        return {
            user,
            cols,
            rows,
            setDefaultBusiness
        }
    }

}
</script>
