<template>
    <div class="grid grid-cols-12 gap-5 no-print" v-if="isLoaded">
      <div class="col-span-9">
        <top-bar
          :title="title"
          @print="printInvoice"
          :invoiceId="uuid"
          @duplicate="alert(1)"
        >
          <button
            @click="approveInvoice"
            class="btn box flex items-center text-primary"
            :class="{ disable: approveLoader }"
            :disabled="approveLoader"
            v-if="invoice.status == 'draft'"
          >
            <Lucide icon="Edit2" v-if="!approveLoader" class="sm:block w-4 h-4 mr-2" />
            <LoadingIcon
              icon="oval"
              color="blue"
              class="w-4 h-3 mr-1"
              v-if="approveLoader"
            />
            <span>{{ $T.INV_APPROVE_DRAFT_TXT }}</span>
          </button>

          <button
            class="btn box flex items-center text-primary"
            v-if="invoice.status == 'draft'"
            :class="{ disable: approveLoader }"
            :disabled="approveLoader"
            @click="redirecttoEdit"
          >
            <Lucide icon="Edit2" class="sm:block w-4 h-4 mr-2" />
            {{ $T.INV_DRAFT_BTN }}
          </button>

          <button
            class="btn box flex items-center text-primary"
            v-if="invoice.status != 'draft'"
            :class="{ disable: approveLoader }"
            :disabled="approveLoader"
            @click="redirecttoEdit"
          >
            <Lucide icon="Edit2" class="sm:block w-4 h-4 mr-2" />
            {{ $T.INV_EDIT_BTN }}
          </button>

          <button
            v-if="invoice.status != 'draft'"
            class="btn box flex items-center text-primary ml-2"
            @click="showSendInvoiceModal"
          >
            <Lucide icon="Send" class="sm:block w-4 h-4 mr-2 text-primary" />
            {{ invoice.lastSendDate == "" ? $T.INV_SEND_BTN : $T.INV_RESEND_BTN }}
          </button>

          <button
            class="ml-2 btn box flex items-center text-primary mr-2"
            @click="showShareLinkModal"
          >
            <Lucide icon="Copy" class="sm:block w-4 h-4 mr-2" />
            {{ $T.SHARE_LINK_BTN }}
          </button>
        </top-bar>
      </div>

      <div class="col-span-3">
        <div class="flex flex-col sm:flex-row items-center my-5">
          <button
            @click=""
            class="btn box flex items-center text-primary w-full"
            :class="{ disable: approveLoader }"
            :disabled="approveLoader"
            v-if="invoice.status != 'draft'"
          >
            <Lucide icon="Plus" class="sm:block w-4 h-4 mr-2 text-primary" />

            <span>{{ $T.RECORD_PAYMENT_BTN }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-5" v-if="isLoaded">
      <div class="col-span-9 print:col-span-12">
        <view-default-invoice
          v-if="paymentLoaded &&
            (setting.invoice_template == invoiceTemplate_1 ||
              setting.invoice_template == '')
          "
          :invoice="invoice"
          :grandTotal="grandTotal"
          :subTotal="subTotal"
          :salesTax="st"
          :items="invoiceItems"
          :setting="setting"
          :payments="payments"
          :key="1"
        />
        <view-classic-invoice
          v-if="paymentLoaded && setting.invoice_template == invoiceTemplate_2"
          :invoice="invoice"
          :grandTotal="grandTotal"
          :subTotal="subTotal"
          :salesTax="st"
          :items="invoiceItems"
          :setting="setting"
          :payments="payments"
          :key="2"
        />

        <view-professional-invoice
          v-if="paymentLoaded && setting.invoice_template == invoiceTemplate_3"
          :invoice="invoice"
          :grandTotal="grandTotal"
          :subTotal="subTotal"
          :salesTax="st"
          :items="invoiceItems"
          :setting="setting"
          :payments="payments"
          :key="3"
        />
      </div>

      <div class="col-span-3 no-print">
        <div class="box grid grid-cols-1 gap-2 p-5 uppercase text-xs text-slate-500">
          <div class="">
            <div class="">{{ $T.STATUS_TXT }}</div>
            <div class="text-primary font-medium text-lg capitalize">
              {{ invoice.status }}
            </div>
          </div>

          <div class="">
            <div class="">{{ $T.DUE_AMOUNT_TXT }}</div>
            <div
              class="text-primary font-medium text-lg capitalize"
              v-html="$h.formatCurrency(invoice.dueAmount)"
            ></div>
          </div>

          <div class="">
            <div class="">{{ $T.CUSTOMER_TXT }}</div>
            <div class="text-primary font-medium text-lg capitalize">
              {{ customer.customer }}
            </div>
          </div>

          <div class="">
            <div class="">{{ $T.DUE_DATE_TXT }}</div>
            <div class="text-primary font-medium text-lg capitalize">
              {{ $h.formatDate(invoice.paymentDueDate) }}
            </div>
          </div>

          <div class="">
            <div class="">{{ $T.CREATED_TXT }}</div>
            <div class="text-primary font-medium text-lg capitalize">
              <span v-if="invoice.publishedDate == ''">just a moment ago</span>
              <span v-if="invoice.publishedDate != ''">{{
                $h.formatDate(invoice.publishedDate)
              }}</span>
            </div>
          </div>

          <div class="">
            <div class="">{{ $T.LAST_SEND_TXT }}</div>
            <div class="text-primary font-medium text-lg capitalize">
              <span>{{
                invoice.lastSendDate == "" ? "Never" : invoice.lastSendDate
              }}</span>
            </div>
          </div>          

        <div class="col-span-12 lg:col-span-12 xxl:col-span-12">
          <!-- Payment Received-->

          <div class="pt-3 mt-5" v-if="invoice.status != 'draft' && paymentLoaded">
            <div class="flex items-center h-10 intro-x">
              <h2 class="mr-5 text-lg font-medium truncate">
                {{ $T.PAYMENT_RECEIVED_H1 }}
              </h2>
            </div>

            <div>
              <div class="intro-x" v-for="(payment, index) in payments" :key="index">
                <div
                  class="flex items-center py-3 justify-between gap-x-1 border-b bg-white"
                >
                  <div class="ml-4 mr-auto">
                    <div class="font-medium">Payment via {{ payment.paymentMethod }}</div>
                    <div class="text-slate-500 text-xs mt-1">
                      {{ $h.formatDate(payment.paymentDate) }}
                    </div>

                    <div class="mt-2">
                      <button
                        v-if="payment.paymentMethod != 'clover-pos'"
                        class="btn btn-sm btn-outline-primary border bg-theme-5 hover:text-white"
                      >
                        Void Payment
                      </button>
                      <br />
                      <span class="text-primary font-bold hidden">
                        {{ $T.SEND_RECEIPT_BTN }}</span
                      >
                    </div>
                  </div>
                  <div
                    class="text-success mr-4"
                    v-html="$h.formatCurrency(payment.amount)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SendInvoiceModal :invoiceNumber="invoice.invoiceNumber" :to="customer.email" :invoiceId="uuid" />
    <PaymentModal :invoiceId="uuid" />
    <ShareLinkModal :shareUrl="invoice.shareUrl"></ShareLinkModal>

    <DeleteModal @delete="removePayment" heading="Remove invoice payment" :message="deleteMessage" />
  </div>
</template>

<script>
import { defineComponent, onMounted, watch,ref } from "vue";
import { viewInvoice } from "@/compositions/invoices";
import { useInvoiceItems } from "@/compositions/invoices/items";
import { useSettings } from "@/compositions/invoices/settings";
import { usePayment } from "@/compositions/payment";
import config from "@/config";

import TopBar from "./TopBar.vue";

import ViewDefaultInvoice from "../invoice-template/default-layout.vue";
import ViewProfessionalInvoice from "../invoice-template/professional-layout.vue";
import ViewClassicInvoice from "../invoice-template/classic-layout.vue";
import SendInvoiceModal from "./SendInvoiceModal.vue";
import PaymentModal from "../payment/Modal.vue";

import ShareLinkModal from "./ShareLinkModal.vue";

export default defineComponent({
  components: {
    TopBar,
    ViewDefaultInvoice,
    ViewProfessionalInvoice,
    ViewClassicInvoice,
    SendInvoiceModal,
    ShareLinkModal,
    PaymentModal,
  },
  setup() {
    const uuid = router.currentRoute.value.params.uid;
    const invoiceTemplate_1 = config.INVOICE_TEMPLATE_1;
    const invoiceTemplate_2 = config.INVOICE_TEMPLATE_2;
    const invoiceTemplate_3 = config.INVOICE_TEMPLATE_3;
    const st = ref([])
    const {
      fetchPayments,
      showDeleteModal,
      deleteMessage,
      setDisplayAmount,
    } = usePayment();

    const {
      title,
      invoice,
      subTotal,
      grandTotal,
      isLoaded,
      customer,
      approveLoader,
      approveInvoice,
      redirecttoEdit,
      printInvoice,
      showSendInvoiceModal,
      showShareLinkModal,
      
    } = viewInvoice(uuid);

    const { paymentLoaded, payments } = fetchPayments(uuid);
    const { salesTax, invoiceItems } = useInvoiceItems();
    const { setting, columns } = useSettings();

    watch([isLoaded],
      () => {
        if(isLoaded.value){
          st.value = salesTax.value[0]
          setDisplayAmount(invoice.value.dueAmount);
          
        }
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
      isLoaded,
      invoice,
      invoiceItems,
      subTotal,
      grandTotal,
      st,
      setting,
      columns,
      customer,
      approveLoader,
      approveInvoice,
      redirecttoEdit,
      showSendInvoiceModal,
      showShareLinkModal,
      paymentLoaded,
      payments,
      showDeleteModal,
      deleteMessage,
      printInvoice,
  
    };
  },
});
</script>