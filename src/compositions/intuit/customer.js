import { useUtils } from "@/compositions/utils"
import { useApi } from "@/compositions/api"
import config from "@/config"


export const createCustomer = (payload,customerId) => {

    
    if(!validate()) return
    

    let name  = `${payload.contact.firstName} ${payload.contact.lastName}`
    let address = `${payload.billing.addressLine1} ${payload.billing.addressLine2}`

    let reqObj = {
        payload : null,
        lastInsertId : parseInt(customerId)
    }

     reqObj.payload = {
        "GivenName": payload.contact.firstName,
        "CompanyName": payload.contact.customer, 
        "FullyQualifiedName": name,          
        "DisplayName": name, 
        "MiddleName": payload.contact.lastName, 
        "FamilyName": payload.contact.lastName, 
        "PrimaryEmailAddr": {
            "Address": payload.contact.email
        },        
        "PrimaryPhone": {
            "FreeFormNumber": payload.contact.phoneNumber
        }, 
        "BillAddr": {
            "CountrySubDivisionCode": payload.billing.state, 
            "City": payload.billing.city, 
            "PostalCode": payload.billing.zipCode, 
            "Line1": address, 
            "Country": payload.billing.country
        },
        "Notes": ""
    }

    const { data, post } = useApi(config.INTUIT_CUSTOMER_URL)   

    post(reqObj).then( () => {})

}

export const updateCustomer = (payload,customerId) => {

    if(!validate()) return


    let name  = `${payload.contact.firstName} ${payload.contact.lastName}`
    let address = `${payload.billing.addressLine1} ${payload.billing.addressLine2}`
    
    let reqObj = {
        payload : null,
        lastInsertId : parseInt(customerId)
    }

    reqObj.payload = {
        "GivenName": payload.contact.firstName,
        "CompanyName": payload.contact.customer, 
        "FullyQualifiedName": name,          
        "DisplayName": name, 
        "MiddleName": payload.contact.lastName, 
        "FamilyName": payload.contact.lastName, 
        "PrimaryEmailAddr": {
            "Address": payload.contact.email
        },        
        "PrimaryPhone": {
            "FreeFormNumber": payload.contact.phoneNumber
        }, 
        "BillAddr": {
            "CountrySubDivisionCode": payload.billing.state, 
            "City": payload.billing.city, 
            "PostalCode": payload.billing.zipCode, 
            "Line1": address, 
            "Country": payload.billing.country
        },
        "Notes": ""
    }

    const { data, update } = useApi(config.INTUIT_CUSTOMER_URL)   
        
    update(reqObj).then( () => {})

}


export const deleteCustomer = (customer_id) => {
    if(!validate()) return

    const { data, del } = useApi(config.INTUIT_CUSTOMER_URL)   

    del({
        customer_id : parseInt(customer_id)
    }).then( () => {})
}


// validate before CRUD
const validate = () => {

    const {
      isIntuitAccessTokenValid,
      intuitSyncSettings
    } = useUtils()

    // console.log("isIntuitAccessTokenValid.value",isIntuitAccessTokenValid.value)
    // console.log("intuitSyncSettings.value.isConnected",intuitSyncSettings.value.isConnected)
    // console.log("intuitSyncSettings.value.isPaused",intuitSyncSettings.value.isPaused)
    // console.log("intuitSyncSettings.value.isCustomerSyncAllowed",intuitSyncSettings.value.isCustomerSyncAllowed)
  
    if(
      isIntuitAccessTokenValid.value && 
      intuitSyncSettings.value.isConnected && 
      !intuitSyncSettings.value.isPaused &&
      intuitSyncSettings.value.isCustomerSyncAllowed 
      ){
        return true
      }else {
        return false
      }
  
}