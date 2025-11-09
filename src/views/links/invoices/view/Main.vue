<template>
  <div class="grid grid-cols-6 gap-5">
  <div class="col-span-4">
    <top-bar :title="title" v-if="isInvoiceLoaded" />
    

    <div class="invoice-loaded" v-if="isLoaded && isInvoiceLoaded">

      <view-default-invoice
        v-if="paymentLoaded &&
        (setting.invoice_template == invoiceTemplate_1 || setting.invoice_template == '')"
      :invoice="invoice"
      :grandTotal="grandTotal"
      :subTotal="subTotal"
      :salesTax="salesTax"
      :items="invoiceItems"
      :setting="setting"
      :payments="payments"
      :key="3"
    />

      <view-classic-invoice
      v-if="
        paymentLoaded &&
        setting.invoice_template == invoiceTemplate_2 
      "
      :invoice="invoice"
      :grandTotal="grandTotal"
      :subTotal="subTotal"
      :salesTax="salesTax"
      :items="invoiceItems"
      :setting="setting"
      :payments="payments"
      :key="1"
    />

    <view-professional-invoice
      v-if="paymentLoaded && setting.invoice_template == invoiceTemplate_3"
      :invoice="invoice"
      :grandTotal="grandTotal"
      :subTotal="subTotal"
      :salesTax="salesTax"
      :items="invoiceItems"
      :setting="setting"
      :payments="payments"
      :key="2"
    />     
    </div>
  </div>

  <div class="col-span-2 my-20">
    <CreditCardChargeModal :amount="invoice.dueAmount" :invoiceId="uuid"></CreditCardChargeModal>
  </div>
    
  </div>
</template>

<script>
import { defineComponent, watch,ref,onMounted } from "vue";
import { publicInvoiceView } from "@/compositions/invoices";
import { useInvoiceItems } from "@/compositions/invoices/items";
import { useSettings } from "@/compositions/invoices/settings";
import { useApi } from "@/compositions/api"
import config from "@/config"

import { usePayment } from "@/compositions/payment";

import TopBar from "./TopBar.vue";

import ViewDefaultInvoice from "@/views/invoices/invoice-template/default-layout.vue";
import ViewProfessionalInvoice from "@/views/invoices/invoice-template/professional-layout.vue";
import ViewClassicInvoice from "@/views/invoices/invoice-template/classic-layout.vue";


import CreditCardChargeModal from "./CreditCardChargeModal.vue";


export default defineComponent({
  components: {
    TopBar,
    ViewDefaultInvoice,
    ViewProfessionalInvoice,
    ViewClassicInvoice,
    CreditCardChargeModal,
  },
  setup() {
    const uuid = router.currentRoute.value.params.uid;
    const invoiceTemplate_1 = config.INVOICE_TEMPLATE_1;
    const invoiceTemplate_2 = config.INVOICE_TEMPLATE_2;
    const invoiceTemplate_3 = config.INVOICE_TEMPLATE_3;
    const isInvoiceLoaded = ref(false)
    const setting = ref(false)

    const {columns } = useSettings();

    const {
      fetchPayments,
      showDeleteModal,
      deleteMessage,
      isOnlinePaymentAllowed,
    } = usePayment();

    const {
      title,
      invoice,
      subTotal,
      grandTotal,
      isLoaded,
      customer,
    } = publicInvoiceView(uuid);

    const { salesTax, invoiceItems } = useInvoiceItems();

    const fetchSetting = () => {

      const { data, get, status } = useApi(config.SETTING_URL)

      get().then( () => {
          if(status.value != 404){
              setting.value = data.value.data
          }
      })

    }

    const { paymentLoaded, payments } = fetchPayments(uuid);

    onMounted(() => {

            fetchSetting()
        })

    watch(
      () => {
        return isLoaded.value;
      },
      () => {

        isInvoiceLoaded.value = isLoaded.value
      }
    );

    watch(
      () => {
        return payments.value.length > 0;
      },
      () => {
        paymentLoaded.value = true;
      }
    );

    return {
      title,
      uuid,
      invoiceTemplate_1,
      invoiceTemplate_2,
      invoiceTemplate_3,
      isInvoiceLoaded,
      invoice,
      invoiceItems,
      subTotal,
      grandTotal,
      salesTax,
      setting,
      columns,
      customer,
      isOnlinePaymentAllowed,
      isLoaded,      
      paymentLoaded,
      payments,
      showDeleteModal,
      deleteMessage,
    };
  },
});
</script>
