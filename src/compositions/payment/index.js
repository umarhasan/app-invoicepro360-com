import { reactive, toRefs, ref, watch } from "vue"
import config from "@/config"
import { useApi } from "@/compositions/api"
import { useUtils } from "@/compositions/utils"
import { useClover } from "@/compositions/clover";
import { usePaymentTypes } from "@/compositions/settings/payment-types";

import VALIDATE from "@/compositions/validate"
import { useVuelidate } from "@vuelidate/core"
import { helper as $h } from "@/utils/helper"
// import dayjs from "dayjs"

const url = config.PAYMENT_URL

const state = reactive({
    formTitle : "Choose Payment Type",
    payment_id : null,
    paymentRequestId : "",   
    isDeviceTimeout : false,
    paymentLoaded :false,
    paymentTypes :[],
    payments : [],
    payment : {
        invoiceId : null,
        name : null,
        paymentDate : '',
        amount : '',
        paymentType : '',
        exchangeRate : '',
        convertedAmount : '',
        memo : '',
        cardNumber : null,
        cardCvv : null,
        expMonth : null,
        expYear : null,
        cardExpiry : null,
        customFields : []
    }, 
    formattedCardNumber : null,
    formattedExpiry : null,
    isSaved : false,
    showPaymentConfirmed : false,
    isPaymentCancel : false,
    isTipScreen : false,
    isCapturePayment : false,
    showPaymentForm : true,
    pingDevice : false,
    showLoadingIcon :false, 
    validationErrors : null,
    status : null,
    error : null, 
    successMsg : null,
    paymentMethod:  [],
    deletePayment : null,
    deleteMessage : null,
    validation : [],
    displayAmountDue : 0.0,
    displayAmountPaid : 0.0,
    dueAmount : 0.00,
    paidAmount : 0.00,
    isOpenPaymentModal : false
})

const PAYMENT_TYPE_CREDIT = 'credit'
const PAYMENT_TYPE_CASH = 'cash'
const PAYMENT_TYPE_CLOVER_POS = 'clover-pos'
const PAYMENT_TYPE_ACH = 'ach'

export const usePayment = () => {

    const { fetchPaymentTypes, isPaymentTypeLoaded, records } = usePaymentTypes();
    const {
            displayOrder,
            DisplayOrder, 
            cancelPaymentRequest, 
            displayWelcomeScreen,
            displayThankyouScreen,
            displayTipScreen,
            capturePayment,
            validate
    } = useClover()

             
    const init = () => {
        // Display Message
        // displayWelcomeScreen()
    
        //list of active payment types
        fetchPaymentTypes()
    
        //RESET ON MOUNT
        resetPaymentForm()
    }

    const selectPaymentType = (record) => {
        state.payment.paymentType = record.type
        // state.payment.name = record.name
        state.payment.customFields = record.custom_fields

        switch(state.payment.paymentType) {
            case PAYMENT_TYPE_CREDIT:
              state.formTitle  = "Manual Credit Card Payment"
            break;
            case PAYMENT_TYPE_CASH:
                state.formTitle  = "Cash Payment"              
            break;
            case PAYMENT_TYPE_ACH:
                state.formTitle  = "ACH Payment"              
            break;              
            case PAYMENT_TYPE_CLOVER_POS:
                state.formTitle  = "Clover POS Payment"                                      
            break;              
            default:
              state.formTitle = `${record.name} Payment` 
              state.payment.paymentType = record.name
          }
    }

    const validateManualPayment =  useVuelidate(VALIDATE.AddPayment.Cash, state.payment,{ $scope: false })
    const validateCreditCard =  useVuelidate(VALIDATE.AddPayment.Credit, state.payment,{ $scope: false })
    const validateCloverPos =  useVuelidate(VALIDATE.AddPayment.CloverPOS, state.payment,{ $scope: false })

    //manual record payment
    const saveManualPayment = () => {

        //validate
        validateManualPayment.value.$touch()
        if (validateManualPayment.value.$invalid) return

        state.showLoadingIcon = true
        state.showPaymentForm = false

        let makeUrl = url + `${state.payment_id ? state.payment_id : 'create'}`

        const { data, post, update,status, error } = useApi(makeUrl)

        state.payment.amount = `${state.payment.amount}`
        
        let payload = state.payment

        if(state.payment_id === null){

            post(payload).then( () => {
                state.status = status.value
                state.error  = error.value
                state.isSaved = true
                if(state.status === 200) {
                    $h.notification(false,data.value.message,[])
                    setDisplayAmountDue(data.value.data)
                }else{
                    if(state.error){
                        $h.notification(true,state.error,[])
                        state.error = ''
                    }
                }
            })
        }else{
            update(payload).then( () => {
                state.status = status.value
                state.error  = error.value
                state.isSaved = true
                if(state.status != 404) {
                    updatePayment()
                }
            })
        }
    }
    //charge credit card
    const saveCreditCardPayment = () => {
        //validate
        validateCreditCard.value.$touch()
        if (validateCreditCard.value.$invalid) return

        state.showLoadingIcon = true
        state.showPaymentForm = false

        let cardExpiry = state.formattedExpiry.split('/')

        state.payment.expMonth = cardExpiry[0]
        state.payment.expYear = cardExpiry[1]
        state.payment.amount = `${state.payment.amount}`

        let payload = state.payment
        let makeUrl = url + `${state.payment_id ? state.payment_id : 'charge-credit-card'}`

        const { data, post, update,status, error, isTimeout } = useApi(makeUrl)

        if(state.payment_id === null){
            post(payload).then( () => {
                state.status = status.value
                state.error  = error.value
                state.isSaved = true

                if(state.status == 200){
                    $h.notification(false,"Credit card payment has been charged")
                }else{
                    if(state.error){
                        $h.notification(true,state.error,[])
                        state.error = ''
                    }
                }
            })

        }else{
            update(payload).then( () => {
                state.status = status.value
                state.error  = error.value            
                state.isSaved = true
            })
        }
    }

    //for device payment
    const saveCloverPayment = () => {
        //reset 
         
        //validate
        validateCloverPos.value.$touch()
        if (validateCloverPos.value.$invalid) return

        state.showLoadingIcon = true
        state.showPaymentForm = false

        let payload = (config.IS_TIP_ALLOWED) ? { 
                amount : state.payment.amount * 100,
                capture : false,           
                externalPaymentId: state.payment.invoiceId 
            } : { 
                amount : state.payment.amount * 100,
                final : false,           
                externalPaymentId: state.payment.invoiceId 
            }
                    
        const { data, post, update,status, error } = useApi((config.IS_TIP_ALLOWED)?config.CLOVER_MAKE_PAYMENT_WITH_TIP_URL:config.CLOVER_MAKE_PAYMENT_URL)
        
        if(state.payment_id === null){
            state.paymentRequestId = ""
            post(payload).then( () => {
                state.pingDevice = true
                state.status = status.value
                state.error  = error.value
                state.paymentRequestId = data.value.data.payment_request_id    
                // displayTipScreen(state.paymentRequestId,payload.amount)
            })
        }else{
            update(payload).then( () => {
                state.status = status.value
                state.error  = error.value
                state.isSaved = true
            })
        }
    }

    const savePayment = () => {
        // state.pingDevice = true
        if(state.payment.paymentType == PAYMENT_TYPE_CREDIT){
            saveCreditCardPayment()            
        }else if(state.payment.paymentType == PAYMENT_TYPE_CLOVER_POS){
            if(validate(true)) saveCloverPayment()
        } else {
            saveManualPayment()
        }
    }

    const voidPayment = (payment) => {
        let makeUrl = url +  'void'

        const p = { ...payment, ...{'invoiceId': state.payment.invoiceId} };

        const { data, post,status, error } = useApi(makeUrl)

        post(p).then(()=> {

            fetchPayments()
        })
    }

    const timer = new Date().getTime()

    //ping request pingDevice is true    
    watch(() => { return state.pingDevice; },
    () => { 
        if (state.pingDevice && !state.isTipScreen && !state.isCapturePayment) {  
            state.pingDevice = false
            setTimeout(() => {
                console.log('pingDevice watcher:',$h.diffTimeByNow(timer))
                devicePing();
            }, 3000);
        } 
    });

    watch(() => { return state.isTipScreen; },
    () => { 
        if (state.isTipScreen) {
            state.isTipScreen = false
            setTimeout(() => {
                console.log('isTipScreen watcher:',$h.diffTimeByNow(timer))
                devicePing();
            }, 3000);
        }
    })

    watch(() => { return state.isCapturePayment; },
    () => { 
        if (state.isCapturePayment) {
            state.isCapturePayment = false
            setTimeout(() => {
                console.log('isCapturePayment watcher:',$h.diffTimeByNow(timer))
                devicePing();
            }, 3000);
        }
    })
    
    watch(() => { return state.isSaved; },
        () => { 
            state.showLoadingIcon = false;
            state.showPaymentForm = true
            state.isSaved = false
            fetchPayments()
    })

    watch(() => { return isPaymentTypeLoaded.value; },
        () => { 
            state.paymentTypes = records.value;
    })

    watch(() => { return state.isPaymentCancel; },
        () => {
            if(state.isPaymentCancel){
                cancelPaymentRequest()
                state.isPaymentCancel = false
                state.isSaved = true
            }
    })

    //TODO:NEED TO IMPROVE DEVICE PING LOGIC FOR FAST OUTPUT
    const devicePing = () => {

        const { data, post, status } = useApi(config.CLOVER_DEVICE_PING_URL)

        post({
            payment_request_id: state.paymentRequestId
        }).then(() => {
            console.log(data.value.data?.status)
            //status busy means earlier request is not completed so keep ping the device
            if(data.value.data?.status == "BUSY"){
                state.pingDevice = true;
            }else if(data.value.data?.status == "COMPLETED"){
                // status completed mean response is returned with success or error (cancel request,decline card, device random error) 
                let resp = data.value.data 

                //for error block 
                if(resp.isError){
                    state.pingDevice = false
                    state.isSaved = false
                    state.showLoadingIcon = false
                    state.showPaymentForm = true                    
                    state.error  = resp.errorResponse.message                    
                    setTimeout(() => {
                        state.error  = null                    
                    }, 3000);

                    if(data.value.data.errorResponse.code == "209 Unknown") 
                        displayWelcomeScreen()                    

                }else{

                    // return success for when card charged
                     if (resp.successReponse.payment.result == 'AUTH'){
                        //return  AUTH in result key means client want to view tip screen
                        displayTipScreen(state.payment.invoiceId,state.paymentRequestId,resp.successReponse.payment.amount)
                        state.isTipScreen = true
                        state.pingDevice = false
                    }else if (resp.successReponse.payment.result == 'CAPTURE'){
                        //capture payment with tip
                        state.isTipScreen = false
                        state.pingDevice = false
                        state.isCapturePayment = true
                        capturePayment(state.payment.invoiceId,state.paymentRequestId,resp.successReponse.payment.amount)
                    }else if (resp.successReponse.payment.result == 'SUCCESS'){

                        state.successMsg = "Clover Payment has been charged"
                        $h.notification(false,state.successMsg,[])

                        state.isSaved = false
                        state.showPaymentConfirmed = true
                        state.pingDevice = false
                        state.isCapturePayment = false
                        state.isTipScreen = false                        
                        state.showLoadingIcon = false
                        state.showPaymentForm = true
                        displayThankyouScreen()
                    }
                }                
            }
        })
    }

    const fetchPayments = (invoiceId = 0) => {

        const { data, get, error,status } = useApi(url + (state.payment.invoiceId) ?? invoiceId)   
                
        get().then( () => {        
            state.status = status.value
            state.error = error.value
            state.payments = (data.value.data) ? data.value.data.payments : []
            state.dueAmount = (data.value.data) ? data.value.data.dueAmount : 0.00
            state.paidAmount = (data.value.data) ? data.value.data.paidAmount : 0.00

            setDisplayAmountDue(state.dueAmount)
            setDisplayAmountPaid(state.paidAmount)

            state.paymentLoaded = true

            if (state.dueAmount == 0){
                state.isOpenPaymentModal = false
            }
        })
    
         return {
            ...toRefs(state),
        }
    }

    const updatePayment = () => {
        let foundIndex = state.payments.findIndex(p => p.id === state.payment_id)
        state.payments.splice(foundIndex, 1, state.payment)        
    }

    //cancel clover payment request
    const updatePaymentRequest = () => {
        state.isPaymentCancel = true
    }

    const showDeleteModal = row => {
        state.deleteMessage = ` <b>Payment for $${row.amount} using ${row.paymentMethod}</b> <br> Are you sure you want to remove this invoice payment? `
        state.deletePayment = row
        cash("#delete-modal").modal("show"); 
    }

    const closeModal = () => {

        state.showLoadingIcon= false
        state.isSaved = false
        state.payment.paymentDate = $h.formatDate(new Date());
        state.payment.name = null;
        state.payment.cardNumber = null;
        state.payment.cardCvv = null;
        state.payment.cardExpiry = null;
        state.payment.memo = "";
        state.payment.paymentType = "";
        state.payment.amount = "";
        state.payment.invoiceId = null;
        state.payment.exchangeRate = '';
        state.payment.convertedAmount = '';
        state.payment.memo = '';
        state.payment.cardNumber = null;
        state.payment.cardCvv = null;
        state.payment.expMonth = null;
        state.payment.expYear = null;
        state.payment.cardExpiry = null;
        state.payment.customFields = []
        state.isOpenPaymentModal = false

    }

    const cardNumberInput = (e) => {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
        state.payment.cardNumber = raw
        state.formattedCardNumber = raw.replace(/(.{4})/g, '$1 ').trim()
    }

    const cardExpiryInput = (e) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 4)
        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2)
        state.payment.cardExpiry = val.replace('/', '')
        state.formattedExpiry = val
    }

    const cardCvvInput = (e) => {
        state.payment.cardCvv = e.target.value.replace(/\D/g, '').slice(0, 4)
    }

    const setDisplayAmountDue = (amount) => {
        state.payment.amount = amount
        state.displayAmountDue = amount
    }

    const setDisplayAmountPaid = (amount) => {
        state.displayAmountPaid = amount
    }

    const updateAmountDue = (amount) => {
        let amt = amount - state.paidAmount
        state.payment.amount = amt
        state.displayAmountDue = amt
    }

    const resetPaymentForm = () => {
        state.payment.paymentType = ""
        state.formTitle  = "Cash Payment"
        state.payment.paymentDate = $h.formatDate(new Date());
        state.payment.name = null;
        state.payment.cardNumber = null;
        state.payment.cardCvv = null;
        state.payment.cardExpiry = null;
        state.payment.memo = "";

        state.error = null;
        state.status = null;
    }

    return {
        ...toRefs(state),
        init,
        closeModal,
        cardNumberInput,
        cardExpiryInput,
        cardCvvInput,
        fetchPayments,
        selectPaymentType,
        // showPaymentTypes
        showDeleteModal,
        savePayment,
        validateManualPayment,
        validateCreditCard,
        validateCloverPos,
        updateAmountDue,
        setDisplayAmountDue,
        setDisplayAmountPaid,
        updatePaymentRequest,
        voidPayment,
    }
}