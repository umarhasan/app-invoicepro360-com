import {toRefs, reactive } from "vue"
import {useApi} from "../api"
import { helper as $h } from '@/utils/helper'
import config from "@/config"

const state = reactive({
    isMobileNumberValid : true,
    status : null,
    records : null,
    error : null,
    step : null,
    isSaved : false,
    showLoadingIcon : false,
    alertMessage : "",    
    barcodeImage : "",
    isBarcodeGenerated : false,
    option : {
        name  : '',
        image : '',
        status : 0,
        default_mfa : 0,
        type : ""
    },
    isSettingModal : false,
    isBarcodeModal : false,
})

const fetchOptions = () => {
    const { data, post, error,status }  = useApi(config.AUTHY_OPTIONS_URL)
    post({}).then( () => {

        state.status = status.value

        if(status.value === 404){
            state.error = error.value
        }else{
            state.records = data.value.data.options
            state.isMobileNumberValid = data.value.data.isMobileNumberValid
            
            if(!state.isMobileNumberValid){
                state.error = true
                state.alertMessage = "To enable multi-factor update mobile number first."
            }
        }        
    })   
}

export const useMFA = () => {

    state.error = false
    state.alertMessage = null
    state.isMobileNumberValid = true

    //fetch multi factor options with settings
    fetchOptions()

    const showSettingModal = (row) => {

        const element = document.querySelector(".yr-danger");

        if(!state.isMobileNumberValid){
            state.error = true
            state.alertMessage = "To enable multi-factor update mobile number first."

            if (element) {
                element.classList.add('show');
                element.removeAttribute('style');
            }
        }else{
            state.option = row
            state.step   = 'update-setting'
            state.isSettingModal = true
        }
    }

    const showBarcodeModal = async() => {

        state.isBarcodeModal = true
        state.step   = 'generate-barcode'
        const payload = {
            "step"       : state.step,
            "default_mfa": state.option.default_mfa,
            "mfa_type"   : state.option.type,
            "mfa_authy"  : state.option.status             
        }

        const { data,post,status} = useApi(config.AUTHY_GENERATE_BARCODE)

        await post(payload)

        if(status.value != 404){
            state.isBarcodeGenerated = true
            state.barcodeImage = data.value.data.mfa_settings.google_authenticator.barcode
        }
    }

    const downloadLink = async () => {

        state.step = 'download-link'

        const payload = {
            "step"       : state.step,
            "default_mfa": state.option.default_mfa,
            "mfa_type"   : state.option.type,
            "mfa_authy"  : state.option.status             
        }

        const { data,post,status} = useApi(config.AUTHY_APP_DOWNLOAD_URL)

        await post(payload)
        
    }

    const save = async () => {

        const { data,post,status} = useApi(config.AUTHY_SETTING_URL)

        const payload = {
           "step"       : state.step,
           "mfa_type"   : state.option.type,
           "default_mfa": parseInt(state.option.default_mfa),
           "mfa_authy"  : parseInt(state.option.status)             
        }

        state.showLoadingIcon = true

        await post(payload)

        if(status.value == 400 || status.value == 404){
            state.alertMessage = data.value.error
            state.isSaved = false
            state.error  = true
        }else{
            state.isSettingModal = false
            state.alertMessage = 'Multifactor auth setting has been updated'
            state.isSaved = true
            state.error  = false
            
            let default_mfa = data.value.data.default_mfa

            state.records.filter((record) => {
                if(record.type == default_mfa){
                    record.default_mfa = 1
                }else{
                    record.default_mfa = 0
                }
            })
        }

        state.showLoadingIcon = false
    }
    const showNotification = () => {
            $h.notification(state.error,state.alertMessage,state.validationErrors)
            state.isSaved = false
            state.error = false
            state.alertMessage = null
            state.validationErrors = null
    }

    return {
        ...toRefs(state),
        showSettingModal,
        showBarcodeModal,
        save,
        downloadLink,
        showNotification,
    }
}