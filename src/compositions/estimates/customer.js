import { reactive, toRefs } from "vue"

import { useApi } from "@/compositions/api"
import { useUtils } from "@/compositions/utils"
import config from "@/config"
import { saveCustomer, resetForm } from "@/compositions/customer"
import cash from "cash-dom"

const state = reactive({
    billedCustomer : [],
    customerId: '',
    showCustomerDropdown : false,
    isCustomerPreview : false,
    customers: [],
    isCustomerLoaded : false,
    permissions: [],
    isOpenCustomerModal : false
})

export const useCustomer = () => {

    const { permissionList } = useUtils()

    state.permissions = permissionList.value['estimate']

    const {
        customer,
        customer_id,
        isSaved,
    } = saveCustomer()    

    const addCustomer = () => {        
        resetForm()
        state.showCustomerDropdown = true
        state.isCustomerPreview    = false
        isSaved.value = false
    }

    const editCustomer = () =>  {
        updateCustomer()
        showCustomerModal()
        isSaved.value = false
    }

    const fetchCustomer = () => {

        const {get, data, errorMessage, status} = useApi(config.CUSTOMER_URL)
    
        get().then( () => {
            
            if(status.value === 404){
                state.isCustomerLoaded = true
                state.customers = []
            }else{
                state.isCustomerLoaded = true
                state.customers = data.value.data
            }
        })    
    }

    const hideCustomerDropdown = (event) => {
        if
        (
            event.target.name !== 'add-customer-btn' && 
            event.target.name !== 'change-customer-btn' && 
            event.target.name !== 'edit-customer-btn'
        ) {

            state.showCustomerDropdown = false
            state.isCustomerPreview = false
            
            if(state.billedCustomer.customer != undefined && state.billedCustomer.customer != null) {

                if(Object.keys(state.billedCustomer.customer).length > 0) state.isCustomerPreview = true;                
            }
        }
    }

    const setBilledCustomer = () => {

        state.customerId = customer_id.value 

        state.billedCustomer.customer = customer.value.contact.customer     
        state.billedCustomer.firstName = customer.value.contact.firstName     
        state.billedCustomer.lastName = customer.value.contact.lastName             
        state.billedCustomer.email = customer.value.contact.email    
        state.billedCustomer.phoneNumber = customer.value.contact.phoneNumber 
        state.billedCustomer.mobileNumber = customer.value.contact.mobileNumber 
        state.billedCustomer.website = customer.value.contact.website        

        state.billedCustomer.billingAddressLine1 = customer.value.billing.addressLine1 
        state.billedCustomer.billingAddressLine2 = customer.value.billing.addressLine2 
        state.billedCustomer.billingZipcode = customer.value.billing.zipCode  
        state.billedCustomer.billingCity = customer.value.billing.city     
        state.billedCustomer.billingCountry = customer.value.billing.country  
        state.billedCustomer.billingState = customer.value.billing.state    

        state.billedCustomer.shippingAddressLine1 = customer.value.shipping.addressLine1 
        state.billedCustomer.shippingAddressLine2 = customer.value.shipping.addressLine2 
        state.billedCustomer.shippingZipcode = customer.value.shipping.zipCode 
        state.billedCustomer.shippingCity = customer.value.shipping.city    
        state.billedCustomer.shippingCountry = customer.value.shipping.country 
        state.billedCustomer.shippingState = customer.value.shipping.state   
    
    }    

    const updateCustomer = () => {

        customer_id.value = state.customerId

        customer.value.contact.customer     = state.billedCustomer.customer
        customer.value.contact.firstName    = state.billedCustomer.firstName
        customer.value.contact.lastName     = state.billedCustomer.lastName        
        customer.value.contact.email        = state.billedCustomer.email
        customer.value.contact.phoneNumber  = state.billedCustomer.phoneNumber
        customer.value.contact.mobileNumber = state.billedCustomer.mobileNumber
        customer.value.contact.website      = state.billedCustomer.website        

        customer.value.billing.addressLine1 = state.billedCustomer.billingAddressLine1
        customer.value.billing.addressLine2 = state.billedCustomer.billingAddressLine2
        customer.value.billing.zipCode  = state.billedCustomer.billingZipcode
        customer.value.billing.city     = state.billedCustomer.billingCity
        customer.value.billing.country  = state.billedCustomer.billingCountry
        customer.value.billing.state    = state.billedCustomer.billingState

        customer.value.shipping.addressLine1 = state.billedCustomer.shippingAddressLine1
        customer.value.shipping.addressLine2 = state.billedCustomer.shippingAddressLine2
        customer.value.shipping.zipCode = state.billedCustomer.shippingZipcode
        customer.value.shipping.city    = state.billedCustomer.shippingCity
        customer.value.shipping.country = state.billedCustomer.shippingCountry
        customer.value.shipping.state   = state.billedCustomer.shippingState

        customer.value.sameAsBilling        = (state.billedCustomer.sameAsBilling == 1) ? true : false
    }

    const selectCustomer = (data) => {
        state.billedCustomer = data
        state.customerId = data.id
   
        updateCustomer()

        state.showCustomerDropdown = false;
        state.isCustomerPreview = true;
    }

    // edit estimate set customer from payload
    const setCustomer = (data,id) => {
        state.billedCustomer = data
        state.customerId = id
        state.isCustomerPreview = true;
        
        updateCustomer()
    }

    const showCustomerModal = () => {            
        state.isOpenCustomerModal = false
        state.showCustomerDropdown = false;
        state.isCustomerPreview = true;
    }

    return {
        ...toRefs(state),
        addCustomer,
        editCustomer,
        fetchCustomer,
        hideCustomerDropdown,
        selectCustomer,
        setCustomer,
        showCustomerModal,
        setBilledCustomer,
    }

}

export const resetCustomer = () => {

    state.billedCustomer = []
    state.customerId     = ''
    state.isCustomerPreview = false
}