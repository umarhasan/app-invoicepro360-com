import {toRefs, reactive } from "vue"
import config from "@/config"
import {useApi} from "@/compositions/api"
import VALIDATE from "@/compositions/validate"
import { useVuelidate } from "@vuelidate/core"

const state = reactive({
    isConnectionFail: false,
    status : null,
    records : null,
    error : null,
    step : null,
    isSaved : false,
    showLoadingIcon : false,
    alertMessage : '',    
    type : '',
    option : { 
        clover : {
            name  : 'Clover',
            ApiToken : '',
            isDefault : 0,
        },
        payeezy : {
            name  : 'Payeezy',
            ApiKey : '',
            ApiSecret : '',
            ApiToken : '',
            isDefault : 0,
        },        
        paypal : {
            name  : 'Paypal',
            ApiKey : '',
            ApiSecret : '',
            // ApiToken : '',
            isDefault : 0,
        },
        stripe : {
            name  : 'Stripe',
            ApiKey : '',
            ApiSecret : '',
            ApiToken : '',
            isDefault : 0,
        }
        
    },
    defaultPaymentGateway : null,
    validationErrors : null,
    isPaymentGatewayModal : false
})

const fetchOptions = () => {

    const { data, get, error,status,isConnectionFail }  = useApi(config.PAYMENT_GATEWAYS_URL)

    get().then( () => {

        state.error = error.value
        state.status = status.value

        if(isConnectionFail.value){
            state.isConnectionFail = isConnectionFail.value
            state.status = 503
            return
        }

        let d = data.value.data

        if(status.value === 404){
            state.error = error.value
        }else{
            state.records = d.options                   
            state.defaultPaymentGateway = d.default_payment_gateway     
        }        
    })   
}

export const usePaymentGateway = () => {

    state.error = false
    state.alertMessage = null    

    //validation
    const validatePayeezy = useVuelidate(VALIDATE.PaymentGateways.Payeezy, state.option.payeezy)
    const validateClover = useVuelidate(VALIDATE.PaymentGateways.Clover, state.option.clover)
    const validatePaypal = useVuelidate(VALIDATE.PaymentGateways.Paypal, state.option.paypal)
    const validateStripe = useVuelidate(VALIDATE.PaymentGateways.Stripe, state.option.stripe)

    const save = async () => {

        let postData = null;

        if(state.type == 'Payeezy'){
            postData = state.option.payeezy
            validatePayeezy.value.$touch()
            if (validatePayeezy.value.$invalid) return
        }

        if(state.type == 'Clover'){
            postData = state.option.clover
            validateClover.value.$touch()
            if (validateClover.value.$invalid) return
        }

        if(state.type == 'Paypal'){
            postData = state.option.paypal
            validatePaypal.value.$touch()
            if (validatePaypal.value.$invalid) return
        }

        if(state.type == 'Stripe'){
            postData = state.option.stripe
            validateStripe.value.$touch()
            if (validateStripe.value.$invalid) return
        }


        const { data,post,status} = useApi(config.SAVE_PAYMENT_SETTING_URL)

        state.showLoadingIcon = true

        const payload = {
            type        : state.type,
            ApiKey      : postData.ApiKey,
            ApiSecret   : postData.ApiSecret,
            ApiToken    : postData?.ApiToken,
            IsDefault   : (postData.isDefault == "1") ? 1 : 0
        }

        await post(payload)

        if(data.value.validation_errors) state.validationErrors = data.value.validation_errors
        
        if(status.value == 400 || status.value == 404){
            state.alertMessage = data.value.error
            state.isSaved = false
            state.error  = true
        }else{
            
            state.alertMessage = 'Payment gateway setting has been updated'
            state.isSaved = true
            state.error  = false
            
            state.defaultPaymentGateway = data.value.data.default_payment_gateway

            state.records.filter((record) => {                
                if(record.type == state.type.toLowerCase()) record.status = 1                
            })
        }

        state.showLoadingIcon = false
    }

    const showPaymentGatewayModal = (row) => {
        
        resetForm(row)

        state.type   = row.name       
        
        if(state.type === 'Payeezy'){
            state.option.payeezy.ApiKey = row.api_key
            state.option.payeezy.ApiToken = row.api_token
            state.option.payeezy.ApiSecret = row.api_secret
        }

        if(state.type === 'Clover'){
            state.option.clover.ApiToken = row.api_token
        }

        if(state.type === 'Paypal'){
            state.option.paypal.ApiKey = row.api_key
            state.option.paypal.ApiToken = row.api_token
            state.option.paypal.ApiSecret = row.api_secret
        }

        if(state.type === 'Stripe'){
            state.option.stripe.ApiKey = row.api_key
            state.option.stripe.ApiToken = row.api_token
            state.option.stripe.ApiSecret = row.api_secret
        }

        state.isPaymentGatewayModal = true
    }

    const resetForm = (row) => {

        validatePayeezy.value.$reset();
        validateClover.value.$reset();
        validatePaypal.value.$reset();
        validateStripe.value.$reset();
        
        state.validationErrors = null

        state.option.payeezy.name       = 'Payeezy'
        state.option.payeezy.ApiKey     = row.ApiKey
        state.option.payeezy.ApiSecret  = row.ApiSecret
        state.option.payeezy.ApiToken   = row.ApiToken
        state.option.payeezy.isDefault  = (state.defaultPaymentGateway == 'payeezy') ? 1 : 0
        
        state.option.clover.name        = 'Clover'
        state.option.clover.ApiToken    = row.ApiToken
        state.option.clover.isDefault   = (state.defaultPaymentGateway == 'clover') ? 1 : 0
        
        state.option.paypal.name        = 'Paypal'
        state.option.paypal.ApiKey      = row.ApiKey
        state.option.paypal.ApiSecret   = row.ApiSecret
        state.option.paypal.ApiToken    = row.ApiToken
        state.option.paypal.isDefault   = (state.defaultPaymentGateway == 'paypal') ? 1 : 0

        state.option.stripe.name        = 'Stripe'
        state.option.stripe.ApiKey      = row.ApiKey
        state.option.stripe.ApiSecret   = row.ApiSecret
        state.option.stripe.ApiToken    = row.ApiToken
        state.option.stripe.isDefault   = (state.defaultPaymentGateway == 'stripe') ? 1 : 0
    }

    return {
        ...toRefs(state),
        validatePayeezy,
        validatePaypal,
        validateClover,
        validateStripe,
        showPaymentGatewayModal,
        fetchOptions,
        save,
    }
}