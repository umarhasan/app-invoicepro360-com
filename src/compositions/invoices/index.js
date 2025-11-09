import { reactive, ref, toRefs,watch } from "vue"
import { useApi } from "@/compositions/api"
import { useUtils } from "@/compositions/utils"
import { helper as $h } from "@/utils/helper"
import { appText as $T } from "@/utils/AppText"
import config from "@/config"
import VALIDATE from "@/compositions/validate"
import {validatePermissions} from "@/compositions/permissions"
import { useVuelidate } from "@vuelidate/core"
import cash from "cash-dom"

import { 
    helpers 
} from "@vuelidate/validators"

import { useInvoiceItems, resetInvoiceItems } from "./items"
import { useCustomer, resetCustomer } from "./customer"
import { useInvoice } from "@/compositions/intuit/integrations";
import { useClover,CheckDeviceConnection } from "@/compositions/clover";
import { usePayment } from "@/compositions/payment"

const INVOICE_STATUS_DRAFT = 'draft'
const INVOICE_STATUS_PUBLISH = 'publish'

const state = reactive({
    title : 'New Invoice',
    invoice : {
        id              : null,
        customerId      : null,
        businessId      : '',
        companyLogo     : '',
        invoiceTitle    : '',
        invoiceSummary  : '',
        invoiceNumber   : '',
        referenceNumber : '',
        invoiceDate     : '',
        paymentDueDate  : '',
        notes           : '',
        footerNotes     : '',
        currency        : '', 
        exchangeRate    : '',
        subTotal        : '',
        taxTotal        : '',
        grandTotal      : '',
        dueAmount : 0.0,
        shareUrl        : '',
        //for approve draft invoice functionality
        status          : '',
        publishedDate   : '',  
        lastSendDate    : '',
    },    
    invoiceColumns : [],
    salesTaxGroup  : [],
    salesTax       : [],
    taxes          : [],
    invoiceItems   : [],
    totalTaxAmount : 0.00,
    taxableTotal   : 0.00,
    subTotal       : 0.00,
    grandTotal     : 0.00,
    //fetch invoice
    status         : null,
    records        : null,
    meta           : {
        current: 1,
        size: 10,
        total_pages: 0,
        total_results: 0,
    },
    orderBy : null,
    order   : 'desc',
    filter : {
        customer  : '',
        status    : '',
        fromDate  : '-',
        toDate    : '-',
        invoiceNumber : '',
    },
    
    //calculate sum of invoices 
    overdueAmount : 0.00, 
    outstandingAmount : 0.00,
    indraftAmount : 0.00,
    isCalculated : false,
    isNotify : false,
    isPublished : false,
    isDrafted : false,
    isDisabled : false,
    alertMessage : '',
    showLoadingIcon : false,
    error   : false,
    type : 'draft',
    validationErrors : [],
    permissions:[],
    isSalesTaxLoaded : false,
    isLoaded : false,
    isDeleteModal : false,
    isOpenSendInvoiceModal : false
})

let invoiceNumber = 0

export const CalculateInvoicesSum = () => {

    const { data, get, status } = useApi(config.INVOICE_URL+"calculate")

    state.isCalculated = false

    get().then(() => {
        if(status.value === 404){
            state.isCalculated = true
        }else{
            let d = data.value.data
            state.isCalculated = true
            state.overdueAmount = d.overdueAmount
            state.indraftAmount = d.indraftAmount
            state.outstandingAmount = d.outstandingAmount
        }        
    })
}

export const fetchInvoices = (currentPage = 1, itemPerPage = 10) => {

    validatePermissions('invoice','view')

    let url = `${config.INVOICE_URL}?page=${currentPage}&size=${itemPerPage}`

    if(state.filter.customer) url += `&customer=${state.filter.customer}`
    if(state.filter.status) url += `&status=${state.filter.status}`
    if(state.filter.invoiceNumber) url += `&invoice_number=${state.filter.invoiceNumber}`
    if(state.filter.toDate && state.filter.toDate != '-') url += `&to_date=${$h.formatDate(state.filter.toDate)}`
    if(state.filter.fromDate && state.filter.fromDate != '-') url += `&from_date=${$h.formatDate(state.filter.fromDate)}`
    // if(state.orderBy) url += `&order_by=${state.orderBy}&order=${state.order}`
    
    const { data, get, error,status }  = useApi(url)

    get().then( () => {

        state.status = status.value

        if(status.value === 404){
            state.error = true
            state.isNotify = true
            state.alertMessage = error.value
        }else{
            state.records = data.value.data
            state.meta = data.value.meta
        }        
    })
    
    return {
        ...toRefs(state)
    }
}

export const updateTotal = (isDisplayOrder = true) => {

    console.log(`invoice:updateTotal Clover display order: ${isDisplayOrder}`)
    const { displayOrder,DisplayOrder} = useClover()
    const { updateAmountDue} = usePayment()

    state.subTotal = state.invoiceItems.reduce((acc, item) => {
       if(!item.isDeleted) acc =  item.total + acc
       return acc
    }, 0)

    state.taxableTotal = state.invoiceItems.reduce((acc, item) => {                      
        if(item.isTaxable == 1 && !item.isDeleted) acc = item.total + acc 
        return acc  
    }, 0)      

    updateTax()

        
    state.grandTotal = state.subTotal + state.totalTaxAmount

    updateAmountDue(state.grandTotal)

    if (isDisplayOrder){
        //display order on clover device
        displayOrder.value.tax = $h.formatAmount(state.totalTaxAmount)
        displayOrder.value.subtotal = $h.formatAmount(state.subTotal)
        displayOrder.value.total = $h.formatAmount(state.grandTotal)
        displayOrder.value.amountRemaining = $h.formatAmount(state.invoice.dueAmount)
        
        displayOrder.value.lineItems = [];

        state.invoiceItems.forEach(item => {
            displayOrder.value.lineItems.push({       
                name : item.name,
                note : item.description,
                quantity : String(item.quantity),
                price : $h.formatAmount(item.price),
            })
        })                
       DisplayOrder()
    }
}

const updateTax = () => {
    let taxableAmount = state.taxableTotal
    state.totalTaxAmount = 0

    if(state.salesTax){        
        state.salesTax.filter((tax) => {
            tax.taxAmount = (taxableAmount/100) * (tax.taxRate)
            state.totalTaxAmount += tax.taxAmount
        })
    }
}

const fetchSalesTax = () => {

    state.isSalesTaxLoaded = false

    const { data, get, error, status }  = useApi(config.SALES_TAX_URL)
    get().then( () => {        
        if(status.value !== 404){
            state.taxes = data.value.data ? data.value.data : []
            state.isSalesTaxLoaded = true
        }else{
            state.isSalesTaxLoaded = true
        } 
    })
}

const setInvoiceNumber = () => {
    const { data, get, error, status }  = useApi(`${config.INVOICE_URL}invoice-number`)

    get().then( () => {        
        if(status.value !== 404){
            state.invoice.invoiceNumber = data.value.data ? data.value.data.invoiceNumber : 0
        }
    })  
}

export const saveInvoice = () => {
    validatePermissions('invoice',`${state.invoice.id ? 'edit': 'create'}`)    

    fetchSalesTax()
        
    const { settings} = useUtils()
    const { customerId, billedCustomer } = useCustomer()
    const { invoiceItems, salesTax } = useInvoiceItems()
    const {createInvoice, updateInvoice } = useInvoice()
    const { displayWelcomeScreen} = useClover()

    state.isLoaded = true
    
    // Validate and check clover device active or not
    // CheckDeviceConnection()
    // Reset invoice form      
    displayWelcomeScreen()
    resetForm()
    resetCustomer()
    resetInvoiceItems()
    updateTotal(false)

    if(!state.invoice.id) setInvoiceNumber()

    // Set setting
    state.invoice.companyLogo     = settings.value.logo
    state.invoice.invoiceTitle    = settings.value.invoice_title
    state.invoice.invoiceSummary  = settings.value.invoice_subheading
    // Set billed customer
    state.invoice.customerId = customerId.value
    // Items
    state.invoiceItems  = invoiceItems.value
    // Sales tax
    state.salesTax  = salesTax.value
    
    // validation object
    const validate = useVuelidate(VALIDATE.Invoice, state.invoice, { $scope: false })

    const validateItems = useVuelidate({
            invoiceItemsLength : helpers.withMessage("One Invoice item required",()=> (state.invoiceItems.length > 0))
        }, invoiceItems.value,{ $scope: false })
    
    const submit = async (_type) => {

        state.invoice.customerId = customerId.value
        state.invoice.subTotal   = state.subTotal
        state.invoice.taxTotal   = state.totalTaxAmount
        state.invoice.grandTotal = state.grandTotal
        state.invoiceItems       = invoiceItems.value
        //validate
        validate.value.$touch()
        validateItems.value.$touch()

        if (validate.value.$invalid) return
        if (validateItems.value.$invalid) return

        state.isDisabled = true
        state.isLoaded = false

        console.log("Invoice Date: ", state.invoice.invoiceDate)
        console.log("Payment Due Date: ", state.invoice.paymentDueDate)
 
        //invoice create / update payload
        const payload = {
            "invoice" : {
                "id"              : state.invoice.id,
                "customerId"      : state.invoice.customerId,
                "invoiceTitle"    : state.invoice.invoiceTitle,
                "subheading"      : state.invoice.invoiceSummary,
                "invoiceNumber"   : state.invoice.invoiceNumber.toString(),
                "referenceNumber" : state.invoice.referenceNumber,
                "invoiceDate"     : state.invoice.invoiceDate,
                "paymentDueDate"  : state.invoice.paymentDueDate,
                "notes"           : state.invoice.notes,
                "footerNotes"     : state.invoice.footerNotes,
                "subTotal"        : state.invoice.subTotal,
                "taxTotal"        : state.invoice.taxTotal,
                "grandTotal"      : state.invoice.grandTotal,
                "status"          : (_type == INVOICE_STATUS_DRAFT) ? INVOICE_STATUS_DRAFT : INVOICE_STATUS_PUBLISH
            },
            // "billed_customer" : state.billedCustomer,
            "invoice_items" : state.invoiceItems,
            "sales_tax"     : state.salesTax
        }

        const { data, post, update, error } = useApi(
            config.INVOICE_URL + `${state.invoice.id ? state.invoice.id: "create"}`
        )

        if (!state.invoice.id) {
            await post(payload)
            state.alertMessage = "Invoice created successfully"
        }else{
            await update(payload)
            state.alertMessage = "Invoice updated successfully"
        }

        if(!error.value) {
            payload.invoice.customerId = billedCustomer.value.intuit_id
            console.log(data.value.data)
            let uid = data.value.data
            
            //create/update clover invoice
            if(!state.invoice.id) createInvoice(payload,data.value.data)
            if(state.invoice.id) updateInvoice(payload,state.invoice.id)
            
            state.title = "Edit Invoice"
            state.invoice.id    = uid
            state.isNotify      = true
            state.error         = false
            state.isDisabled    = false
            state.isDrafted     = false
            state.isPublished   = false
            state.type         = _type
            state.isLoaded     = true

            //TODO:notify on send invoice or tender button click and invoice should be new
            if(state.type == INVOICE_STATUS_DRAFT || 
               state.type == INVOICE_STATUS_PUBLISH) showNotification()

            if(state.type == INVOICE_STATUS_DRAFT) {
                state.isDrafted = true   
                router.push({ name: 'invoices' })

            }
            if(state.type != INVOICE_STATUS_DRAFT) {
                state.isPublished = true

                router.replace({
                    name : "edit-invoice",
                    params: { uid : uid},  
                })
            }

        }else{
            state.error = true
            state.isNotify = true
            state.alertMessage = error.value
            state.isDisabled = false
        }
    }
      
    const completeInvoice = () =>{
        const { data, post, update, error } = useApi(`${config.INVOICE_URL + state.invoice.id+"complete"}`)

        post().then(()=>{

        })
    }

    return {
        validate,
        validateItems,
        ...toRefs(state),
        submit,
        completeInvoice
    }
}

export const EditInvoice = (invoice_id) => {

    validatePermissions('invoice','edit')    

    const { data, get, error } = useApi(config.INVOICE_URL + invoice_id + '/edit')    
    const { setCustomer } = useCustomer()
    const { setItems,setTaxes } = useInvoiceItems()

    state.title = "Edit Invoice"
    state.isLoaded = false
    get().then( () => {

        // Invoice
        let inv = data.value.data.invoice
        state.invoice.id              = inv.id;
        state.invoice.customerId      = inv.customerId;
        state.invoice.invoiceTitle    = inv.invoiceTitle;
        state.invoice.invoiceSummary  = inv.invoiceSummary
        state.invoice.invoiceNumber   = inv.invoiceNumber
        state.invoice.referenceNumber = inv.referenceNumber
        state.invoice.invoiceDate     = $h.formatDate(inv.invoiceDate)
        state.invoice.paymentDueDate  = $h.formatDate(inv.paymentDueDate)
        state.invoice.notes           = inv.notes
        state.invoice.footerNotes     = inv.footerNotes
        // state.invoice.currency        = inv.currency 
        state.invoice.subTotal        = inv.subTotal
        state.invoice.grandTotal      = inv.grandTotal
        state.invoice.dueAmount       = inv.dueAmount
        state.invoice.shareUrl        = inv.shareUrl
        state.invoice.status          = inv.status
        state.invoice.publishedDate   = inv.publishedDate  
        state.invoice.lastSendDate    = inv.lastSendDate

        state.subTotal  = state.invoice.subTotal
        state.grandTotal= state.invoice.grandTotal

        // Customer
        setCustomer(data.value.data.customer,state.invoice.customerId)        
        // Items
        setItems(data.value.data.invoiceItems)
        // Sales tax
        if(data.value.data.salesTax){
            setTaxes(data.value.data.salesTax[0])
        }

        if(state.invoice.status == INVOICE_STATUS_DRAFT){
            state.isDrafted = true
            state.isPublished = false
        }

        if(state.invoice.status == INVOICE_STATUS_PUBLISH){
            state.isDrafted = false
            state.isPublished = true
        }

        state.isLoaded = true
    })
}

export const viewInvoice = (uuid) => {
    state.isLoaded = false
    state.isNewInvoice = false
    const { data, get, error } = useApi(config.INVOICE_URL + uuid + '/view')    
    const { setCustomer } = useCustomer()
    const { setItems,setTaxes,invoiceItems } = useInvoiceItems()
    const { displayOrder} = useClover()

    const approveLoader = ref(false)
    const customer = ref([])

    resetInvoiceItems()

    get().then( () => {

        // Invoice
        state.title     = `${$T.INV_VIEW_TXT} #${state.invoice.invoiceNumber}`
        state.invoice   = data.value.data.invoice
        state.subTotal  = state.invoice.subTotal
        state.grandTotal= state.invoice.grandTotal
        state.invoice.shareUrl = config.PUBLIC_INVOICE_VIEW + uuid

        // Customer
        customer.value = data.value.data.customer
        setCustomer(customer,state.invoice.customerId)
        // Items
        setItems(data.value.data.invoiceItems)
        state.invoiceItems = invoiceItems.value
        // Sales tax
        setTaxes(data.value.data.salesTax)

        state.isLoaded = true
        state.isCreated = true
        // Display order on clover device
        displayOrder.value.tax = $h.formatAmount(state.totalTaxAmount)
        displayOrder.value.subtotal = $h.formatAmount(state.subTotal)
        displayOrder.value.total = $h.formatAmount(state.invoice.dueAmount)
        displayOrder.value.amountRemaining = $h.formatAmount(state.invoice.dueAmount)

        state.invoiceItems.forEach(item => {
            displayOrder.value.lineItems.push({            
                name : item.name,
                note : item.description,
                quantity : String(item.quantity),
                price : $h.formatAmount(item.price),            
            })
        })
    })

    const approveInvoice = () => {
        const { data, get, error } = useApi(`${config.INVOICE_URL}/publish?id=${uuid}`)    
        approveLoader.value = true

        get().then( () => {
            state.invoice.status   = data.value.data.status
            state.invoice.publishedDate = data.value.data.publishedDate 
            approveLoader.value = false
        })
    }

    const redirecttoEdit = () => {
        router.push({ name: 'edit-invoice', params: { uid: uuid } })
    }

    const printInvoice = () => {
        window.print()
    }
  
    const showShareLinkModal = () => {
        cash("#share-link-modal").modal("show");
    };

    return {
        ...toRefs(state),
        customer,
        approveLoader,
        approveInvoice,
        redirecttoEdit,
        printInvoice,
        showShareLinkModal,
    }
}

export const exportCSV = () => {
    // validatePermissions('invoice ','export')

    const { get, status,data } = useApi(`${config.INVOICE_URL}export-csv`)
    state.showLoadingIcon = true
    state.error = false
    state.isNotify = false
    
    get().then(() =>{

        if(status.value === 404 || status.value === 400){
            state.error = true
            state.isNotify = true        
            state.alertMessage = 'Unable to export invoice csv'
            state.showLoadingIcon = false
        }else{

            let base64String = `data:application/csv;base64, ${data.value.data.base64Csv}`;
    
            const downloadLink = document.createElement("a");

            downloadLink.href = base64String;
            downloadLink.download = data.value.data.name;
            downloadLink.click();

            state.showLoadingIcon = false
            state.isNotify = true
            state.alertMessage = "Invoice csv exported successfully."
        }
    })
}

export const showNotification = () => {
    $h.notification(state.error,state.alertMessage,state.validationErrors)
    state.isNotify = false
    state.error = false
    state.alertMessage = null
    state.validationErrors = []
}

export const publicInvoiceView = (uuid) => {
//    const { setCustomer } = useCustomer()
    const { data, get, error } = useApi(config.INVOICE_URL + uuid + '/view')    
    const { setItems,setTaxes } = useInvoiceItems()    
    const customer = ref([])
    state.isLoaded = false
    get().then( () => {
        // Invoice
        state.title = `INVOICE #${state.invoice.invoiceNumber}`
        state.invoice   = data.value.data.invoice
        state.subTotal  = state.invoice.subTotal
        state.grandTotal= state.invoice.grandTotal
        // Customer
        customer.value = data.value.data.customer
        // setCustomer(customer,state.invoice.customerId)
        // Items
        setItems(data.value.data.invoiceItems)
        // Sales tax
        setTaxes(data.value.data.salesTax)
        state.isLoaded = true
    })

    return {
        ...toRefs(state),
        customer,
    }
}

export const showDeleteModal = (row ,value) => {
    state.invoice.id = row.id
    state.isDeleteModal =  value
}

export const confirmDelete = () => {
    
    let index = state.records.findIndex(item => item.id == state.invoice.id)

    const {get,error,status} = useApi(`${config.INVOICE_URL}delete/${state.invoice.id}`)
    
    get().then(() => {
        if(status.value != '404'){
            state.records.splice(index,1)
            cash(".yr-success").removeClass("hide").addClass("show")         
            state.isDeleteModal =  false

        }
    })
    .catch(() => {
        cash(".yr-danger").removeClass("hide").addClass("show")
    })
}

const resetForm = () => {
    const { settings } = useUtils()
    state.isPublished = false
    state.isDrafted = false
    state.isDisabled = false
    // state.title = "New Invoice"        
    state.invoice.id              = ''
    state.invoice.customerId      = ''
    state.invoice.businessId      = ''
    state.invoice.invoiceTitle    = settings.value.invoice_title
    state.invoice.invoiceSummary  = settings.value.invoice_subheading
    state.invoice.invoiceNumber   = (invoiceNumber > 0) ? invoiceNumber : ''
    state.invoice.referenceNumber = ''
    state.invoice.invoiceDate     = ''
    state.invoice.paymentDueDate  = ''
    state.invoice.notes           = ''
    state.invoice.footerNotes     = ''
    state.invoice.currency        = '' 
    state.invoice.exchangeRate    = ''
    state.invoice.subTotal        = ''
    state.invoice.taxTotal        = ''
    state.invoice.grandTotal      = ''
    state.invoice.status          = ''
    state.invoice.publishedDate   = ''
    // Items
    state.invoiceItems  = []

    // Sales tax
    state.salesTax  = []
}
