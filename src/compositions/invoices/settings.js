import { reactive, toRefs } from "vue"
import config from "../../config"
import { useApi } from "@/compositions/api"
import { helper as $h } from "@/utils/helper"
import { useVuelidate } from "@vuelidate/core"
import { useUtils } from "@/compositions/utils"
import VALIDATE from "@/compositions/validate"
import cash from "cash-dom"

const state = reactive({    
    setting : {
        logo                 : '',
        invoice_template     : 'default',
        accent_color         : "#cccccc",
        invoice_title        : 'Invoice',
        invoice_subheading   : '',
        invoice_footer_notes : '',
        invoice_terms        : '',    
        estimate_title       : 'Estimate',
        estimate_subheading  : '',
        estimate_footer_notes : '',
        estimate_terms       : '',    
        reminder_days        : [],
        invoice_columns      : {},
        currency             : 'USD',
        date_format           : 'MM/DD/YYYY',   
    },
    invoiceTemplates : [
        {
            type : 'classic',
            image: 'invoice-template-blue.png',
            name  : "Template 1"
        },
        {
            type : 'modern',
            image: 'invoice-template-blue.png',
            name  : "Template 2"
        },
        {
            type : 'professional',
            image: 'invoice-template-blue.png',
            name  : "Template 3"
        }
    ],
    swatches: [
        '#F64272', '#F6648B', '#F493A7', '#F891A6',
        '#8b5aff', '#a27bff', '#b99cff', '#d0bdff',
        '#51e5db', '#74ebe3', '#96f0ea', '#b9f5f1',
        '#ffa51a', '#ffb748', '#ffc976', '#ffdba3',
    ],
    showLoadingIcon : {
        general     : false,
        invoice     : false,
        estimate    : false,
        reminder_days   : false,
        invoice_columns : false,
        date_currency   : false,
    },    
    DateFormatList  : {
    'MMMM D, YYYY' : 'Month D, YYYY',
    'DD/MM/YYYY' :'DD/MM/YYYY',
    'YYYY/MM/DD' : 'YYYY/MM/DD',
    'MM/DD/YYYY' : 'MM/DD/YYYY',
    },
    columns : {
        items : [
            {
                name : "Items",
                value : "items"
            },
            {
                name : "Products",
                value : "products"
            },
            {
                name : "Services",
                value : "services"
            },
            {
                name : "Other",
                value : "others"                       
            }
        ],
        units : [
            {
                name : "Quantity",
                value : "quantity"
            },
            {
                name : "Hours",
                value : "hours"
            },
            {
                name : "Other",
                value : "others"                       
            }
        ],
        price : [
            {
                name : "Price",
                value : "price"
            },
            {
                name : "Rate",
                value : "rate"
            },
            {
                name : "Other",
                value : "others"                       
            }
        ],
        taxable : [
            {
                name : "Taxable",
                value : "taxable"
            },
            {
                name : "Tax",
                value : "tax"
            },
            {
                name : "Other",
                value : "others"                       
            }
        ],
        amount : [
            {
                name : "Amount",
                value : "amount"
            },
            {
                name : "Total",
                value : "total"
            },
            {
                name : "Other",
                value : "others"                       
            }
        ]
    },    
    reminderDayList : [3 ,7, 14 ,28],
    previewTemplate : null,
    alertMessage    : null,
    validationErrors: null,
    error           : false,
    isSaved         : false,
    isOpenInvoiceColumnModal : false,
})

export const showNotification = () => {
    $h.notification(state.error,state.alertMessage,state.validationErrors)
    state.isSaved = false
    state.error = false
    state.alertMessage = null
    state.validationErrors = null
}

export const useSettings = () => {

    const { currencies,settings } = useUtils()

    state.setting = settings.value    

    state.setting.invoice_title  = (settings.value.invoice_title == '') ? 'Invoice' : settings.value.invoice_title
    state.setting.estimate_title = (settings.value.estimate_title == '') ? 'Estimate' : settings.value.estimate_title
    state.setting.accent_color   = (settings.value.accent_color == '') ? '#cccccc' : settings.value.accent_color
    state.setting.reminder_days  = (settings.value.reminder_days) ? settings.value.reminder_days : []

    //validation
    const validate = useVuelidate(VALIDATE.Setting , state.setting)

    const updateSetting = async (type = null) => {

        validate.value.$touch()

        if (validate.value.$invalid) return

        if(type == 'general') state.showLoadingIcon.general = true
        if(type == 'invoice') state.showLoadingIcon.invoice = true
        if(type == 'estimate') state.showLoadingIcon.estimate = true        

        const { data, post, status }  = useApi(config.SETTING_URL)

        const payload = {
            invoice_template    : state.setting.invoice_template,
            accent_color        : state.setting.accent_color,
            invoice_title       : state.setting.invoice_title,
            invoice_subheading  : state.setting.invoice_subheading,
            invoice_footer_notes: state.setting.invoice_footer_notes,
            invoice_terms       : state.setting.invoice_terms,
            estimate_title      : state.setting.estimate_title,
            estimate_subheading : state.setting.estimate_subheading,
            estimate_footer_notes: state.setting.estimate_footer_notes,    
            estimate_terms      : state.setting.estimate_terms,
        }

        await post(payload)

        if(status.value == 400 || status.value == 404){
            state.alertMessage = 'Unable to update setting'
            state.error  = true
            if(data.value.validation_errors) {
                state.alertMessage = 'Validation Failed'
                state.validationErrors = data.value.validation_errors
            }
        }else{
            state.alertMessage = 'Setting has been updated'
        }
        
        if(type == 'general') state.showLoadingIcon.general = false
        if(type == 'invoice') state.showLoadingIcon.invoice = false
        if(type == 'estimate') state.showLoadingIcon.estimate = false

        state.isSaved = true
        
    }

    const onFilePicked = async (event) => {
        const { data, post, status }  = useApi(config.SETTING_URL + 'logo-upload')
        const files = event.target.files
        const fileReader = new FileReader();

        fileReader.addEventListener('load', () => {
            state.setting.logo = fileReader.result
        })

        let postData = new FormData();
        postData.append('logo', files[0]);

        fileReader.readAsDataURL(files[0])

        await post(postData,true)

        if(status.value == 400 || status.value == 404){
            state.alertMessage = 'Unable to upload company logo'
            state.error  = true
        }else{
            state.alertMessage = 'Company logo has been uploaded'
        }
        state.isSaved = true
    }

    const removeFile = async () => {

        const { data, get, status }  = useApi(config.SETTING_URL + 'logo-remove')

        await get()

        if(status.value == 400 || status.value == 404){
            state.alertMessage = 'Unable to delete company logo'
            state.error  = true
        }else{
            state.alertMessage = 'Company logo has been deleted'
            state.setting.logo = ''
        }

        state.isSaved = true
    }

    const updateReminderDays = async () => {

        state.showLoadingIcon.reminder_days = true

        const { data, post, status }  = useApi(config.SETTING_URL + 'reminder-days')

        await post({days : state.setting.reminder_days})

        // if(data.value.validation_errors) state.validationErrors = data.value.validation_errors
        
        if(status.value == 400 || status.value == 404){
            state.alertMessage = 'Unable to update reminder days setting'
            state.error  = true

            if(data.value.validation_errors) {
                state.alertMessage = 'Validation Failed'
                state.validationErrors = data.value.validation_errors
            }

        }else{
            state.alertMessage = 'Setting has been updated'
        }
        
        state.isSaved = true
        state.showLoadingIcon.reminder_days = false

    }

    const updateInvoiceColumns = async () => {

        state.showLoadingIcon.invoice_columns = true

        const { data, post, status }  = useApi(config.SETTING_URL + 'invoice-columns')

        await post({invoice_columns : state.setting.invoice_columns})

        // if(data.value.validation_errors) state.validationErrors = data.value.validation_errors

        if(status.value == 400 || status.value == 404){
            state.alertMessage = 'Unable to update invoice columns setting'
            state.error  = true

            if(data.value.validation_errors) {
                state.alertMessage = 'Validation Failed'
                state.validationErrors = data.value.validation_errors
            }

        }else{
            state.alertMessage = 'Setting has been updated'
        }

        state.isSaved = true        
        state.showLoadingIcon.invoice_columns = false
        state.isOpenInvoiceColumnModal = false
    }

    const updateDateCurrency = async () => {

        state.showLoadingIcon.date_currency = true

        const { data, post, status }  = useApi(config.SETTING_URL + 'date-currency')

        let currency = currencies.value.filter((c)=>{
            return c.code === state.setting.currency
        })


        const payload = {
            date_format : state.setting.date_format,
            currency    : currency[0].code,
            currency_symbol : currency[0].symbol
        }

        await post(payload)

        // if(data.value.validation_errors) state.validationErrors = data.value.validation_errors

        if(status.value == 400 || status.value == 404){
            state.alertMessage = 'Unable to update date format and currency.'
            state.error  = true

            if(data.value.validation_errors) {
                state.alertMessage = 'Validation Failed'
                state.validationErrors = data.value.validation_errors
            }

        }else{
            state.alertMessage = 'Setting has been updated'
        }

        state.isSaved = true        
        state.showLoadingIcon.date_currency = false

    }    

    const previewInvoiceTemplate = (num) => {
        state.previewTemplate = invoiceTemplateArg[num].image
            cash("#large-modal-size-preview").modal("show")
    }

    return {
        ...toRefs(state),
        onFilePicked,
        removeFile,
        previewInvoiceTemplate,
        updateSetting,
        updateReminderDays,
        updateInvoiceColumns,
        updateDateCurrency,
         currencies,
        validate,
    }
}