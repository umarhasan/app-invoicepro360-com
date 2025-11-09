import { ref, reactive, toRefs, createApp } from "vue"
import { useApi } from "@/compositions/api"
import { useVuelidate } from "@vuelidate/core"
import config from "@/config"
import { useUtils } from "@/compositions/utils"
import { useSalesTax } from "@/compositions/intuit/integrations"
import { validatePermissions, getPermissionList } from "@/compositions/permissions"
import { helper as $h } from "@/utils/helper"
import cash from "cash-dom"
import Success from "@/views/invoices/payment/success.vue"
import { salesTaxRules, taxItemRules } from "@/compositions/validate"

const holdRow = ref()
const url = config.SALES_TAX_URL

const state = reactive({
  showLoadingIcon: false,
  agencyLoadingIcon: false,
  validationErrors: null,
  salesTax: {
    id: "",
    taxName: "",
    taxAbbreviation: "",
    taxDescription: "",
    taxNumber: "",
    taxRate: 0.0,
  },
  taxItems: [],
  taxAgencies: [],
  isItemLoaded: [],
  status: null,
  records: [],
  isNotify: false,
  error: false,
  isSaved: false,
  isDeleted: false,
  alertMessage: null,
  permissions: [],
  currentPage: 1,
  limit: 10,
  totalPages: 1,
  current_uid: null,
  showTaxAgencyField: true,
  // Sorting Logic
  sortColumn: null,
  isLoaded: false  // This flag will control the loading indicator in Main.vue
})

// For unauthorized access redirection.
const notAllowedObj = {
  name: "dashboard",
  params: {
    showPermissionAlert: true,
    alertMessage: "You don't have permission to view sales tax list.",
  },
}

export const fetchSalesTax = () => {
  // Reset pagination and set loading state.
  state.currentPage = 1
  state.limit = 10
  state.totalPages = 1
  state.isLoaded = false

  // Setup sorting variables.
  const sortColumn = ref(null)
  const sortDirection = ref("asc")

  // Check view permission.
  validatePermissions("salestax", "view")
  state.permissions = getPermissionList("salestax")

  const { get, data, errorMessage, status } = useApi(url)
  get().then(() => {
    state.status = status.value
    if (status.value === 404) {
      state.error = true
      state.isNotify = true
      state.alertMessage = errorMessage.value
      state.records = []
    } else {
      // Sort records in descending order (newest first).
      state.records = (data.value.data || []).sort((a, b) => b.id - a.id)
      state.totalPages = Math.ceil(state.records.length / state.limit)
    }
    state.isLoaded = true
  })

  // Pagination handler.
  const goToPage = (page) => {
    if (page < 1 || page > state.totalPages) return
    state.currentPage = page
  }

  // Sorting handler.
  const sort = (column) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc"
    } else {
      sortColumn.value = column
      sortDirection.value = "asc"
    }
  }

  return {
    ...toRefs(state),
    sortColumn,
    sortDirection,
    goToPage,
    sort,
  }
}

export const saveTax = () => {
  validatePermissions(
    "salestax",
    router.currentRoute.value.name === "sales-tax-edit" ? "edit" : "create"
  )
  state.showTaxAgencyField = true
  state.permissions = getPermissionList("salestax")

  const { isIntuitAccessTokenValid, intuitSyncSettings } = useUtils()
  const { createSalesTax, updateSalesTax } = useSalesTax()

  if (
    !isIntuitAccessTokenValid.value ||
    !intuitSyncSettings.value.isConnected ||
    intuitSyncSettings.value.isPaused
  ) {
    state.showTaxAgencyField = false
  }

  const validateSalesTax = useVuelidate(
    salesTaxRules(state.records, state.salesTax.id),
    state.salesTax
  )
  const validateTaxItems = useVuelidate(
    taxItemRules(),
    state.taxItems
  )

  const submit = async () => {
    const isEdit = Boolean(state.salesTax.id)
    const errors = []
    validateSalesTax.value.$touch()
    validateTaxItems.value.$touch()

    if (state.taxItems.length === 0) {
      errors.push("At least one Item is required.")
    }

    const duplicateTaxName = state.records.some(record => 
      record.taxName.trim().toLowerCase() === state.salesTax.taxName.trim().toLowerCase() && record.id !== state.salesTax.id
    )

    if (duplicateTaxName) {
      errors.push("Tax Name already exists.")
    }

    if (errors.length > 0) {
      state.validationErrors = errors
      $h.notification(true, errors.join(" "), null)
      return
    }
    if (validateTaxItems.value.$invalid) return

    if (isEdit) {
      if (
        validateSalesTax.value.taxName.required.$invalid ||
        validateSalesTax.value.taxAbbreviation.required.$invalid
      ) return
    } else {
      if (validateSalesTax.value.taxName.$invalid) return
    }
    
    state.showLoadingIcon = true
    let cumulativeRate = 0
    state.taxItems.forEach(item => {
      cumulativeRate += Number(parseFloat(item.rate).toFixed(2))
    })
    state.salesTax.taxRate = cumulativeRate

    const endpoint = url + `${isEdit ? state.salesTax.id : "create"}`
    const { data, post, update, status } = useApi(endpoint)
    const payload = {
      taxName: state.salesTax.taxName,
      taxAbbreviation: state.salesTax.taxAbbreviation,
      taxDescription: state.salesTax.taxDescription,
      taxNumber: state.salesTax.taxNumber,
      taxRate: state.salesTax.taxRate,
      taxRateList: state.taxItems.map(i => ({ ...i, rate: Number(parseFloat(i.rate).toFixed(2)) }))
    }

    if (isEdit) await update(payload)
    else await post(payload)

    if (data.value.validation_errors) {
      state.showLoadingIcon = false
      state.error = true
      state.isNotify = true
      state.alertMessage = "Validation failed"
      state.validationErrors = data.value.validation_errors
      return
    }

    isEdit
      ? updateSalesTax(payload, state.salesTax.id)
      : createSalesTax(payload, data.value.data)

    if (status.value === 400 || status.value === 404) {
      state.alertMessage = 'error val'
      state.error = true
    } else {
      state.alertMessage = isEdit
        ? "Sales tax updated successfully."
        : "Sales tax created successfully."
      state.error = false
      state.validationErrors = null
    }

    state.isNotify = true
    state.showLoadingIcon = false
    router.push({ name: "sales-tax" })
  }

  return {
    validate: validateSalesTax,
    validateTaxItems,
    ...toRefs(state),
    submit,
  }
}


export const readTax = async (id) => {
  const { data, get, error, status } = useApi(url + id)
  state.isSaved = false
  state.isDeleted = false

  get().then(() => {
    if (status.value === 404 || status.value === 400) {
      state.error = true
      state.isNotify = true
      state.alertMessage = error.value.message
      router.push({ name: "sales-tax" })
    } else {
      state.salesTax.id = data.value.data.id
      state.salesTax.taxName = data.value.data.taxName
      state.salesTax.taxAbbreviation = data.value.data.taxAbbreviation
      state.salesTax.taxDescription = data.value.data.taxDescription
      state.salesTax.taxNumber = data.value.data.taxNumber
      state.salesTax.taxRate = parseFloat(data.value.data.taxRate)
      state.taxItems = []
      const { setItems } = useTaxItems()
      setItems(data.value.data.taxRateList)
    }
  })
}

export const confirmDelete = (id) => {
  if (!id) {
    console.error("Invalid Sales Tax ID provided:", id)
    state.isNotify = true
    state.error = true
    state.alertMessage = "Invalid Sales Tax record ID."
    return
  }
  state.salesTax.id = id
  let index = state.records.findIndex(item => item.id == id)
  const { post, error, status } = useApi(url + "delete")
  post({ id: id }).then(() => {
    if (status.value === 400) {
      state.isNotify = true
      state.error = true
      console.error("Delete error:", error.value)
      state.alertMessage = error.value || "Failed to delete sales tax."
    } else {
      if (index > -1) {
        state.records.splice(index, 1)
      }
      state.isNotify = true
      state.alertMessage = "Sales tax deleted successfully."
    }
  })
}

export const useTaxItems = () => {
  let uid = 0
  const addItem = () => {
    uid++
    state.taxItems.push({
      uid: uid,
      agency_id: "",
      agency_name: "",
      name: "",
      rate: 0.0,
      showItemsDropdown: false,
    })
  }
  const addNewAgency = (name, key) => {
    state.agencyLoadingIcon = true
    const { post, data, errorMessage, status } = useApi(config.CREATE_TAX_AGENCY_URL)
    post({ DisplayName: name }).then(() => {
      if (status.value === 404) {
        state.agencyLoadingIcon = false
        state.error = true
        state.isNotify = true
        state.alertMessage = errorMessage
      } else {
        state.agencyLoadingIcon = false
        state.taxAgencies.push({
          id: data.value.data.id,
          name: data.value.data.name,
        })
        let index = state.taxItems.findIndex(item => item.uid == key)
        state.taxItems[index].agency_id = data.value.data.id
        state.taxItems[index].agency_name = name
        state.taxItems[index].showItemsDropdown = false
      }
    })
  }
  const fetchtaxAgencies = () => {
    const { get, data, errorMessage, status } = useApi(config.TAX_AGENCY_URL)
    get().then(() => {
      if (status.value === 404) {
        state.isItemLoaded = true
        state.taxAgencies = []
      } else {
        state.isItemLoaded = true
        state.taxAgencies = data.value.data ?? []
      }
    })
  }
  const hideItemDropdown = () => {
    let index = state.taxItems.findIndex(item => item.uid == state.current_uid)
    state.taxItems[index].showItemsDropdown = false
    state.current_uid = null
  }
  const showItemsDropdown = (key) => {
    state.current_uid = key
    let index = state.taxItems.findIndex(item => item.uid == key)
    state.taxItems[index].showItemsDropdown = true
  }
  const selectItem = (agency, key) => {
    let index = state.taxItems.findIndex(item => item.uid == key)
    state.taxItems[index].agency_id = agency.id
    state.taxItems[index].agency_name = agency.name
    state.taxItems[index].showItemsDropdown = false
  }
  const setItems = (items) => {
    let rate = 0
    items.forEach(item => {
      uid++
      state.taxItems.push({
        uid: uid,
        name: item.name,
        rate: parseFloat(item.rate),
        agency_id: item.agency_id,
        agency_name: item.agency_name,
        showItemsDropdown: false,
      })
      rate += parseFloat(item.rate)
    })
    state.salesTax.taxRate = rate
  }
  const updateItemTotal = () => {
    let rate = 0
    state.taxItems.forEach(item => {
      rate += parseFloat(item.rate)
    })
    state.salesTax.taxRate = rate
  }
  const deleteItem = (key) => {
    let index = state.taxItems.findIndex(item => item.uid == key)
    state.taxItems.splice(index,1)
    updateItemTotal()
  }
  
  return {
    ...toRefs(state),
    fetchtaxAgencies,
    addItem,
    addNewAgency,
    setItems,
    selectItem,
    hideItemDropdown,
    showItemsDropdown,
    deleteItem,
    updateItemTotal,
  }
}

export const showNotification = () => {
  $h.notification(state.error, state.alertMessage, state.validationErrors)
  state.isNotify = false
  state.error = false
  state.validationErrors = null
}
