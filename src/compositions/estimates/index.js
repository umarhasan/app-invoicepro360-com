import { reactive, ref, toRefs } from "vue";
import { useApi } from "@/compositions/api";
import { useUtils } from "@/compositions/utils";
import { helper as $h } from "@/utils/helper";
import { appText as $T } from "@/utils/AppText";
import config from "@/config";
import VALIDATE from "@/compositions/validate";
import { validatePermissions } from "@/compositions/permissions";
import { useVuelidate } from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { useEstimateItems, resetEstimateItems } from "./items";
import { useCustomer, resetCustomer } from "./customer";
import { useClover } from "@/compositions/clover";
import cash from "cash-dom";
import { useEstimate } from "@/compositions/intuit/integrations";
import { usePayment } from "@/compositions/payment"

const ESTIMATE_STATUS_DRAFT = 'draft';
const ESTIMATE_STATUS_PUBLISH = 'publish';

const state = reactive({
  title: 'New Estimate',
  estimate: {
    id: null,
    customerId: null,
    businessId: '',
    companyLogo: '',
    estimateTitle: '',
    estimateSummary: '',
    estimateNumber: '',
    referenceNumber: '',
    estimateDate: '',
    validityDate: '',
    notes: '',
    footerNotes: '',
    currency: '',
    exchangeRate: '',
    subTotal: '',
    taxTotal: '',
    grandTotal: '',
    dueAmount: 0.0,
    shareUrl: '',
    status: '',
    publishedDate: '',
    lastSendDate: '',
  },
  estimateItems: [],
  salesTax: [],
  taxes: [],
  totalTaxAmount: 0.0,
  taxableTotal: 0.0,
  subTotal: 0.0,
  grandTotal: 0.0,
  status: null,
  records: null,
  meta: {
    current: 1,
    size: 10,
    total_pages: 0,
    total_results: 0,
  },
  filter: {
    customer: '',
    status: '',
    fromDate: '-',
    toDate: '-',
    estimateNumber: '',
  },
  isPublished: false,
  isDrafted: false,
  isDisabled: false,
  isNotify: false,
  isLoaded: false,
  showLoadingIcon: false,
  error: false,
  alertMessage: '',
  validationErrors: [],
  isDeleteModal: false,
  permissions: [],
  isOpenSendEstimateModal : false,
});

let estimateNumber = 0;

export const fetchEstimates = (currentPage = 1, itemPerPage = 10) => {
  validatePermissions('estimate', 'view');

  let url = `${config.ESTIMATE_URL}?page=${currentPage}&size=${itemPerPage}`;
  if (state.filter.customer) url += `&customer=${state.filter.customer}`;
  if (state.filter.status) url += `&status=${state.filter.status}`;
  if (state.filter.estimateNumber) url += `&estimate_number=${state.filter.estimateNumber}`;
  if (state.filter.toDate && state.filter.toDate !== '-') url += `&to_date=${$h.formatDate(state.filter.toDate)}`;
  if (state.filter.fromDate && state.filter.fromDate !== '-') url += `&from_date=${$h.formatDate(state.filter.fromDate)}`;

  const { data, get, error, status } = useApi(url);

  get().then(() => {
    state.status = status.value;
    if (status.value === 404) {
      state.error = true;
      state.isNotify = true;
      state.alertMessage = error.value;
    } else {
      state.records = data.value.data;
      state.meta = data.value.meta;
    }
  });
  return { ...toRefs(state) };
};

export const updateTotal = () => {
  state.subTotal = state.estimateItems.reduce((acc, item) => (!item.isDeleted ? item.total + acc : acc), 0);
  state.taxableTotal = state.estimateItems.reduce((acc, item) => {
    if (item.isTaxable == 1 && !item.isDeleted) acc = item.total + acc;
    return acc;
  }, 0);
  updateTax();
  state.grandTotal = state.subTotal + state.totalTaxAmount;
};

const updateTax = () => {
  const taxableAmount = state.taxableTotal;
  state.totalTaxAmount = 0;
  state.salesTax.forEach(tax => {
    tax.taxAmount = (taxableAmount / 100) * tax.taxRate;
    state.totalTaxAmount += tax.taxAmount;
  });
};

const fetchSalesTax = () => {
  state.isSalesTaxLoaded = false;
  const { data, get, status } = useApi(config.SALES_TAX_URL);
  get().then(() => {
    if (status.value !== 404) {
      state.taxes = data.value.data || [];
    }
    state.isSalesTaxLoaded = true;
  });
};

const setEstimateNumber = () => {
  const { data, get } = useApi(`${config.ESTIMATE_URL}estimate-number`);
  get().then(() => {
    if (data.value?.data) {
      state.estimate.estimateNumber = data.value.data.estimateNumber;
    }
  });
};

export const showDeleteModal = (row, value = true) => {
  state.estimate.id = row.id;
  state.isDeleteModal = value;
};

export const confirmDelete = () => {
  let index = state.records.findIndex(item => item.id == state.estimate.id);
  const { get, error, status } = useApi(`${config.ESTIMATE_URL}delete/${state.estimate.id}`);
  get().then(() => {
    if (status.value !== '404') {
      state.records.splice(index, 1);
      cash(".yr-success").removeClass("hide").addClass("show");
      state.isDeleteModal = false;
    }
  }).catch(() => {
    cash(".yr-danger").removeClass("hide").addClass("show");
  });
};


export const saveEstimate = () => {
    validatePermissions('estimate',`${state.estimate.id ? 'edit': 'create'}`)    

    fetchSalesTax()
        
    const { settings} = useUtils()
    const { customerId, billedCustomer } = useCustomer()
    const { estimateItems, salesTax } = useEstimateItems()
    const {createEstimate, updateEstimate } = useEstimate()
    const { displayWelcomeScreen} = useClover()

    state.isLoaded = true
    
    // Validate and check clover device active or not
    // CheckDeviceConnection()
    // Reset estimate form      
    displayWelcomeScreen()
    resetForm()
    resetCustomer()
    resetEstimateItems()
    updateTotal(false)

    if(!state.estimate.id) setEstimateNumber()

    // Set setting
    state.estimate.companyLogo     = settings.value.logo
    state.estimate.estimateTitle    = settings.value.estimate_title
    state.estimate.estimateSummary  = settings.value.estimate_subheading
    // Set billed customer
    state.estimate.customerId = customerId.value
    // Items
    state.estimateItems  = estimateItems.value
    // Sales tax
    state.salesTax  = salesTax.value
    
    // validation object
    const validate = useVuelidate(VALIDATE.Estimate, state.estimate, { $scope: false })

    const validateItems = useVuelidate({
            estimateItemsLength : helpers.withMessage("One Estimate item required",()=> (state.estimateItems.length > 0))
        }, estimateItems.value,{ $scope: false })
    
    const submit = async (_type) => {

        state.estimate.customerId = customerId.value
        state.estimate.subTotal   = state.subTotal
        state.estimate.taxTotal   = state.totalTaxAmount
        state.estimate.grandTotal = state.grandTotal
        state.estimateItems       = estimateItems.value
        //validate
        validate.value.$touch()
        validateItems.value.$touch()

        if (validate.value.$invalid) return
        if (validateItems.value.$invalid) return

        state.isDisabled = true
        state.isLoaded = false

        console.log("Estimate Date: ", state.estimate.estimateDate)
        
        //estimate create / update payload
        const payload = {
            "estimate" : {
                "id"              : state.estimate.id,
                "customerId"      : state.estimate.customerId,
                "estimateTitle"    : state.estimate.estimateTitle,
                "subheading"      : state.estimate.estimateSummary,
                "estimateNumber"   : state.estimate.estimateNumber.toString(),
                "referenceNumber" : state.estimate.referenceNumber,
                "estimateDate"     : state.estimate.estimateDate,
                "notes"           : state.estimate.notes,
                "footerNotes"     : state.estimate.footerNotes,
                "subTotal"        : state.estimate.subTotal,
                "taxTotal"        : state.estimate.taxTotal,
                "grandTotal"      : state.estimate.grandTotal,
                "status"          : (_type == ESTIMATE_STATUS_DRAFT) ? ESTIMATE_STATUS_DRAFT : ESTIMATE_STATUS_PUBLISH
            },
            // "billed_customer" : state.billedCustomer,
            "estimate_items" : state.estimateItems,
            "sales_tax"     : state.salesTax
        }

        const { data, post, update, error } = useApi(
            config.ESTIMATE_URL + `${state.estimate.id ? state.estimate.id: "create"}`
        )

        if (!state.estimate.id) {
            await post(payload)
            state.alertMessage = "estimate created successfully"
        }else{
            await update(payload)
            state.alertMessage = "estimate updated successfully"
        }

        if(!error.value) {
            payload.estimate.customerId = billedCustomer.value.intuit_id
            console.log(data.value.data)
            let uid = data.value.data
            
            //create/update clover estimate
            if(!state.estimate.id) createEstimate(payload,data.value.data)
            if(state.estimate.id) updateEstimate(payload,state.estimate.id)
            
            state.title = "Edit Estimate"
            state.estimate.id    = uid
            state.isNotify      = true
            state.error         = false
            state.isDisabled    = false
            state.isDrafted     = false
            state.isPublished   = false
            state.type         = _type
            state.isLoaded     = true

            //TODO:notify on send estimamte or tender button click and estimamte should be new
            if(state.type == ESTIMATE_STATUS_DRAFT || 
               state.type == ESTIMATE_STATUS_PUBLISH) showNotification()

            if(state.type == ESTIMATE_STATUS_DRAFT) {
                state.isDrafted = true   
                router.push({ name: 'estimates' })

            }
            if(state.type != ESTIMATE_STATUS_DRAFT) {
                state.isPublished = true

                router.replace({
                    name : "edit-estimate",
                    params: { uid : uid},  
                })
            }

        }else{
            state.error = true
            state.isNotify = true
            state.alertMessage = error.value
            state.isDisabled = false
        }
    }
      
    const completeEstimate = () =>{
        const { data, post, update, error } = useApi(`${config.ESTIMATE_URL + state.estimate.id+"complete"}`)

        post().then(()=>{

        })
    }

    return {
        validate,
        validateItems,
        ...toRefs(state),
        submit,
        completeEstimate
    }
}


// export const saveEstimate = () => {
  
//   validatePermissions('estimate', `${state.estimate.id ? 'edit' : 'create'}`);
//   fetchSalesTax();

//   const { settings } = useUtils();
//   const { customerId, billedCustomer } = useCustomer();
//   const { estimateItems, salesTax } = useEstimateItems();

//   const validate = useVuelidate(VALIDATE.Estimate, state.estimate, { $scope: false });
//   const validateItems = useVuelidate({
//     estimateItemsLength: helpers.withMessage("One Estimate item required", () => estimateItems.value.length > 0),
//   }, estimateItems.value, { $scope: false });

//   const submit = async (_type) => {
//     state.estimate.customerId = customerId.value;
//     state.estimate.subTotal = state.subTotal;
//     state.estimate.taxTotal = state.totalTaxAmount;
//     state.estimate.grandTotal = state.grandTotal;
//     state.estimateItems = estimateItems.value;
//     state.salesTax = salesTax.value;

//     validate.value.$touch();
//     validateItems.value.$touch();

//     if (validate.value.$invalid || validateItems.value.$invalid) return;

//     state.isDisabled = true;
//     state.isLoaded = false;

//     const payload = {
//       estimate: {
//         ...state.estimate,
//         estimateNumber: state.estimate.estimateNumber.toString(),
//         status: _type,
//       },
//       estimate_items: state.estimateItems,
//       sales_tax: state.salesTax,
//     };

//     const { data, post, update, error } = useApi(
//       config.ESTIMATE_URL + `${state.estimate.id ? state.estimate.id : 'create'}`
//     );

//     if (!state.estimate.id) {
//       await post(payload);
//       state.alertMessage = "Estimate created successfully";
//     } else {
//       await update(payload);
//       state.alertMessage = "Estimate updated successfully";
//     }

//     if (!error.value) {
//       state.isNotify = true;
//       state.error = false;
//       state.type = _type;
//       state.isPublished = _type !== ESTIMATE_STATUS_DRAFT;
//       state.isDrafted = _type === ESTIMATE_STATUS_DRAFT;
//       state.isLoaded = true;

//       const uid = data.value.data;
//       console.log('data',data.value.data);
//       router.push({ name: _type === ESTIMATE_STATUS_DRAFT ? 'estimates' : 'edit-estimate', params: { uid } });
//     } else {
//       state.error = true;
//       state.isNotify = true;
//       state.alertMessage = error.value;
//       state.isDisabled = false;
//     }
//   };

//   return {
//     validate,
//     validateItems,
//     ...toRefs(state),
//     submit
//   };
// };

export const ViewEstimate = (uuid) => {
  const { data, get } = useApi(config.ESTIMATE_URL + uuid + '/view');
  const { setCustomer } = useCustomer();
  const { setItems, setTaxes, estimateItems } = useEstimateItems();
  const { displayOrder } = useClover();

  const approveLoader = ref(false);
  const customer = ref([]);

  resetEstimateItems();

  get().then(() => {
    state.title = `${$T.EST_VIEW_TXT} #${state.estimate.estimateNumber}`;
    state.estimate = data.value.data.estimate;
    state.subTotal = state.estimate.subTotal;
    state.grandTotal = state.estimate.grandTotal;
    state.estimate.shareUrl = config.PUBLIC_ESTIMATE_VIEW + uuid;

    customer.value = data.value.data.customer;
    setCustomer(customer, state.estimate.customerId);
    setItems(data.value.data.estimateItems);
    state.estimateItems = estimateItems.value;
    setTaxes(data.value.data.salesTax);

    displayOrder.value.tax = $h.formatAmount(state.totalTaxAmount);
    displayOrder.value.subtotal = $h.formatAmount(state.subTotal);
    displayOrder.value.total = $h.formatAmount(state.estimate.grandTotal);
    displayOrder.value.amountRemaining = $h.formatAmount(state.estimate.grandTotal);

    state.estimateItems.forEach(item => {
      displayOrder.value.lineItems.push({
        name: item.name,
        note: item.description,
        quantity: String(item.quantity),
        price: $h.formatAmount(item.price),
      });
    });

    state.isLoaded = true;
  });

  const redirecttoEdit = () => {
    router.push({ name: 'edit-estimate', params: { uid: uuid } });
  };

  return {
    ...toRefs(state),
    customer,
    approveLoader,
    redirecttoEdit,
  };
};

export const resetForm = () => {
  const { settings } = useUtils();
  state.title = "New Estimate";
  state.estimate = {
    id: null,
    customerId: null,
    businessId: '',
    companyLogo: settings.value.logo,
    estimateTitle: settings.value.estimate_title,
    estimateSummary: settings.value.estimate_subheading,
    estimateNumber: estimateNumber > 0 ? estimateNumber : '',
    referenceNumber: '',
    estimateDate: '',
    validityDate: '',
    notes: '',
    footerNotes: '',
    currency: '',
    exchangeRate: '',
    subTotal: '',
    taxTotal: '',
    grandTotal: '',
    shareUrl: '',
    status: '',
    publishedDate: '',
    lastSendDate: '',
  };
  state.estimateItems = [];
  state.salesTax = [];
  state.taxes = [];
  state.totalTaxAmount = 0.0;
  state.taxableTotal = 0.0;
  state.subTotal = 0.0;
  state.grandTotal = 0.0;
  state.isPublished = false;
  state.isDrafted = false;
  state.isDisabled = false;
  state.isLoaded = false;
  state.error = false;
  state.alertMessage = '';
  state.validationErrors = [];
  resetCustomer();
  resetEstimateItems();
};

export const showNotification = () => {
  $h.notification(state.error, state.alertMessage, state.validationErrors);
  state.isNotify = false;
  state.error = false;
  state.alertMessage = '';
  state.validationErrors = [];
};

export const exportCSV = () => {
  const { get, status, data } = useApi(`${config.ESTIMATE_URL}export-csv`);
  state.showLoadingIcon = true;
  state.error = false;
  get().then(() => {
    if (status.value === 404 || status.value === 400) {
      state.error = true;
      state.isNotify = true;
      state.alertMessage = 'Unable to export estimate csv';
    } else {
      const base64String = `data:application/csv;base64, ${data.value.data.base64Csv}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = base64String;
      downloadLink.download = data.value.data.name;
      downloadLink.click();
      state.alertMessage = "Estimate csv exported successfully.";
    }
    state.showLoadingIcon = false;
    state.isNotify = true;
  });
};

export const EditEstimate = (estimate_id) => {
  validatePermissions('estimate', 'edit');

  const { data, get, error } = useApi(config.ESTIMATE_URL + estimate_id + '/edit');
  const { setCustomer } = useCustomer();
  const { setItems, setTaxes } = useEstimateItems();

  state.title = "Edit Estimate";
  state.isLoaded = false;

  get().then(() => {
    // Estimate data
    let est = data.value.data.estimate;
    state.estimate.id = est.id;
    state.estimate.customerId = est.customerId;
    state.estimate.estimateTitle = est.estimateTitle;
    state.estimate.estimateSummary = est.estimateSummary;
    state.estimate.estimateNumber = est.estimateNumber;
    state.estimate.referenceNumber = est.referenceNumber;
    state.estimate.estimateDate = $h.formatDate(est.estimateDate);
    state.estimate.validityDate = $h.formatDate(est.validityDate);
    state.estimate.notes = est.notes;
    state.estimate.footerNotes = est.footerNotes;
    state.estimate.currency = est.currency;
    state.estimate.exchangeRate = est.exchangeRate;
    state.estimate.subTotal = est.subTotal;
    state.estimate.grandTotal = est.grandTotal;
    state.estimate.dueAmount = est.dueAmount;
    state.estimate.shareUrl = est.shareUrl;
    state.estimate.status = est.status;
    state.estimate.publishedDate = est.publishedDate;
    state.estimate.lastSendDate = est.lastSendDate;

    state.subTotal = state.estimate.subTotal;
    state.grandTotal = state.estimate.grandTotal;

    // Customer
    setCustomer(data.value.data.customer, state.estimate.customerId);

    // Items
    setItems(data.value.data.estimateItems);

    // Sales Tax
    setTaxes(data.value.data.salesTax);

    if (state.estimate.status === ESTIMATE_STATUS_DRAFT) {
      state.isDrafted = true;
      state.isPublished = false;
    }

    if (state.estimate.status === ESTIMATE_STATUS_PUBLISH) {
      state.isDrafted = false;
      state.isPublished = true;
    }

    state.isLoaded = true;
  });
};

