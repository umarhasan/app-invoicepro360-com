import { ref, reactive, toRefs } from "vue"
import debounce from "lodash/debounce"
import config from "@/config"
import { useApi} from "@/compositions/api"
import { useUtils } from "@/compositions/utils"
import VALIDATE from "@/compositions/validate"
import {validatePermissions, getPermissionList} from "@/compositions/permissions"
import { useCustomer } from "@/compositions/intuit/integrations";
import { useVuelidate } from "@vuelidate/core"
import { helper as $h,stringToHTML } from "@/utils/helper"

const holdRow = ref()
const url = config.CUSTOMER_URL

const state = reactive({
    customer_id       : null,
    showLoadingIcon   : false,
    validationErrors  : null,
    isContactActive : true,
    isBillingActive : false,
    isShippingActive: false,
    isOtherInfoActive: false,
    isSaved : false,
    isNotify : false,
    isDeleteModal : false,
    //list
    customers : [],
    // Pagination
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    //form
    customer: {
        contact: {
            customer     : '',
            firstName    : '',
            lastName     : '',
            email        : '',
            phoneNumber  : '',
        },
        billing: {
            addressLine1: '',
            addressLine2: '',
            city    : '',
            zipCode : '',
            state   : '',
            country : '',
        },
        shipping: {
            name : '',
            phoneNumber : '',
            addressLine1: '',
            addressLine2: '',
            city    : '',
            zipCode : '',
            state   : '',
            country : '',
        },
        otherInfo: {
            accountNumber   : '',
            mobileNumber    : '',
            fax     : '',
            website : '',
        },
    sameAsBilling : false,    
    },
    countries: [],
    states: [],
    //notification
    status  : null,
    error   : false,
    alertMessage : null,
    permissions : [],
    //filter
    filter : "",
    // Sorting Logic
    sortColumn : null,
    sortDirection : "asc"
})

export const fetchCustomer = () => {

    checkPermissions('customer', 'view');
    const { get, data, errorMessage, status, isConnectionFail } = useApi(config.CUSTOMER_URL);
    const getCustomers = (searchValue = "", page = 1, limit = 10) => {
        state.showLoadingIcon = true;
        get({
            search: searchValue,
            page,
            limit,
            fields: "name,email,phone",
        }).then(() => {
            if (status.value != 404) {
                state.customers = data.value.data ?? [];
                state.totalPages = data.value.totalPages || 1;
                state.currentPage = page;
            }
            state.showLoadingIcon = false;
        }).catch(() => {
            state.showLoadingIcon = false;
        });
    }
    getCustomers('', state.currentPage, state.limit)

    const debouncedFetch = debounce((s, p, l) => {
        getCustomers(s, p, l)
    }, 800)
    
    const onSearch = () => {
        debouncedFetch(state.filter.trim(), 1, state.limit)
    }
    
    const goToPage = (page) => {
    if (page < 1 || page > state.totalPages) return
        debouncedFetch(state.filter.trim(), page, state.limit)
    }

    const sort = (column) => {
        if (sortColumn.value === column) {
          sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
        } else {
          sortColumn.value = column;
          sortDirection.value = "asc";
        }
    };

    const showDeleteModal = data => {
        holdRow.value = data
    
        if(data.status == 'inactive'){
           deleteCustomer()
        }else{
            state.isDeleteModal = true
        }
    }

    return {
        ...toRefs(state),
        getCustomers,
        onSearch,
        goToPage,
        sort,
        showDeleteModal,
    }
}

export const saveCustomer = (type = '') => {

    resetForm()

    const { countries,states } = useUtils()
    //intuit customer
    const { createCustomer,updateCustomer } = useCustomer()
    
    state.countries = countries.value
    state.states    = states.value

    //validation object    
    const validate = useVuelidate(VALIDATE.Customer, state.customer)
    const vc$ = useVuelidate(VALIDATE.Customer.contact, state.customer.contact)
    
    //form submit handler
    const submit = async () => {
        state.error = false
        state.showLoadingIcon = true

        if(type == 'modal'){

            vc$.value.$touch()
            if (vc$.value.$invalid) return
 
             state.isContactActive = true
             state.isBillingActive = state.isShippingActive = false
  
        }else{
            validate.value.$touch()
            if (validate.value.$invalid) return            
        }

        const { data, post, update } = useApi(
            url + `${state.customer_id ? state.customer_id : "create"}`
        )
        
        const payload = {
            contact     : state.customer.contact,
            billing     : state.customer.billing,
            shipping    : state.customer.shipping,
            sameAsBilling : (state.customer.sameAsBilling) ? 1 :0  
        }

        if (state.customer_id == null){
            await post(payload)
            state.isSaved = true
            state.alertMessage = "New Customer added successfully"
        }else{
            await update(payload)
            state.isSaved = true
            state.alertMessage = "Customer saved successfully"
        } 

        if(data.value.validation_errors){
            state.showLoadingIcon = false
            state.isSaved = true
            state.error = true
            state.alertMessage = "Validation failed"
            state.validationErrors = data.value.validation_errors
            return
        }else{
            if(state.customer_id == null) createCustomer(payload,data.value.data)
            if(state.customer_id) updateCustomer(payload,state.customer_id)
        }

        state.showLoadingIcon = false

        if(type != 'modal'){
            router.push({ name: "customers" })
        }        
    }

    const sameAsBillingAddress = () => {
        if (state.customer.sameAsBilling){
            state.customer.shipping.addressLine1 = state.customer.billing.addressLine1
            state.customer.shipping.addressLine2 = state.customer.billing.addressLine2
            state.customer.shipping.zipCode = state.customer.billing.zipCode
            state.customer.shipping.city    = state.customer.billing.city
            state.customer.shipping.country = state.customer.billing.country
            state.customer.shipping.state   = state.customer.billing.state
        } else {
            state.customer.shipping.name = ''
            state.customer.shipping.phoneNumber = ''
            state.customer.shipping.addressLine1 = ''
            state.customer.shipping.addressLine2 = ''
            state.customer.shipping.zipCode = ''
            state.customer.shipping.city    = ''
            state.customer.shipping.country = ''
            state.customer.shipping.state   = ''
        }
    }

    return {
        ...toRefs(state),
        submit,
        sameAsBillingAddress,
        validate,
        vc$,  
    }
}

export const readCustomer = customer_id => {

    const { data, get, error,status } = useApi(url + customer_id)

    get().then( () => {
        if(status.value === 404 || status.value === 400){

            state.isNotify = true
            state.error = true
            state.alertMessage = data.value.message            
            router.push({name : "customers"})
        }else{
            state.customer_id = customer_id
            state.customer.contact.customer     = data.value.data.customer
            state.customer.contact.firstName    = data.value.data.firstName
            state.customer.contact.lastName     = data.value.data.lastName
            state.customer.contact.phoneNumber  = data.value.data.phoneNumber
            state.customer.contact.mobileNumber = data.value.data.mobileNumber
            state.customer.contact.email        = data.value.data.email
            state.customer.contact.website      = data.value.data.website

            state.customer.billing.addressLine1 = data.value.data.billingAddressLine1
            state.customer.billing.addressLine2 = data.value.data.billingAddressLine2
            state.customer.billing.zipCode  = data.value.data.billingZipcode
            state.customer.billing.city     = data.value.data.billingCity
            state.customer.billing.country  = data.value.data.billingCountry
            state.customer.billing.state    = data.value.data.billingState

            state.customer.shipping.name = data.value.data.shippingName
            state.customer.shipping.phoneNumber = data.value.data.shippingPhoneNumber
            state.customer.shipping.addressLine1 = data.value.data.shippingAddressLine1
            state.customer.shipping.addressLine2 = data.value.data.shippingAddressLine2
            state.customer.shipping.zipCode = data.value.data.shippingZipcode
            state.customer.shipping.city    = data.value.data.shippingCity
            state.customer.shipping.country = data.value.data.shippingCountry
            state.customer.shipping.state   = data.value.data.shippingState
            state.customer.sameAsBilling  = (data.value.data.sameAsBilling == 1) ? true : false
        }
    })
}

export const deleteCustomer = () => {
    const { post, status } = useApi(url + "update-status")
    const { deleteCustomer } = useCustomer()
    const { getCustomers } = fetchCustomer()

    post({ id : holdRow.value.id })
    .then(() =>{
        if(status.value === 404 || status.value === 400){
            state.error = true
            state.isNotify = true
            state.alertMessage = 'Unable to update customer status'
            state.isDeleteModal = false
        }else{
            deleteCustomer(holdRow.value.id)
            state.error = false
            state.isNotify = true
            state.alertMessage = "Customer status updated"
            state.isDeleteModal = false
            getCustomers()
        }
    })
}

export const exportCSV = () => {
    const { get, status, data } = useApi(url + "export-csv")

    validatePermissions('customer', 'export')

    get()
        .then(() => {

            if (status.value === 404 || status.value === 400) {
                state.error = true
                state.isNotify = true
                state.alertMessage = 'Unable to export customer csv'
            } else {
                let base64String = `data:application/csv;base64, ${data.value.data.base64Csv}`;

                const downloadLink = document.createElement("a");

                downloadLink.href = base64String;
                downloadLink.download = data.value.data.name;
                downloadLink.click();

                state.isNotify = true
                state.alertMessage = "Customer csv exported successfully."
                // state.showLoadingIcon = false
            }

        })
}

export const showNotification = () => {
    $h.notification(state.error,state.alertMessage,state.validationErrors)
    state.isNotify = false
    state.isSaved  = false
    state.error = false
    state.alertMessage = null
    state.validationErrors = null
}

export  const goBack = () => {
    router.push({name : "customers"})
}

export const resetForm = () => {

    state.customer_id               = null
    state.customer.contact.customer     = ''
    state.customer.contact.firstName    = ''
    state.customer.contact.lastName     = ''
    state.customer.contact.email        = ''
    state.customer.contact.phoneNumber  = ''
    state.customer.contact.mobileNumber = ''
    state.customer.contact.website      = ''

    state.customer.billing.addressLine1 = ''
    state.customer.billing.addressLine2 = ''
    state.customer.billing.zipCode  = ''
    state.customer.billing.city     = ''
    state.customer.billing.country  = ''
    state.customer.billing.state    = ''

    state.customer.shipping.name = ''
    state.customer.shipping.phoneNumber = ''
    state.customer.shipping.addressLine1 = ''
    state.customer.shipping.addressLine2 = ''
    state.customer.shipping.zipCode = ''
    state.customer.shipping.city    = ''
    state.customer.shipping.country = ''
    state.customer.shipping.state   = ''

    state.customer.sameAsBilling   = false
}

const checkPermissions = (mod, action = '') => {
    
    const notAllowedObj =  { 
        name: "dashboard",
        params: {
            showPermissionAlert: true,
            alertMessage: "", 
        },
        alertText : {
            customer : [
                "view" , "You don't have permission to access customer list.",
                "create" , "You don't have permission to add new customer.",
                "edit" , "You don't have permission to update customer.",
                "delete", "You don't have permission to delete customer."                
            ]
        }
    }
    
    const { permissionList } = useUtils()
    state.permissions = permissionList.value[mod]        

    if(action != ''){
        if(!state.permissions[action]){
            notAllowedObj.params.alertMessage = notAllowedObj.alertText[mod][action]
            router.push(notAllowedObj)   
        }
    }
}