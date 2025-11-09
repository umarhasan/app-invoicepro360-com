import { useUtils } from "@/compositions/utils"
import { useApi } from "@/compositions/api"
import config from "@/config"

export const getProducts = (params) => {
  if(!validate()) return
    
}

export const createProduct = (payload,productId) => {

  if(!validate()) return

  let reqObj = {
    payload : null,
    lastInsertId : parseInt(productId)
  }

  reqObj.payload =  {
    "Name": payload.name,
      "IncomeAccountRef" : {
          "value" : parseInt(payload.income_account_id),
      },
    "Type": "NonInventory",
    "Description" : payload.description,
    "UnitPrice": parseFloat(payload.price)
  }

  const { data, post } = useApi(config.INTUIT_PRODUCT_URL)   

  post(reqObj).then( () => {})
        
}

export const updateProduct = (payload,productId) => {

  if(!validate()) return

  let reqObj = {
    payload : null,
    lastInsertId : parseInt(productId)
  }

  reqObj.payload =  {
    "Name": payload.name,
      "IncomeAccountRef" : {
          "value" : parseInt(payload.income_account_id),
      },
    "Type": "NonInventory",
    "Description" : payload.description,
    "UnitPrice": parseFloat(payload.price)
  }

  const { data, update } = useApi(config.INTUIT_PRODUCT_URL)   
      
  update(reqObj).then( () => {})
        
}

export const deleteProduct = (product_id) => {

  if(!validate()) return

  const { data, del } = useApi(config.INTUIT_PRODUCT_URL)   

  del({
    product_id : parseInt(product_id)
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
    intuitSyncSettings.value.isItemSyncAllowed 
    ){
      return true
    }else{
      return false
    }

}