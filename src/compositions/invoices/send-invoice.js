import { reactive, toRefs } from "vue"
import { useApi } from "@/compositions/api"
import { useAuth } from "@/compositions/auth"
import { helper as $h } from "@/utils/helper"
import {required,email } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core"
import config from "../../config"

const url = config.EMAIL_SEND_INVOICE_URL
const state = reactive({
    mail : {
        from : '',
        to : '',
        cc : [],
        subject : '',
        message : '',
        isAttachPDF : false,
        isSendOwn : false,
        recipient : null,
        invoiceId : null
    }, 

    isMailSend : false,
    displayRecipientField : false,
    showLoadingIcon :false,    
    validationErrors : null,
    status : null,
    error : null,

})

export const Recipient = () => {
    
    const recipientValidate = useVuelidate({
        recipient: { required,email },    
    }, state.mail)

    const addRecipient = () => {
        
        if(state.displayRecipientField){

            //validate
            recipientValidate.value.$touch()
            if (recipientValidate.value.$invalid) return

            state.mail.cc.push(state.mail.recipient)
            state.mail.recipient = null
            state.displayRecipientField = false
        }else{
            state.mail.recipient = null
            state.displayRecipientField = true
        }
    }

    const deleteRecipient = (index) => {
        state.mail.cc.splice(index,1)
    }

    const hideRecipientField = () => {
        state.mail.recipient = null
        state.displayRecipientField = false
    }

    return {
        ...toRefs(state),
        addRecipient,
        deleteRecipient,
        hideRecipientField,
        recipientValidate
    }
}

export const sendInvoice = () => {

    const { user } = useAuth();

    state.mail.from = user.value.email;

    const validationRules = {
        from: { required },
        to: { required },
    }

    //validation object
    const validate = useVuelidate(validationRules, state.mail)

    const submit = () => {  
        //validate
        validate.value.$touch()
        if (validate.value.$invalid) return

        state.showLoadingIcon = true

        const { data, post, error,status } = useApi(url)     
        
        if(state.mail.recipient){
            state.mail.cc.push(state.mail.recipient)
            state.mail.recipient = null
            state.displayRecipientField = false
        }
        
         post(state.mail).then( () => {
            state.status = status.value

            if(status.value === 404 || status.value === 400){
                state.error = error.value
                state.showLoadingIcon = false

                $h.notification(true,"Unable to send invoice mail",[])
            }else{
                state.isMailSend = true
                state.showLoadingIcon = false
                $h.notification(false,"Invoice mail sent",[])
            }
         })
      }
    
    const resetForm = () => {
        // cash("#send-invoice-modal").modal('hide')
        state.showLoadingIcon= false
        state.isMailSend = false
        state.mail.cc = []
        state.mail.subject = ''
        state.mail.message = ''
        state.mail.isAttachPDF = false
        state.mail.isSendOwn = false
        state.mail.recipient = null
    }

    return {
        ...toRefs(state),
        validate,
        submit,
        resetForm,
    }
}