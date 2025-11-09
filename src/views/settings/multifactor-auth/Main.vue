<template>
<SettingLayout current-tab="multifactor-auth">
    <div class="grid grid-cols-12 gap-10">        
        <div class="col-span-12 mb-10">

            <SuccessAlert v-if="isSaved">
                multi-factor option has been updated
                <button type="button" class="btn-close" @click="isSaved = false">
                    <Lucide icon="X" class="w-4 h-4" />
                </button>
            </SuccessAlert>

            <DangerAlert v-if="!isMobileNumberValid">
                {{alertMessage}}
                <button type="button" class="btn-close" @click="error = false">
                    <Lucide icon="X" class="w-4 h-4" />
                </button>
            </DangerAlert>

            <div class="flex items-center pb-5">
                <h2 class="text-2xl font-medium mr-auto truncate">
                    Multi-factor Authentication
                </h2>
            </div>

            <div v-if="!isLoaded" class="flex flex-col items-center py-10">
                <LoadingIcon icon="grid" class="w-20" />
                <div class="text-center text-xl mt-2">Loading...</div>
            </div>
        
            <!-- BEGIN: Data List -->
            <div v-if="isLoaded"  class="overflow-auto lg:overflow-visible">
                <Table :records="records" @showSettingModal="showSettingModal"></Table>                         
                <SettingModalBox 
                    @save="save" 
                    @downloadLink="downloadLink"
                    @showBarcodeModal="showBarcodeModal"
                    :option="option" 
                    :showLoadingIcon="showLoadingIcon"
                    :alertMessage="alertMessage"
                    :isOpen="isSettingModal"
                    @close="isSettingModal = false"
                    :error="error"></SettingModalBox>
                <BarcodeModalBox 
                    :error="error" 
                    :alertMessage="alertMessage"
                    :isBarcodeGenerated="isBarcodeGenerated"
                    :barcodeImage="barcodeImage"
                    :isOpen="isBarcodeModal"
                    @close="isBarcodeModal = false"></BarcodeModalBox>                                              
            </div>
            <!-- END: Data List -->
        </div>
    </div>
       
</SettingLayout>    

</template>

<script setup>

import SettingLayout from "../Setting-layout.vue"
import SettingModalBox from "./Modalbox.vue"
import BarcodeModalBox from "./Barcode-Modalbox.vue"
import Table from "./Table.vue"
import {ref, watchEffect,watch  } from "vue"
import { useMFA } from "@/compositions/settings/multifactor-auth"

    const isLoaded = ref(false)
    const {
        status,
        error,             
        isSaved, 
        option, 
        records,
        showSettingModal,
        showLoadingIcon,
        alertMessage,
        save,            
        downloadLink,
        showBarcodeModal,
        isBarcodeGenerated,
        barcodeImage,
        isMobileNumberValid,
        isSettingModal,
        isBarcodeModal,
        showNotification
    }  =  useMFA();
    


    watchEffect(() => {
        if(status.value === 200) isLoaded.value = true                  
    });
    
    watch(isSaved, () => {
      if (isSaved.value) showNotification();
    });

</script>
