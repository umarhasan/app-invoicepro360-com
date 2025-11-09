import { reactive, toRefs } from "vue"
import { useApi } from "@/compositions/api"
import {required } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core"
import config from "@/config"
import { useUtils } from '@/compositions/utils'
import cash from "cash-dom"
import { helper as $h } from '@/utils/helper'

const url = config.PAYMENT_TYPES_URL

const state = reactive({
    showLoadingIcon : false,
    agencyLoadingIcon : false,
    validationErrors : null,
    paymentTypes : {
        id              : '',
        name            : '',
        description     : '',
        status          : '',
        custom_fields   : [],
    },

    isPaymentTypeLoaded : false,
    status : null,
    records : [],
    error : null,
    isSaved: false,
    isDeleted: false,
    permissions:[],
    current_uid : null
})

const notAllowedObj = { 
    name: "dashboard",
    params: {
        showPermissionAlert: true,
        alertMessage: "You don't have permission to view payment types list.", 
    } 
}

export const usePaymentTypes = () => {

    const fetchPaymentTypes = () => {

        const { data, get, error,status }  = useApi(url)
    
        const { permissionList } = useUtils()
    
        state.permissions = permissionList.value['paymenttypes']
    
        //stopped persmission condition for payment type list
        // if(!state.permissions.view){
        //     router.push(notAllowedObj)   
        // }

        state.isPaymentTypeLoaded = false
    
        get().then( () => {
            state.status = status.value
    
            if(status.value === 404){
                state.error = error.value
                state.isPaymentTypeLoaded = true
            }else{
                state.records = data.value.data
                state.isPaymentTypeLoaded = true
            }
            
        })   
    }

    const showDeleteModal = (row) => {

        state.paymentTypes.id = row.id
    
        cash("#delete-modal").modal("show")
    }
    
    const confirmDelete = () => {
    
        let index = state.records.findIndex(item => item.id == state.paymentTypes.id)
    
        useApi(url + 'delete')
            .post({
                id : state.paymentTypes.id
            })
            .then(() => {
                state.records.splice(index,1)
                state.isDeleted = true
            })
            .catch(() => {
                cash(".yr-danger").removeClass("hide").addClass("show")
            })    
    }

    return  {
        ...toRefs(state),
         fetchPaymentTypes,
        showDeleteModal,
        confirmDelete
    } 
}

export const savePaymentTypes = () => {
    const { permissionList } = useUtils()

    state.permissions = permissionList.value['paymenttypes']

    if (router.currentRoute.value.name == "edit-payment-types") {

        if(!state.permissions.edit){
            router.push(notAllowedObj)
        }

    }else{
        if(!state.permissions.create){
            router.push(notAllowedObj)
        }
    }

    const validationRules = {
        name: { required },
    }

    //validation object
    const validate = useVuelidate(validationRules, state.paymentTypes)

    const submit = async () => {

        //validate
        validate.value.$touch()
        if (validate.value.$invalid) return

        state.showLoadingIcon = true

        const { data, post, update, error } = useApi(
            url + `${state.paymentTypes.id ? "/"+state.paymentTypes.id : ""}`
        )
        
        let payload = {
            name            : state.paymentTypes.name,
            description     : state.paymentTypes.description,
            status          : state.paymentTypes.status,
            custom_fields   : state.paymentTypes.custom_fields,
            type            : state.paymentTypes.name.replace(/\s+/g, '-').toLowerCase()
        }
        // window.yrPayload = payload
        // console.log(payload)
        // return
        
        if (state.paymentTypes.id == null) {
            await post(payload)
            state.alertMessage = "New Payment type created successfully."
        }else{
            await update(payload)
            state.alertMessage = "Payment type Updated successfully."
        }


        state.showLoadingIcon = false
        state.isSaved = true
        state.validationErrors = null
        state.error = null

        if(data.value.validation_errors){
            state.showLoadingIcon = false
            state.validationErrors = data.value.validation_errors
            return
        }

        if(data.value.error){
            state.isSaved = false
            state.error = data.value.error
        }
        
        router.push({name : "payment-types"})

    }

    const resetForm = () => {

        state.paymentTypes.id   = null;
        state.paymentTypes.name = null;
        state.paymentTypes.description = null;
        state.paymentTypes.status = null;
        state.paymentTypes.custom_fields = [];
  
        state.records   = null;
        state.error     = null;
        state.status    = null;
    } 

    return {
        validate,
        ...toRefs(state),
        submit,
        resetForm,
    }
}

export const readPaymentTypes = (id) => {

    const { data, get, error,status } = useApi(url +"/" +id)

    state.isSaved = false
    state.isDeleted = false
    state.formTitle = "Edit Payment Types";

    get().then( () => {

        if(status.value === 404 || status.value === 400){
            state.error = error.value.message            
            router.push({name : "payment-types"})
        }else{
            state.paymentTypes.id           = data.value.data.id
            state.paymentTypes.name         = data.value.data.name
            state.paymentTypes.description  = data.value.data.description
            state.paymentTypes.custom_fields= data.value.data.custom_fields
            state.paymentTypes.status       = data.value.data.status
        }
        
    })

}

export const useCustomFields = () => {

    var customFielduid = 0;

    const addField = () => {
        customFielduid ++;
        state.paymentTypes.custom_fields.push({            
            uid : customFielduid,            
            type : 'text',
            name : '',            
            options : [],
        })
    }

    const setFields = (items) => {
        items.forEach(item => {
            customFielduid++;
            state.paymentTypes.custom_fields.push({            
                uid   : customFielduid, 
                name : item.name,
                type : item.type,
                optons : item.options
            })    
        });

    }
    
    const deleteField = (key) => {
        let index = state.paymentTypes.custom_fields.findIndex(item => item.uid == key)
        state.paymentTypes.custom_fields.splice(index,1)
    }
    
    return {
        ...toRefs(state),
        addField,
        setFields,
        deleteField,
    }
}

export const showNotification = () => {
    $h.notification(state.error,state.alertMessage,state.validationErrors)
    state.isSaved = false
    state.error = false
    state.alertMessage = null
    state.validationErrors = null
}