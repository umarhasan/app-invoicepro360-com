<template>
    <div class="border-b border-gray-200" >
      <div class="">
        <h2 class="text-lg font-medium border-b border-gray-200 mb-5 tracking-wider p-3">
          Sync Settings
        </h2>

        <SuccessAlert :cssClass="['mx-5' ,'py-3.5']" v-if="isAlert">
          {{alertMessage}}
          <button type="button" class="btn-close" @click="isAlert = false">
              <Lucide icon="X" class="w-4 h-4" />
          </button>
        </SuccessAlert>
        <div class="form-check mb-3 px-3">
          <input
            id="allow-customer-sync"
            data-target="#input"
            class="form-check-switch"
            type="checkbox"
            v-model="intuitSyncSettings.isCustomerSyncAllowed"
          />
          <label class="form-check-label ml-3" for="allow-customer-sync"
            >Allow Customer Sync</label
          >
        </div>
        <div class="form-check mb-3 px-3">
          <input
            id="allow-product-sync"
            data-target="#input"
            class="form-check-switch"
            type="checkbox"
            v-model="intuitSyncSettings.isItemSyncAllowed"
          />
          <label class="form-check-label ml-3" for="allow-product-sync"
            >Allow Product Sync</label
          >
        </div>

        <div class="form-check px-3">
          <input
            id="allow-invoice-sync"
            data-target="#input"
            class="form-check-switch"
            type="checkbox"
            v-model="intuitSyncSettings.isInvoiceSyncAllowed"
          />
          <label class="form-check-label ml-3" for="allow-invoice-sync"
            >Allow Invoice Sync</label
          >
        </div>
      </div>
      <div class="flex px-3 mt-5 pb-5">
        <button type="button" 
        class="btn btn-primary px-10 tracking-wider rounded-full"
        :class="{ disable: ShowLoadingIcon }"
          :disabled="ShowLoadingIcon"
        @click="updateSetting('save')">
          <LoadingIcon icon="oval" color="white" class="w-5 h-5" v-if="ShowLoadingIcon" />
          <span>Save</span>
        </button>
      </div>
    </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useIntegration } from "@/compositions/intuit/integrations";

export default defineComponent({

    setup(props){

        const {
            isAlert,
            alertMessage,
            ShowLoadingIcon,
            intuitSyncSettings,
            updateSetting
        } = useIntegration();


        return {
            isAlert,
            alertMessage,
            ShowLoadingIcon,
            intuitSyncSettings,
            updateSetting
        }
    }
})

</script>