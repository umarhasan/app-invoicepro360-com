<template>
<setting-layout current-tab="user-management">
    <div class="grid grid-cols-12 gap-0 md:gap-5 lg:gap-10" v-show="viewGrid">        
        <div class="col-span-12 mb-10">

            <DangerAlert v-if="error">
                {{error}}
                 <button type="button" class="btn-close" @click="error = null">
                    <Lucide icon="X" class="w-4 h-4" />
                </button>
            </DangerAlert>
            
            <SuccessAlert v-if="isSaved">
                User saved successfully.
                <button type="button" class="btn-close" @click="isSaved = false">
                    <Lucide icon="X" class="w-4 h-4" />
                </button>
            </SuccessAlert>

            <SuccessAlert v-if="isDeleted">
                User deleted successfully.
                <button type="button" class="btn-close" @click="isDeleted = false">
                    <Lucide icon="X" class="w-4 h-4" />
                </button>
            </SuccessAlert>

            <div class="flex items-center pb-5 sm:flex-row flex-col">
                <h2 class="text-2xl font-medium mr-auto">
                    User Management
                </h2>

                <button 
                    v-if="permissions.create"
                    class="add-btn"
                    tag="button"
                    @click="showForm">Invite User</button>
            </div>

            <div v-if="!isLoaded" class="flex flex-col items-center py-10">
                <LoadingIcon icon="grid" class="w-20" />
                <div class="text-center text-xl mt-2">Loading...</div>
            </div>

            <!-- BEGIN: Data List -->
            <div v-if="isLoaded" class="overflow-auto lg:overflow-visible">
                <Table 
                    :columns="columns" 
                    :records="records" 
                    :can-create="permissions.create" 
                    :can-edit="permissions.edit" 
                    :can-delete="permissions.delete"
                    @deleteUser="showDeleteModal"
                    @readUser="readUser"
                    @showForm="showForm"></Table>
            </div>
            <!-- END: Data List -->            
        </div>
    </div>

    <div class="grid grid-cols-12 gap-0 md:gap-5 lg:gap-10" v-show="viewForm">
        <CreateForm></CreateForm>
    </div>
    <DeleteModal @delete="confirmDelete"></DeleteModal>
</setting-layout>
</template>

<script>

import SettingLayout from "../Setting-layout.vue"
import Table from "./Table.vue"
import CreateForm from "./CreateForm.vue"
import { 
    fetchUsers, 
    confirmDelete, 
    showDeleteModal, 
    showForm,
    readUser,
    showNotification,

} from '@/compositions/settings/user'
import {defineComponent, ref, watchEffect ,watch } from "vue"

export default defineComponent({
    components : {
        SettingLayout,
        Table,
        CreateForm
    },
    setup() {    

        const isLoaded = ref(false)
                
        const columns = [
            { name : 'Name',    isCenter : false},
            { name : 'Action',  isCenter : true},            
        ]
        
        const {
            records, 
            error, 
            status, 
            isSaved, 
            isDeleted, 
            permissions,
            viewGrid,
            viewForm
        } = fetchUsers();
        
        watchEffect(() => {
            if(status.value === 200) isLoaded.value = true
           if(viewForm.value) isLoaded.value = false                  
        })

        watch(isSaved, () => {
          if (isSaved.value) showNotification();
        });

        /**
         * 
         * selectAll()
         * select()
         * deleteAll()
         * resendInvitation()
         * 
         * */
        
        return {
            showForm,
            columns,
            records,
            isLoaded,
            readUser,
            confirmDelete,
            showDeleteModal,
            error,
            isSaved,
            isDeleted,                
            permissions,
            viewGrid,
            viewForm,
            showNotification,
        }
    },
})
</script>
