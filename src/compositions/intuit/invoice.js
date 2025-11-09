import { useUtils } from "@/compositions/utils"
import { useApi } from "@/compositions/api"
import config from "@/config"


export const createInvoice = (payload,invoiceId) => {

    if(!validate()) return

    // let TaxLine =  {
    //     "Amount" : 0,
    //     "DetailType" : '',
    //     "TaxLineDetail" : {
    //         "TaxRateRef" : {
    //             "value" : null,
    //         }
    //     },
    //     "PercentBased" : true,
    //     "TaxPercent" : 0.00,
    //     "NetAmountTaxable" : 0.00
    // }

    let reqObj = {
        payload : {
            "DueDate" : payload.invoice.paymentDueDate,
            "CustomerRef": {
                "value": payload.invoice.customerId
            },
            "CustomerMemo": {
                "value": payload.invoice.notes
            },
            "Line" : [],
            "TxnTaxDetail" : {
                "TxnTaxCodeRef" : {
                   "value" : null
                }
            }
        },
        lastInsertId : parseInt(invoiceId)
    }

    payload.invoice_items.forEach( (item) => {
        reqObj.payload.Line.push({
            "Amount": parseFloat(item.total),
            "Description" : item.description,
            "DetailType": "SalesItemLineDetail",
            "SalesItemLineDetail": {
                "Qty": item.quantity, 
                "UnitPrice": parseFloat(item.price), 
                "ItemRef": {
                    "name": item.name, 
                    "value": item.intuit_id,
                },       
                "TaxCodeRef": {
                    "value": (item.isTaxable)? "TAX":"NON"
                }
            }
        })
    })     

    if (payload.sales_tax.length > 0) {
        reqObj.payload.TxnTaxDetail.TxnTaxCodeRef.value = payload.sales_tax[0].intuit_id
    }


    const { data, post } = useApi(config.INTUIT_INVOICE_URL)   

    post(reqObj).then( () => {})

}

export const updateInvoice = (payload,invoiceId) => {

    if(!validate()) return
    
    let reqObj = {
        payload : null,
        lastInsertId : parseInt(invoiceId)
    }

    reqObj.payload = {}

    const { data, update } = useApi(config.INTUIT_INVOICE_URL)   
        
    update(reqObj).then( () => {})

}


export const deleteInvoice = (invoice_id) => {

    if(!validate()) return

    const { data, del } = useApi(config.INTUIT_INVOICE_URL)   

    del({
        invoice_id : parseInt(invoice_id)
    }).then( () => {})
}


// validate before CRUD
const validate = () => {

    const {
      isIntuitAccessTokenValid,
      intuitSyncSettings
    } = useUtils()
  
    if(
      isIntuitAccessTokenValid.value && 
      intuitSyncSettings.value.isConnected && 
      !intuitSyncSettings.value.isPaused &&
      intuitSyncSettings.value.isInvoiceSyncAllowed 
      ){
        return true
      }else{
        return false
      }
  
}