import {toRefs, reactive } from "vue"
import { useApi } from "@/compositions/api"
import { useUtils } from "@/compositions/utils"
import config from "@/config"

import Toastify from "toastify-js";

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
    clover_redirect_url : null,
    isCloverAccessTokenValid : false,
    cloverSettings : {
        isConnected : false,
        isTipEnabled : false,
        device : '',
        printer : '',
    },
    displayOrder : {
        "payments": [],
        "serviceChargeName": null,
        "serviceChargeAmount": null,
        "tax": "0.00",
        "subtotal": "0.00",
        "total": "0.00",
        "amountRemaining": "0.00",
        "lineItems" : [],
        "discounts" : [],
    },
    devices : [],
    printers : []    
})


const getRedirectUrl = () => {

    const { data, get, error,status,isConnectionFail }  = useApi(config.CLOVER_REDIRECT_URL)

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
            state.clover_redirect_url = data.value.data                   
        }
        
    })

}

const DisplayOrder = () => {

    if(!validate(false)) return 
    
      const { data, post, error,status,isConnectionFail }  = useApi(config.CLOVER_DISPLAY_ORDER_URL)

      post(state.displayOrder).then( () => {
  
        state.error = error.value
        state.status = status.value
         
        if(status.value === 404){
            state.error = error.value
        }          
  
        if(isConnectionFail.value){
            state.isConnectionFail = isConnectionFail.value
            state.status = 503
            return
        }
            
      })
}

export const RegisteredDevices = () => {
    const { data, get, error,status,isConnectionFail }  = useApi(config.CLOVER_REGISTERED_DEVICES_URL)

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
            state.devices = data.value.data.clover_devices
            state.printers = data.value.data.clover_printers                  

        }
        
    })
}

export const CheckDeviceConnection = () => {
    if(!validate()) return 

    const { data, get, error,status,isConnectionFail }  = useApi(config.CLOVER_DEVICE_CONNECTION_URL)

    get().then( () => {
        console.log("isConnectionFail.value: ",isConnectionFail.value)
        console.log("error.value: ",isConnectionFail.value)
        console.log("Status: ",status.value)    
        console.log("Data: ",data.value.data)    
    })

}

export const useClover = () => {

    state.error = false
    state.alertMessage = null    

     const {
        isCloverAccessTokenValid,
        cloverSettings
    } = useUtils()


     state.isCloverAccessTokenValid = isCloverAccessTokenValid.value
     state.cloverSettings.isConnected = cloverSettings.value.isConnected 
     state.cloverSettings.isTipEnabled = cloverSettings.value.isTipEnabled
     state.cloverSettings.device = cloverSettings.value.device
     state.cloverSettings.printer = cloverSettings.value.printer

    const Connect = () => {

        state.ConnectLoadingIcon = true

        var parameters = "location=1,width=800,height=650";
        parameters += ",left=" + (screen.width - 800) / 2 + ",top=" + (screen.height - 650) / 2;
        // Launch Popup
        
        // window.open(state.clover_redirect_url, 'connectPopup', parameters);
        window.open(state.clover_redirect_url);
        
    }

    const Disconnect = () => {

        state.ConnectLoadingIcon = true

        state.cloverSettings.isConnected = false

        updateSetting()
    }


     const updateSetting = (type = '') => {

        if(type == "save") {
            state.ShowLoadingIcon = true
            state.isAlert = false
        }

        const { data, post, status, error } = useApi(config.CLOVER_UPDATE_SETTING_URL)

        post(state.cloverSettings).then( () => {
            state.status = status.value
            state.error  = error.value

            if(state.status === 200) {
                state.isSaved = true
                cloverSettings.value = state.cloverSettings
            }    

            state.ShowLoadingIcon = false
            state.ConnectLoadingIcon = false
            state.PauseLoadingIcon = false

            if(type == "save") {
                state.isAlert = true
                state.alertMessage = "Clover setting has been updated."
            }
        })        
    }
        
    //cancel payment request
    const cancelPaymentRequest = () => {

        if(!validate()) return 

        const { get } = useApi(config.CLOVER_CANCEL_PAYMENT_URL)
        get().then( () => {
        })
    }


    const displayWelcomeScreen = () => {

        if(!validate(false)) return 

        const { get} = useApi(config.CLOVER_DISPLAY_MESSAGE_URL)
        get().then( () => {})        
    }

    const displayThankyouScreen = () => {

        if(!validate()) return 

        const { get} = useApi(config.CLOVER_DISPLAY_THANKYOU_URL)
        get().then( () => {})        
    }

    const displayTipScreen = (invoice_id,paymentRequestId,amount) => {
        
        if(!validate()) return 

        let obj = {
            "invoice_id" : invoice_id,
            "payment_request_id": paymentRequestId,
            payload :{
                "baseAmount": amount
            }            
        }

        const { post} = useApi(config.CLOVER_DISPLAY_TIP_URL)
        post(obj).then( () => {})        
    }

    const capturePayment = (invoice_id,paymentRequestId,amount) => {

        if(!validate()) return 
        
        let obj = {
            "invoice_id" : invoice_id,
            "payment_request_id": paymentRequestId,
            payload :{
                "baseAmount": amount
            }            
        }

        const { post} = useApi(config.CLOVER_CAPTURE_PAYMENT_URL)
        post(obj).then( () => {})        
    }    

    return {
        ...toRefs(state),
        updateSetting,
        DisplayOrder,
        getRedirectUrl,
        Connect,
        Disconnect,
        cancelPaymentRequest,
        displayWelcomeScreen,
        displayThankyouScreen,
        displayTipScreen,
        capturePayment,
        validate,
    }
}


const validate = (isNotify = true) => {

    state.validationErrors = []

    if (!state.cloverSettings.isConnected){    
        state.error = true
        state.alertMessage = "Clover connection not setup"

        if(isNotify) showNotification()
        return false
    }else if (state.cloverSettings.device == ''){ 
        state.error = true
        state.alertMessage = "Please select clover device"
        if(isNotify) showNotification()
        return false
    }

    //
    return true    
} 

export const showNotification = () => {

    let errorhtml = '';
    let html = ''
    if(state.error){

        for (const error in state.validationErrors){

            errorhtml += `<div class="text-slate-500 mt-1">${state.validationErrors[error]}</div>`
        }
    
        html = `<div id="notification-div" class="toastify-content flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" 
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                    class="feather feather-x-circle text-error block">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15">
                        </line><line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                    <div class="ml-2 mr-4">
                        <div class="font-medium text-error">${state.alertMessage}</div>
                        <div class="text-error">${errorhtml}</div>        
                    </div></div>`;
    }else{
        html = `<div id="notification-div" class="toastify-content flex">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" 
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            class="feather feather-check-circle text-success block">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        <div class="ml-2 mr-4 "><div class="font-medium text-success">${state.alertMessage}</div></div>
        </div>`;
    }
    

    Toastify({
        node: cash(html)[0],
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
    }).showToast();

    state.isSaved = false
    state.error = false
    state.alertMessage = null
    state.validationErrors = null
}
