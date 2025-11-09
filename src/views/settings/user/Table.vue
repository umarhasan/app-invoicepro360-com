<template>
<table class="table box">
    <thead class="border-b">
        <tr>
            <th class="flex flex-start">
                <!-- <label class="yr-checkbox">
                    <div class="div-checkbox">
                        <input type="checkbox" class="opacity-0 absolute">
                        <svg viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                    </div>
                </label> -->
                <div class="align-middle">Name / Email</div>                
            </th>
            <th> Role</th>
            <th> Status</th>

            <th></th>
        </tr>
    </thead>
<tbody>
<tr v-for="(row, index) in rows" :key="index" class="py-5 border-gray-400 " :class="{ 'border-t' : index > 0 }">

    <td class="text-normal text-gray-700 whitespace-nowrap flex items-center">
        <!-- <label class="yr-checkbox">
            <div class="div-checkbox">
                <input type="checkbox" class="opacity-0 absolute">
                <svg viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
            </div>
        </label> -->
        <div class="flex justify-between capitalize">
            <div>
                {{row.firstName}} {{row.lastName}}
                <div class="text-gray-600 text-xs lowercase">{{row.email}}</div>                
            </div>
        </div>
    </td>
    <td class="items-center capitalize">
        {{row.role}}
    </td>
    <td class="items-center"> 
        <span class="py-1 px-2 rounded text-xs bg-theme-9 text-white font-medium capitalize">{{row.status}}</span>
    </td>

    <td class="table-report__action">
        <div class="flex">
            <div class="ml-auto">
                <a v-if="canEdit" class="btn btn-sm btn-outline-primary rounded-full w-16 mr-2" 
                    href="javascript:void(0);" @click="$emit('readUser',row)">Edit</a>
                <a v-if="canDelete" class="btn btn-sm btn-outline-danger rounded-full w-16" 
                    href="javascript:void(0);" @click="$emit('deleteUser',row)">Delete</a>
            </div>
        </div>
    </td>
</tr>

<tr v-if="!rows">
    <td colspan="4" class="border-b text-normal text-gray-700 text-center font-bold">
        No records found. 
        <span v-if="canCreate">
            <a class="font-bold text-blue-600 underline" 
                href="javascript:void(0);" @click="$emit('showForm')">Invite User</a>
        </span>
    </td>
</tr>
</tbody>

</table>    
</template>

<script>

export default {
    props : ['columns','records','canEdit','canDelete','canCreate'],
    setup(props){
        const cols      = props.columns
        const rows      = props.records
        const canCreate   = props.canCreate
        const canEdit   = props.canEdit
        const canDelete = props.canDelete

        return {
            cols,
            rows,
            canEdit,
            canDelete,
            canCreate
        }
    }

}
</script>
