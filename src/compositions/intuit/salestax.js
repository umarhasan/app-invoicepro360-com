import { useUtils } from "@/compositions/utils"
import { useApi } from "@/compositions/api"
import config from "@/config"


export const createSalesTax = (payload,taxId) => {

    if(!validate()) return

    let reqObj = {
        lastInsertId : parseInt(taxId),
        payload : {
        "TaxCode": '',
        "TaxRateDetails": []    
        }
    }

    reqObj.payload.TaxCode = payload.taxName

    payload.taxRateList.forEach(item => {
        reqObj.payload.TaxRateDetails.push({
            "TaxRateName": item.name,
            "RateValue": item.rate,
            "TaxAgencyId": parseInt(item.agency_id),
        })       
    });

    // console.log(reqObj)

    // return

    const { data, post } = useApi(config.INTUIT_SALES_TAX_URL)   

    post(reqObj).then( () => {})

}

export const updateSalesTax = (payload,taxId) => {

    if(!validate()) return

    let reqObj = {
        lastInsertId : parseInt(taxId),
        payload : {
        "TaxCode": '',
        "TaxRateDetails": []    
        }
    }

    reqObj.payload.TaxCode = payload.taxName

    payload.taxRateList.forEach(item => {
        reqObj.payload.TaxRateDetails.push({
            "TaxRateName": item.name,
            "RateValue": item.rate,
            "TaxAgencyId": item.agency_id,
            "TaxAgencyName": item.agency_name,
            // "TaxApplicableOn": "Sales"
        })       
    });

    const { data, update } = useApi(config.INTUIT_CUSTOMER_URL)   
        
    update(reqObj).then( () => {})

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
      !intuitSyncSettings.value.isPaused
    //   !intuitSyncSettings.value.isCustomerSyncAllowed 
      ){
        return true
      }else{
        return false
      }
  
}