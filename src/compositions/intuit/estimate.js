import { useUtils } from "@/compositions/utils"
import { useApi } from "@/compositions/api"
import config from "@/config"

// Create Estimate
export const createEstimate = (payload, estimateId) => {

    if(!validate()) return

    let reqObj = {
        payload: {
            "DueDate": payload.estimate.paymentDueDate,
            "CustomerRef": {
                "value": payload.estimate.customerId
            },
            "CustomerMemo": {
                "value": payload.estimate.notes
            },
            "Line": [],
            "TxnTaxDetail": {
                "TxnTaxCodeRef": {
                   "value": null
                }
            }
        },
        lastInsertId: parseInt(estimateId)
    }

    payload.estimate_items.forEach((item) => {
        reqObj.payload.Line.push({
            "Amount": parseFloat(item.total),
            "Description": item.description,
            "DetailType": "SalesItemLineDetail",
            "SalesItemLineDetail": {
                "Qty": item.quantity,
                "UnitPrice": parseFloat(item.price),
                "ItemRef": {
                    "name": item.name,
                    "value": item.intuit_id,
                },
                "TaxCodeRef": {
                    "value": (item.isTaxable) ? "TAX" : "NON"
                }
            }
        })
    })

    if (payload.sales_tax.length > 0) {
        reqObj.payload.TxnTaxDetail.TxnTaxCodeRef.value = payload.sales_tax[0].intuit_id
    }

    const { data, post } = useApi(config.INTUIT_ESTIMATE_URL)

    post(reqObj).then(() => {})
}

// Update Estimate
export const updateEstimate = (payload, estimateId) => {

    if(!validate()) return

    let reqObj = {
        payload: null,
        lastInsertId: parseInt(estimateId)
    }

    reqObj.payload = {}

    const { data, update } = useApi(config.INTUIT_ESTIMATE_URL)

    update(reqObj).then(() => {})
}

// Delete Estimate
export const deleteEstimate = (estimate_id) => {

    if(!validate()) return

    const { data, del } = useApi(config.INTUIT_ESTIMATE_URL)

    del({
        estimate_id: parseInt(estimate_id)
    }).then(() => {})
}

// Validate before CRUD operations
const validate = () => {

    const {
      isIntuitAccessTokenValid,
      intuitSyncSettings
    } = useUtils()

    if (
      isIntuitAccessTokenValid.value &&
      intuitSyncSettings.value.isConnected &&
      !intuitSyncSettings.value.isPaused &&
      intuitSyncSettings.value.isEstimateSyncAllowed
    ) {
        return true
    } else {
        return false
    }

}
