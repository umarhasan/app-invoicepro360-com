import { reactive, toRefs } from "vue"
import { useApi } from "@/compositions/api"
import { useUtils } from "@/compositions/utils"
import config from "@/config"

let uid = 0;

const state = reactive({
    invoiceItems : [],
    isItemLoaded : false,
    isInvoiceItemupdate : false,
    items : [],
    salesTax : [],
    selectedTaxId :[],
    showItemsDropdown  : false,    
    permissions : []
})

export const useInvoiceItems = () => {

    const { permissionList } = useUtils()
    state.permissions = permissionList.value['invoice']

    const fetchItems = () => {
        const {get, data, status} = useApi(`${config.PRODUCT_URL}?order_by=name&order=asc`)
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

    const addItem = () => {
        state.showItemsDropdown = true
    }

    const addNewItem = (name) => {
        uid  = uid + 1 
        state.invoiceItems.push({ 
            id          : '',           
            uid         : '',
            intuit_id   : null,
            name        : name,
            description : null,
            quantity    : 1,
            price       : 0.00,
            total       : 0.00,
            isTaxable   : false,
            isNew       : true,
            isDeleted   : false,
        })
        
        state.showItemsDropdown = false
        state.isInvoiceItemupdate = true
    }

    const selectItem = (item) => {
        uid  = uid + 1  
        state.invoiceItems.push({
            id          : '', 
            uid         : item.id, 
            intuit_id   : item.intuit_id,            
            name        : item.name,
            description : item.description,
            quantity    : 1,
            price       : parseFloat(item.price).toFixed(2),
            total       : 1 * item.price,
            isTaxable  : item.is_taxable,
            isNew       : false,
            isDeleted   : false,
        })
        state.showItemsDropdown = false
        state.isInvoiceItemupdate = true
    }

    const setItems = (items) => {
        console.log(items)
        uid = 1;
        items.forEach(item => {
            state.invoiceItems.push({
                id          : item.uid,
                uid         : item.itemId,
                intuit_id   : item.intuit_id,
                name        : item.name,
                description : item.description,
                quantity    : item.quantity,
                isTaxable  : item.isTaxable,
                price       : parseFloat(item.price).toFixed(2),
                total       : item.total,
                isNew       : false,
                isDeleted   : item.isDeleted,
            })
            uid++;
        });
        state.isInvoiceItemupdate = true
    }

    const deleteItem = (uid) => {
        let index = state.invoiceItems.findIndex(item => item.uid == uid)
        let item  = state.invoiceItems[index]
        
        if(item.isNew){
            state.invoiceItems.splice(index,1)
        }else{
            item.isDeleted = true
            state.invoiceItems[index] = item
        }

        state.isInvoiceItemupdate = true
    }

    const hideItemDropdown = () => { 
        state.showItemsDropdown = false
    }

    const updateItemTotal = (item) => {
        item.quantity = parseInt(item.quantity)
        // item.price = parseFloat(item.price).toFixed(2)
        // console.log(item.price)

        item.total = item.quantity * item.price
        state.isInvoiceItemupdate = true
    }

    const addTax = (tax) => {
        state.salesTax = []
        state.selectedTaxId = []
        state.salesTax.push(tax) 
        state.selectedTaxId.push(tax.id)
    }

    const updateTax = (tax,oldTaxId) => {
        let taxIndex = state.salesTax.findIndex(t => t.id == oldTaxId)
        let index = state.selectedTaxId.indexOf(oldTaxId)
        if(taxIndex > -1) state.salesTax[taxIndex] = tax
        if (index > -1) state.selectedTaxId[index] = tax.id        
    }

    const deleteTax = (tax) => {
        state.salesTax = []
    }

    const setTaxes = (taxes) => {
        state.salesTax = []
        state.selectedTaxId = []
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

export const resetInvoiceItems = () => {
    state.isItemLoaded  = false    
    state.showItemsDropdown = false
    state.items = []
    state.salesTax = []
    state.invoiceItems = []
    state.selectedTaxId = []   
}