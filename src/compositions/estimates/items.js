import { reactive, toRefs } from "vue"
import { useApi } from "@/compositions/api"
import { useUtils } from "@/compositions/utils"
import config from "@/config"

let uid = 0;

const state = reactive({
    estimateItems : [],
    isItemLoaded : false,
    isEstimateItemupdate : false,    
    items : [],
    salesTax : [],
    selectedTaxId :[],
    showItemsDropdown  : false,    
    permissions : []
})

export const resetEstimateItems = () => {

    state.estimateItems = []
    state.items = []
    state.salesTax = []
    state.selectedTaxId = []

    state.showItemsDropdown  = false
    state.isItemLoaded = false    

}

export const useEstimateItems = () => {

    const { permissionList } = useUtils()

    state.permissions = permissionList.value['estimate']

    const addItem = () => {
        state.showItemsDropdown = true
    }

    const addNewItem = (name) => {
        uid  = uid + 1 

        state.estimateItems.push({            
            uid : uid,
            intuit_id : null,
            name : name,
            description : null,
            quantity : 1,
            price : 0.00,
            total : 0.00,
            isTaxable : 0,
            isNew : true,
            isDeleted : false

        })
        state.showItemsDropdown = false
        state.isEstimateItemupdate = true
    }

    const deleteItem = (key) => {
        let index = state.estimateItems.findIndex(item => item.uid == key)
        state.estimateItems.splice(index,1)
        state.isEstimateItemupdate = true
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
        state.isEstimateItemupdate = true
    }

    const selectItem = (item) => {      
        uid  = uid + 1  

        state.estimateItems.push({            
            uid   : uid, 
            intuit_id : item.intuit_id,            
            name : item.name,
            description : item.description,
            quantity : 1,
            price : item.price,
            total : 1 * item.price,
            isTaxable : item.isTaxable,
            isNew : false,
            isDeleted : item.isDeleted,
        })
        state.showItemsDropdown = false
        state.isEstimateItemupdate = true
    }    

    const setItems = (items) => {
        uid = 1;

        items.forEach(item => {

            state.estimateItems.push({            
                uid   : uid, 
                isNew : false,
                // intuit_id : intuit_id,
                name : item.name,
                description : item.description,
                quantity : item.quantity,
                isTaxable : item.isTaxable,
                price : item.price,
                total : item.total,
            })    

            uid++;
        });
        state.isEstimateItemupdate = true
    }

    const updateItemTotal = (item) => {
        item.total = item.quantity * item.price
        state.isEstimateItemupdate = true
    }

    const addTax = (tax) => {
        state.salesTax = []
        state.selectedTaxId = []

        state.salesTax.push(tax) 
        state.selectedTaxId.push(tax.id)
        state.isEstimateItemupdate = true
    }

    const deleteTax = (tax) => {
    
        let taxIndex = state.salesTax.findIndex(t => t.id == tax.id)
        let index = state.selectedTaxId.indexOf(tax.id)

        if(taxIndex > -1){
            state.salesTax.splice(taxIndex,1)
        }

        if (index > -1) {
            state.selectedTaxId.splice(index, 1)
        }    
    }

    const updateTax = (tax,oldTaxId) => {

        let taxIndex = state.salesTax.findIndex(t => t.id == oldTaxId)
        let index = state.selectedTaxId.indexOf(oldTaxId)

        if(taxIndex > -1){
            //update tax
            state.salesTax[taxIndex] = tax
        }

        if (index > -1) {
            state.selectedTaxId[index] = tax.id
        }
    }

    const setTaxes = (taxes) => {
        //multiple taxes
        // taxes.forEach(tax => {
        //     state.salesTax.push(tax)        
        //     state.selectedTaxId.push(tax.id)
        // })

        //apply single tax
        state.salesTax = []
        state.selectedTaxId = []

        // console.log(taxes)

        if (taxes) {
            state.salesTax.push(taxes)
            state.selectedTaxId.push(taxes.id)            
        }
    }
    
    return {
        ...toRefs(state),
        addItem,
        addNewItem,
        selectItem,
        deleteItem,
        fetchItems,
        setItems,
        hideItemDropdown,
        addTax,
        deleteTax,
        updateTax,
        setTaxes,
        updateItemTotal,
    }
}