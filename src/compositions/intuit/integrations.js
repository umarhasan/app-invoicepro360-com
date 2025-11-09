import {toRefs, reactive } from "vue"
import { useApi } from "@/compositions/api"
import { useUtils } from "@/compositions/utils"
import { helper as $h } from "@/utils/helper"
import config from "@/config"

import VALIDATE from "@/compositions/validate"
import { useVuelidate } from "@vuelidate/core"

import { createCustomer, updateCustomer, deleteCustomer } from "./customer"
import { createProduct, updateProduct, deleteProduct } from "./product"
import { createInvoice, updateInvoice, deleteInvoice } from "./invoice"
import { createEstimate, updateEstimate, deleteEstimate } from "./estimate"
import { createSalesTax, updateSalesTax } from "./salestax"


const state = reactive({
    isConnectionFail: false,
    status : null,
    error : null,
    isSaved : false,
    isAlert : false,
    ConnectLoadingIcon : false,
    PauseLoadingIcon : false,
    ShowLoadingIcon : false,
    alertMessage : '',        
    validationErrors : null,
    intuit_redirect_url : null,
    isIntuitAccessTokenValid : false,
    intuitSyncSettings : {}
})

const getIntuitRedirect = () => {

    const { data, get, error,status,isConnectionFail }  = useApi(config.INTUIT_REDIRECT_URL)

    get().then( () => {

        state.error = error.value
        state.status = status.value

        if(isConnectionFail.value){
            state.isConnectionFail = isConnectionFail.value
            state.status = 503
            return
        }

        if(status.value === 404){
            state.error = error.value
        }else{
            state.intuit_redirect_url = data.value.data                   
        }
        
    })

}

export const useIntegration = () => {

    state.error = false
    state.alertMessage = null    

     const {
        isIntuitAccessTokenValid,
        intuitSyncSettings
    } = useUtils()

     state.isIntuitAccessTokenValid = isIntuitAccessTokenValid.value
     state.intuitSyncSettings = intuitSyncSettings.value

    const Connect = () => {

        state.ConnectLoadingIcon = true

        var parameters = "location=1,width=800,height=650";
        parameters += ",left=" + (screen.width - 800) / 2 + ",top=" + (screen.height - 650) / 2;
        // Launch Popup
        
        window.open(state.intuit_redirect_url, 'connectPopup', parameters);
        
    }

    const Disconnect = () => {

        state.ConnectLoadingIcon = true

        state.intuitSyncSettings.isConnected = false

        updateSetting()
    }

    const Paused = () => {

        state.PauseLoadingIcon = true
        state.intuitSyncSettings.isPaused = true

        updateSetting()
    }

    const Resume = () => {
        state.PauseLoadingIcon = true
        state.intuitSyncSettings.isPaused = false
        updateSetting()
    }

     const updateSetting = (type = '') => {

        if(type == "save") {
            state.ShowLoadingIcon = true
            state.isAlert = false
        }

        const { data, post, status, error } = useApi(config.INTUIT_UPDATE_SETTING_URL)

        post(state.intuitSyncSettings).then( () => {
            state.status = status.value
            state.error  = error.value

            if(state.status === 200) {
                state.isSaved = true
                intuitSyncSettings.value = state.intuitSyncSettings
            }    

            state.ShowLoadingIcon = false
            state.ConnectLoadingIcon = false
            state.PauseLoadingIcon = false

            if(type == "save") {
                state.isAlert = true
                state.alertMessage = "Intuit setting has been updated."
            }
        })        
    }
     
    return {
        ...toRefs(state),
        updateSetting,
        getIntuitRedirect,
        Connect,
        Disconnect,
        Paused,
        Resume,
    }
}

export const useCustomer = () => {

    return {
        createCustomer,
        updateCustomer,
        deleteCustomer
    }
}

export const useSalesTax = () => {

    return {
        createSalesTax,
        updateSalesTax
    }
}

export const useProduct = () => {

    return {
        createProduct,
        updateProduct,
        deleteProduct
    }
}

export const useInvoice = () => {

    return {
        createInvoice,
        updateInvoice,
        deleteInvoice
    }
}

export const useEstimate = () => {

    return {
        createEstimate,
        updateEstimate,
        deleteEstimate
    }
}

export const useChartofAccount = () => {

    const state = reactive({
        ischartofAccountLoaded : false,
        isConnectionFail: false,
        AccountLoadingIcon : false,
        status : null,
        error : null,
        isAlert : false,
        alertMessage : '',        
        accounts : [],
    })

   const { ischartofAccountLoaded,chartAccounts } = useUtils()

   state.ischartofAccountLoaded = ischartofAccountLoaded.value
   state.accounts = chartAccounts.value

    const fetchChartofAccounts = () => {
        
        const {get, data, errorMessage, status} = useApi(config.CHART_ACCOUNT_URL)
    
        get().then( () => {
            
            if(status.value === 404){
                state.ischartofAccountLoaded = true
                state.accounts = []
            }else{
                state.ischartofAccountLoaded = true
                state.accounts = data.value.data ?? []
            }
        })
    }

    const  ImportChartofAccounts = () => {

        state.AccountLoadingIcon = true

        const {get, data, errorMessage, status} = useApi(config.INTUIT_CHART_ACCOUNT_URL)
    
        get().then( () => {
            
            if(status.value === 404){
                state.AccountLoadingIcon = false
                state.ischartofAccountLoaded = false

            }else{
                state.AccountLoadingIcon = false
                state.ischartofAccountLoaded = false
            }
        })    
    }

    return {
        ...toRefs(state),
        fetchChartofAccounts,
        ImportChartofAccounts,
    }


}

export const useSyncPastEvent = () => {

    const state = reactive({
        isFiltered : false,
        isEventLoaded : false,
        isConnectionFail: false,
        status : null,
        error : null,
        SyncLoadingIcon : false,
        isAlert : false,
        alertMessage : '',        
        validationErrors : null,
        form : {
            startDate : '',
            endDate : '',
            eventType : '',
        },
        eventTypes : [
            {
                label : "Customer",
                value : "customer"
            },
            {
                label : "Invoice",
                value : "invoice"
            },
            {
                label : "Product & Services",
                value : "product"
            },                        
        ],
        events : [],
    })

    const fetchSyncEventList = () => {

        const {get, data, errorMessage, status} = useApi(config.INTUIT_PAST_EVENT_SYNC_URL)
    
        get().then( () => {
            
            if(status.value === 404){
                state.isEventLoaded = true
                state.isFiltered = false
                state.events = []
            }else{
                state.isEventLoaded = true
                state.events = data.value?.data
                state.isFiltered = false
            }
        })    
    }
    

    //validation object
    const validate = useVuelidate(VALIDATE.SyncPastEVentFilter, state.form)

    const filter = () => {

        //validate
        validate.value.$touch()        
        if (validate.value.$invalid) return


        const { data, post, status, error,isConnectionFail } = useApi(config.INTUIT_PAST_EVENT_SYNC_URL)

        state.SyncLoadingIcon = true
        state.isEventLoaded = false
        state.isAlert = false

        let payload = {
            startDate : $h.formatDate(state.form.startDate,'YYYY-MM-DD'),
            endDate : $h.formatDate(state.form.endDate,'YYYY-MM-DD'),
            eventType : state.form.eventType
        }

        post(payload).then( () => {

            state.error = error.value
            state.status = status.value
    
            if(isConnectionFail.value){
                state.isConnectionFail = isConnectionFail.value
                state.status = 503
                return
            }
    
            if(status.value === 404){
                state.error = error.value
            }else{
                // console.log(data.value.data)   
                state.alertMessage = "Sync Past event has been created and it's in queue, will notify on completion"
                state.isAlert = true
                state.isFiltered = true
            }
            
            state.SyncLoadingIcon = false
        })


    }

    return {
        validate,
        ...toRefs(state),
        fetchSyncEventList,
        filter
    }



}

export const useSyncFailed = () => {

    const state = reactive({
        isFiltered : false,
        isSyncFailedLoaded : true,
        SyncFailedLoadingIcon: false,
        isConnectionFail: false,
        status : null,
        error : null,
        isAlert : false,
        alertMessage : '',        
        validationErrors : null,
        form : {
            type : '',
            status : '',
        },
        types : [
            {
                label : "Customer",
                value : "customer"
            },
            {
                label : "Invoice",
                value : "invoice"
            },
            {
                label : "Product & Services",
                value : "item"
            },                        
        ],
        records : [],
        pageSize : 10,
        pageNumber : 1,
    })
    

    //validation object
    const validate = useVuelidate(VALIDATE.SyncFailed, state.form)

    const filter = () => {

        //validate
        validate.value.$touch()        
        if (validate.value.$invalid) return


        const { data, post, status, error,isConnectionFail } = useApi(config.INTUIT_SYNC_FAILED_URL)

        state.SyncFailedLoadingIcon = true
        state.isSyncFailedLoaded = false
        state.isAlert = false
        
        let payload = {
            status : state.form.status,            
            type : state.form.type,
            order_by : "name",
            order : "desc",
            page  : state.pageNumber,
            size : state.pageSize
        }

        post(payload).then( () => {

            state.error = error.value
            state.status = status.value
    
            if(isConnectionFail.value){
                state.isConnectionFail = isConnectionFail.value
                state.status = 503
                return
            }
    
            if(status.value === 404){
                state.error = error.value
                state.isSyncFailedLoaded = true
                state.isFiltered = false
                state.records = []
            }else{
                // console.log(data.value.data)   

                state.isSyncFailedLoaded = true
                state.records = data.value.data
                state.isFiltered = false
            }
            
            state.SyncFailedLoadingIcon = false
        })
    }

    const paginate = (pageNumber) => {
        state.pageNumber = pageNumber
        filter()
    }

    const setPageSize = (pageSize) => {
        state.pageSize = pageSize
        filter()
    }

    const Retry = (record) => {
        console.log(record);
    };

    return {
        ...toRefs(state),        
        validate,
        filter,
        Retry,
        paginate,
        setPageSize,
    }

}
