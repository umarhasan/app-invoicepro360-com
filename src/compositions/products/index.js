
import { ref, reactive, toRefs } from "vue"
import debounce from "lodash/debounce"
import config from "@/config"
import { useApi } from "@/compositions/api"
import { useUtils } from "@/compositions/utils"
import { validatePermissions, getPermissionList } from "@/compositions/permissions"
import { useVuelidate } from "@vuelidate/core"
import VALIDATE from "@/compositions/validate"
import { helper as $h } from "@/utils/helper"

import { useProduct } from "@/compositions/intuit/integrations";

const holdRow = ref()
const url = config.PRODUCT_URL

const state = reactive({
  product_id: null,
  showLoadingIcon: false,
  validationErrors: null,
  products: [],
  currentPage: 1,
  limit: 10,
  totalPages: 1,
  product: {
    name: null,
    description: null,
    price: null,
    income_account_id: '',
    type: 'product',
    is_taxable: false,
  },
  isNotify: false,
  isSaved : false,
  alertMessage: null,
  error: false,
  permissions: [],
  isDeleteModal: false,
  filter: '',
  sortColumn: null,
  sortDirection: 'asc',
  selectedType: ''
})

export const fetchProduct = () => {

  const { get, data, errorMessage, status } = useApi(config.PRODUCT_URL)
  const getProducts = (searchValue = '', page = 1, limit = 10, type = '') => {
    state.showLoadingIcon = true;
    const params = {
      search: searchValue,
      page: page,
      limit: limit,
      fields: "name,description,type",
      type: type,
    }

  get(params).then(() => {
      if (status.value !== 404) {
        state.products = data.value.data ?? []
        state.totalPages = data.value.totalPages || 1
        state.currentPage = page
      }
      state.showLoadingIcon = false
    }).catch(() => {
      state.showLoadingIcon = false
    })
  }

  validatePermissions("product", "view")
  state.permissions = getPermissionList("product")

  getProducts('', state.currentPage, state.limit)

  const debouncedFetch = debounce((s, p, l, t) => {
    getProducts(s, p, l, t)
  },800)
  
  const onSearch = () => {
    debouncedFetch(state.filter.trim(), 1, state.limit, state.selectedType)
  }

  const onTypeChange = (val) => {
    state.selectedType = val
    debouncedFetch('', 1, state.limit, val)
  }

  const goToPage = (page) => {
    if (page < 1 || page > state.totalPages) return
    debouncedFetch(state.filter.trim(), page, state.limit, state.selectedType)
  }

  const sort = (column) => {
    if (state.sortColumn === column) {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      state.sortColumn = column
      state.sortDirection = 'asc'
    }
  }

  const showDeleteModal = (data) => {
    holdRow.value = data
    if(data.status === "inactive") {
      deleteProduct()
    }else{
      state.isDeleteModal = true
    }
  }

  return {
    ...toRefs(state),
    onSearch,
    onTypeChange,
    getProducts,
    goToPage,
    sort,
    showDeleteModal
  }
}

export const saveProduct = () => {

    //validate user permission
    validatePermissions('product', `${router.currentRoute.value.name == "edit-product" ? 'edit' : 'create'}`)

    const { chartAccounts, isIntuitAccessTokenValid, intuitSyncSettings } = useUtils()
    const { createProduct, updateProduct } = useProduct()

    state.permissions = getPermissionList('product')
    state.chartAccounts = chartAccounts.value

    state.showIncomeAcountDropdown = true

    if (
        !isIntuitAccessTokenValid.value ||
        !intuitSyncSettings.value.isConnected ||
        intuitSyncSettings.value.isPaused
    ) {
        state.showIncomeAcountDropdown = false
    }

    // reset product form
    resetForm()

    //validation object
    const vp$ = useVuelidate(VALIDATE.Product, state.product)

    //form submit handler
    const submit = async () => {

        vp$.value.$touch()
        if (vp$.value.$invalid) return

        state.showLoadingIcon = true

        const { data, post, update } = useApi(
            url + `${state.product_id ? state.product_id : "create"}`
        )

        const payload = {
            name: state.product.name,
            description: state.product.description,
            price: state.product.price,
            is_taxable: state.product.is_taxable,
            type: state.product.type,
            income_account_id: state.product.income_account_id
        }

        if (state.product_id == null) {
            await post(payload)
            state.alertMessage = "New product added successfully"
        } else {
            await update(payload)
            state.alertMessage = "Product saved successfully"
        }

        if (data.value.validation_errors) {
            state.error = true
            state.isSaved = true
            state.showLoadingIcon = false
            state.alertMessage = "Validation Failed"

            state.validationErrors = data.value.validation_errors
            return
        } else {
            state.isSaved = true

            if (state.product_id == null) createProduct(payload, data.value.data)
            if (state.product_id) updateProduct(payload, state.product_id)
        }

        state.showLoadingIcon = false

        router.push({ name: "product-services" })
    }

    const trimDescription = (event) => {
        if (state.product.description.length > 60) {
            event.preventDefault()
            state.product.description = state.product.description.substring(0, 60)
        }
    }

    return {
        ...toRefs(state),
        submit,
        trimDescription,
        vp$,
    }
}

export const readProduct = product_id => {
    const { data, get, error, status } = useApi(url + product_id)

    get().then(() => {
        if (status.value === 404 || status.value === 400) {
            state.error = true
            state.isNotify = true
            state.alertMessage = error.value.message
            router.push({ name: "product-services" })
        } else {
            let product = data.value.data
            state.product_id = product.id
            state.product.name = product.name
            state.product.price = product.price
            state.product.description = product.description.substring(0, 60)
            state.product.is_taxable = product.is_taxable
            state.product.type = product.type
            state.product.income_account_id = product.income_account_id
        }
    })
}

export const deleteProduct = () => {
    const { post, status }  = useApi(url + "update-status")
    const { deleteProduct } = useProduct()
    const { initTabulator } = fetchProduct()

    // validatePermissions('product', 'delete')

    post({ id: holdRow.value.id })
        .then(() => {
            if (status.value === 404 || status.value === 400) {
                state.error = true
                state.isNotify = true                
                state.isDeleteModal = false
                state.alertMessage = 'Unable to inactive product'
            } else {
                deleteProduct(holdRow.value.id)
                state.isNotify = true
                state.isDeleteModal = false
                state.alertMessage = "Product has been inactive."
                initTabulator()
            }
        })
}

export const exportCSV = () => {
    const { get, status, data } = useApi(url + "export-csv")

    validatePermissions('product', 'export')

    get()
        .then(() => {

            if (status.value === 404 || status.value === 400) {
                state.error = true
                state.isNotify = true
                state.alertMessage = 'Unable to export product csv'
            } else {
                let base64String = `data:application/csv;base64, ${data.value.data.base64Csv}`;

                const downloadLink = document.createElement("a");

                downloadLink.href = base64String;
                downloadLink.download = data.value.data.name;
                downloadLink.click();

                state.isNotify = true
                state.alertMessage = "Product csv exported successfully."
                // state.showLoadingIcon = false
            }

        })
}

export const resetForm = () => {
    state.product_id = null
    state.product.name = null
    state.product.price = null
    state.product.description = null
    state.product.income_account_id = '';
    state.product.type = 'product'
    state.product.is_taxable = false
}

export const showNotification = () => {
    $h.notification(state.error, state.alertMessage, state.validationErrors)

    state.isNotify = false
    state.isSaved = false
    state.error = false
    state.alertMessage = null
    state.validationErrors = null
}