<template>
<SettingLayout current-tab="businesses">
    <div class="sm:pr-14">
        <div class="flex items-center pb-5 sm:flex-row flex-col">
            <h2 class="sm:mr-auto truncate content-heading">
                Business List
            </h2>

            <router-link
                class="btn btn-primary"
                :to="{ name: 'add-businesses' }" tag="button">
                Add Business
            </router-link>
        </div>

        <SuccessAlert v-if="isSaved">
            {{alertMessage}}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="isSaved = false">
                <Lucide icon="X" class="w-4 h-4" />
            </button>
        </SuccessAlert>

        <div class="flex flex-col items-center py-10" v-if="!isLoaded">
            <LoadingIcon icon="grid" class="w-20" />
            <div class="text-center text-xl mt-2">Loading...</div>
        </div>

        <!-- BEGIN: Data List -->
        <div class="overflow-auto lg:overflow-visible"  v-if="isLoaded">
            <Table :columns="columns" :records="businesses" ></Table>
        </div>
        <!-- END: Data List -->
    </div>
</SettingLayout>
</template>

<script>
import SettingLayout from "../../settings/Setting-layout.vue"
import Table from "./Table.vue"
import { fetchBusiness ,showNotification } from "@/compositions/business/"

import {defineComponent, ref, watchEffect ,watch} from "vue"

export default defineComponent({
    name: "Businesses",
    components : {
        SettingLayout,
        Table
    },
    setup() {
    
        const columns = [
            { name : 'Name',    isCenter : false},
            { name : 'Action',  isCenter : true},            
        ]

        const isLoaded = ref(false)
        const { businesses,isSaved,alertMessage,status,error } = fetchBusiness()

        watchEffect(() => {
            if(status.value === 200) isLoaded.value = true                  
        })

         /* pop‑notification on first load & subsequent saves */
            watch(
            isSaved,
            (val) => {
                if (val) showNotification();
            },
            { immediate: true } // show toast if isSaved was already true
            );

        return {
            businesses,
            isSaved,
            alertMessage,
            error,
            columns,
            isLoaded,            
        }
    },
})
</script>