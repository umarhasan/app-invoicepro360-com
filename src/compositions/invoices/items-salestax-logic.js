import { reactive, toRefs } from "vue"
import { useApi } from "../api"
import config from "../../config"

let uid = 0;

const state = reactive({
    invoiceItems : [],
    isItemLoaded : false,    
    items : [],
    showItemsDropdown  : false,
    
})

export const useInvoiceItems = () => {

    const addItem = () => {
        state.showItemsDropdown = true
    }

    const addNewItem = (name) => {
        uid  = uid + 1 

        state.invoiceItems.push({            
            uid : uid,
            isNew : true,
            name : name,
            description : null,
            quantity : 1,
            price : 0.00,
            total : 0.00,
            salesTax : [],
            selectedTaxId :[],
        })
        state.showItemsDropdown = false
    }

    const deleteItem = (key) => {
        let index = state.invoiceItems.findIndex(item => item.uid == key)
        state.invoiceItems.splice(index,1)
    }

    const fetchItems = () => {

        const {get, data, errorMessage, status} = useApi(config.PRODUCT_URL)
    
        get().then( () => {
            
            if(status.value === 404){
                state.isItemLoaded = true
                state.items = []
            }else{
                state.isItemLoaded = true
                state.items = data.value.data
            }
        })
    }

    const hideItemDropdown = () => {            
        state.showItemsDropdown = false
    }

    const selectItem = (item) => {      
        uid  = uid + 1  

        state.invoiceItems.push({            
            uid   : uid, 
            isNew : false,
            name : item.name,
            description : item.description,
            quantity : 1,
            price : item.price,
            total : 1 * item.price,
            salesTax : [],
            selectedTaxId :[],
        })
        state.showItemsDropdown = false
    }    

    const updateItemTotal = (item) => {
        item.total = item.quantity * item.price

        calcTax(item)
    }

    const addTax = (key,tax) => {

        let index = state.invoiceItems.findIndex(item => item.uid == key)
        let total = state.invoiceItems[index].total

        tax.taxAmount = (total/100) * (tax.taxRate)

        state.invoiceItems[index].salesTax.push(tax)
        
        state.invoiceItems[index].selectedTaxId.push(tax.id)

    }

    const calcTax = (item) => {
        let total = item.total

        item.salesTax.forEach( (tax, index) => {

            tax.taxAmount = (total/100) * (tax.taxRate)
        })
    }

    const deleteTax = (key,tax) => {

        let itemIndex = state.invoiceItems.findIndex(item => item.uid == key)

        if(itemIndex > -1){
            let taxes = state.invoiceItems[itemIndex].salesTax
            let selectedTaxId = state.invoiceItems[itemIndex].selectedTaxId
    
            let taxIndex = taxes.findIndex(t => t.id == tax.id)

            if(taxIndex > -1){
                taxes.splice(taxIndex,1)
                state.invoiceItems[itemIndex].salesTax = taxes
            }

            let index = selectedTaxId.indexOf(tax.id)

            if (index > -1) {
                selectedTaxId.splice(index, 1)
                state.invoiceItems[itemIndex].selectedTaxId = selectedTaxId
            }

        }

    }

    const updateTax = (key,tax,oldTaxId) => {

        let itemIndex = state.invoiceItems.findIndex(item => item.uid == key)

        if(itemIndex > -1){
            let total = state.invoiceItems[itemIndex].total
            let taxes = state.invoiceItems[itemIndex].salesTax
            let selectedTaxId = state.invoiceItems[itemIndex].selectedTaxId

            let taxIndex = taxes.findIndex(t => t.id == oldTaxId)

            if(taxIndex > -1){
                //update tax
                tax.taxAmount = (total/100) * (tax.taxRate)

                taxes[taxIndex] = tax
                state.invoiceItems[itemIndex].salesTax = taxes
            }

            //update id from selectedtaxId array
            let index = selectedTaxId.indexOf(oldTaxId)
            if (index > -1) {
                selectedTaxId[index] = tax.id
                state.invoiceItems[itemIndex].selectedTaxId = selectedTaxId
            }

        }

    }

    
    return {
        ...toRefs(state),
        addItem,
        addNewItem,
        selectItem,
        deleteItem,
        fetchItems,
        hideItemDropdown,
        addTax,
        deleteTax,
        updateTax,
        updateItemTotal,
        calcTax,
    }
}