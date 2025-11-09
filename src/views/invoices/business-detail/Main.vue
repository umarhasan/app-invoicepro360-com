<template>
    <div class="lg:ml-auto text-lg">
        <div>{{business.companyName}}</div>
        <div>{{business.phoneNumber}}</div>
        <div>{{business.addressLine1}} {{business.addressLine2}}</div>
        <div v-if="permissions.updateBusinessDetail">
            <a 
            class="btn btn-outline-primary border-dashed hover:bg-theme-5 btn-sm py-1 px-2" 
            @click="showEditBusinessModal">Edit Business Detail</a>
        </div>
        <EditBusinessModal  
            :records="business" 
            :countries="countries" 
            :states="states"
            :validate="validate" 
            :show-loading-icon="showLoadingIcon" 
            :saved="isSaved"
           @submitBusiness="submitBusiness"></EditBusinessModal>        
    </div>
</template>

<script>

import { defineComponent, onMounted } from "vue";
import { saveBusiness, businessDetail } from "@/compositions/business"
import EditBusinessModal from "./EditBusinessModal.vue";
import cash from "cash-dom"

export default defineComponent({
  components: {
    EditBusinessModal,
  },
  props : ['permissions'],
  setup(props,{emit}) {
    const {
      business_id,
      business,
      submit,
      validate,
      countries,
      states,
      showLoadingIcon,
      isSaved,
    } = saveBusiness('modal')

    const showEditBusinessModal = () => {
      isSaved.value = false
      showLoadingIcon.value = false
      cash('#edit-business-modal').modal('show')

    }
    
    onMounted(async () => {

        const holdBusiness = await businessDetail()

        business_id.value           = holdBusiness.id
        business.value.companyName  = holdBusiness.companyName
        business.value.companyType  = holdBusiness.companyType
        business.value.businessType = holdBusiness.businessType
        business.value.currency     = holdBusiness.currency
        business.value.addressLine1 = holdBusiness.addressLine1
        business.value.addressLine2 = holdBusiness.addressLine2
        business.value.country      = holdBusiness.country
        business.value.state        = holdBusiness.state
        business.value.city         = holdBusiness.city
        business.value.zipcode      = holdBusiness.zipcode
        business.value.fax          = holdBusiness.fax
        business.value.mobileNumber = holdBusiness.mobileNumber
        business.value.phoneNumber  = holdBusiness.phoneNumber
        business.value.website      = holdBusiness.website
        
      emit('setCompanyName',holdBusiness.companyName)

    })      

    return {
      permissions : props.permissions,
      showEditBusinessModal,
      validate,
      business,
      submitBusiness:submit,
      countries,
      states,
      showLoadingIcon,
      isSaved,
    };
  },
});
</script>