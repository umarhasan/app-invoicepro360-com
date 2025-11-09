<template>
  <div v-if="!isLoaded">
    <InvoiceFormSkeleton />
  </div>

  <div class="grid grid-cols-12 gap-3" v-if="isLoaded">
      <div :class="isPreview ? 'col-span-12' : 'col-span-9'">        
        <div :class="!isPreview ? 'box' : 'no-box'">
          <top-bar 
                :title="title"
                :uid="invoice.id"
                :invoiceNumber="invoice.invoiceNumber"
                :isPreview="isPreview"
                :is-published="isPublished" 
                :is-drafted="isDrafted" 
                :is-disabled="isDisabled" 
                @preview="preview"
                @submit="submit" 
                @print="printInvoice" />

          <div class="col-span-12 invoice-form mt-2 px-4"
            v-if="validate.$errors.length > 0 || validateItems.$errors.length > 0">
            <DangerAlert>
              <template v-slot:header>
                <Lucide icon="AlertOctagon" class="w-6 h-6 mr-2" /> Error
                <button type="button" class="btn-close" @click="() => {
              validate.$reset()
              validateItems.$reset()
            }">
                  <Lucide icon="X" class="w-4 h-4" />
                </button>
              </template>

              <ul class="list-disc pl-5 pt-2">
                <li v-for="error of validate.$errors" :key="error.$uid">
                  <strong>{{ error.$message }}</strong>
                </li>

                <li v-for="error of validateItems.$errors" :key="error.$uid">
                  <strong>{{ error.$message }}</strong>
                </li>
              </ul>
            </DangerAlert>
          </div>

          <div class="grid grid-cols-12 gap-5 no-print px-4 pt-4" v-if="!isPreview">
            <div class="col-span-12 p-4 border border-gray-300 rounded-md">
              <div class="invoice-header flex flex-wrap">
                <div class="w-full md:w-2/6">
                  <Logo :permissions="permissions" :setting="setting" @onFilePicked="onFilePicked" />
                  <BusinessDetail :permissions="permissions" @setCompanyName="setCompanyName" />
                </div>
                <div class="w-full md:w-4/6 flex items-center justify-between">
                  <BilledCustomer @setCustomerEmail="setCustomerEmail" />
                </div>
              </div>
            </div>
          </div>

          <div class="w-full px-4 pb-4 text-base purpose" v-if="!isPreview">
            <div class="sm:grid gap-2 grid-cols-12 items-center py-3">            
              <div class="col-span-6">
                <div class="col-invoice">
                  <label for="reference-number">Reference no.</label>
                  <input v-model="invoice.referenceNumber" type="text" class="form-control" placeholder="Reference Number" />
                </div>

                <div class="col-purpose mt-4">
                  <label for="invoice-subheading" class="text-right pr-2">Purpose of Invoice</label>
                    <input v-model="invoice.invoiceSummary" type="text" class="form-control" placeholder="Subheading" />
                </div>
              </div>
              <div class="col-span-3"></div>
              <div class="col-span-3">
                <div class="col-date">
                  <label for="invoice-date">Invoice Date</label>
                  <div class="relative">
                    <div
                      class="absolute rounded-l w-10 h-full flex items-center justify-center bg-gray-100 border text-gray-600 dark:bg-dark-3 dark:border-transparent">
                      <Lucide icon="Calendar" class="w-4 h-4" />
                    </div>
                    <Litepicker v-model="invoice.invoiceDate" placeholder="Invoice Date"
                      class="form-control pl-12 dark:bg-dark-3 dark:border-transparent" :options="{
                      autoApply: true,
                      showWeekNumbers: true,
                      format : setting.date_format,
                      dropdowns: {
                        minYear: 1990,
                        maxYear: null,
                        months: true,
                        years: true,
                      },
                    }" />
                  </div>
                </div>

                <div class="col-due mt-4">
                  <label for="payment-due">Payment Due</label>
                  <div class="relative">
                    <div
                      class="absolute rounded-l w-10 h-full flex items-center justify-center bg-gray-100 border text-gray-600 dark:bg-dark-3 dark:border-transparent">
                      <Lucide icon="Calendar" class="w-4 h-4" />
                    </div>
                    <Litepicker v-model="invoice.paymentDueDate" placeholder="Payment Due"
                      class="form-control pl-12 dark:bg-dark-3 dark:border-transparent" :options="{
                      autoApply: true,
                      showWeekNumbers: true,
                      format : setting.date_format,
                      dropdowns: {
                        minYear: 1990,
                        maxYear: null,
                        months: true,
                        years: true,
                      },
                    }" />
                  </div>
                </div>

              </div>

            </div>

          </div>

          <div class="grid grid-cols-12 p-4 no-print" v-if="!isPreview">
            <div class="col-span-12 invoice-items mb-4">
              <InvoiceItems :items="invoiceItems" :setting="setting" @showModal="isOpenInvoiceColumnModal = true" />
            </div>

            <div class="col-span-12 lg:col-span-5 lg:col-start-8 text-md font-medium leading-loose text-lg">
              <div class="flex justify-between" style="border-color:#e7e5e5;">
                <div class="text-left font-semibold">Subtotal</div>
                <div class="text-right" v-html="$h.formatCurrency(subTotal)"></div>
              </div>

              <AddSalesTax :taxes="taxes" :selected-ids="selectedTaxId" class="" />

              <div class="flex justify-between mt-1">
                <div class="text-left font-semibold">Total</div>
                <div class="text-right" v-html="$h.formatCurrency(grandTotal)"></div>
              </div>
            </div>

          </div>
        </div>

        <div class="mt-4 accordions">
          <div class="col-span-12 mb-3 box accordion hidden" v-if="!isPreview">
            <div class="flex items-center justify-between p-3 border-b border-gray-200 cursor-pointer accordion-title"
              @click="toggleAccordion ('footer')">
              <label class="form-label">Footer</label>
              <Lucide :icon="state.isAccordionOpen['footer'] ? 'ChevronUp' : 'ChevronDown'" class="w-4 h-4" />
            </div>
            <transition name="accordion">
              <div v-show="state.isAccordionOpen['footer']" class="p-3 accordion-content">
                <textarea class="form-control w-full" rows="4"
                  placeholder="Enter a footer for this invoice (e.g. tax information, thank you note)"
                  v-model="invoice.footerNotes"></textarea>
              </div>
            </transition>
          </div>
        </div>
      </div>
    <!-- col span 9-->
    <div class="col-span-3 sider" v-if="!isPreview">
        <div class="mb-3 box accordion">
          <div class="accordion-title"
            @click="toggleAccordion('notes')">
            <label class="form-label">Notes / Terms</label>
            <div>
              <Lucide :icon="state.isAccordionOpen['notes'] ? 'ChevronUp' : 'ChevronDown'" class="w-4 h-4" />
            </div>
          </div>

          <transition name="accordion">
            <div v-show="state.isAccordionOpen['notes']" class="p-3 accordion-content">
              <textarea class="form-control w-full" rows="3"
                placeholder="Enter notes or terms of service that are visible to your customer"
                v-model="invoice.notes"></textarea>
            </div>
          </transition>
        </div>

        <div class="mb-3 box accordion">
          <div class="accordion-title" @click="toggleAccordion ('emailhistory')">
            <label class="form-label">Email History</label>
            <div>
              <Lucide :icon="state.isAccordionOpen['emailhistory'] ? 'ChevronUp' : 'ChevronDown'" class="w-4 h-4" />
            </div>
          </div>

          <transition name="accordion">
            <div v-show="state.isAccordionOpen['emailhistory']" class="p-3 accordion-content">

              <div class="email-send-history">
                <div class="flex justify-between px-3 py-2 border-b border-dashed border-gray-150 dark:border-dark-3 rounded mb-1"
                  v-for="(faker, fakerKey) in _.take(fakerData, 7)" :key="fakerKey">
                  <div class="">
                    <span class="font-medium">{{ faker.invoice[0].name }}</span>
                    <span class="text-slate-500 text-xs block">25/04/05</span>
                  </div>
                  <div class="text-xs" :class="faker.invoice[0].status== 'sent' ? 'text-success' : 'text-danger' ">{{
                    faker.invoice[0].status }}</div>
                </div>
              </div>
            </div>
        </transition>
      </div>
      <Payments :invoiceId="invoice.id" />
    </div> <!-- col span 3 sider -->
  </div>

  <div class="flex" v-if="invoice.id">
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2 overflow-y-auto flex justify-end items-center">
      <div class="w-1/3"></div>    
      <div class="w-1/3 text-right">
        <button 
          @click="submit('payment')" 
          class="btn btn-md btn-success w-64" 
          :disabled="isDisabled" 
          v-if="dueAmount > 0">
            <Lucide icon="Plus" class="sm:block w-5 h-5 mr-1 text-white" />
            Tender
        </button>

        <button 
            @click="completeInvoice" 
            class="btn btn-md btn-success w-64" 
            v-if="dueAmount <= 0">
            Complete
        </button>
      </div>
      <div class="w-1/3 text-right">
        <RemainingBalance :isModalbox="false" v-if="invoice.id" />
      </div>
      <div class="w-1/3"></div>
    </div>
  </div>

  <div class="no-print mt-5" v-if="!isPreview">
    <InvoiceColumnModal :columns="columns" :setting="setting" :showLoadingIcon="showLoadingIcon"
      :validationErrors="validationErrors" :isOpen="isOpenInvoiceColumnModal"
      @updateInvoiceColumns="updateInvoiceColumns" @close="isOpenInvoiceColumnModal = false" />
    <SendInvoiceModal 
        :invoiceNumber="invoice.invoiceNumber" 
        :to="customerEmail" 
        :isOpen="isOpenSendInvoiceModal"
        :invoiceId="invoice.id" 
        :company-name="companyName" 
        @close="isOpenSendInvoiceModal = false" />
    <PaymentModal :invoiceId="invoice.id" />
  </div>

  <preview-default-invoice v-if="isLoaded && isPreview &&
      (setting.invoice_template == invoiceTemplate_1 || setting.invoice_template == '')
    " :invoice="invoice" :grandTotal="grandTotal" :subTotal="subTotal" :salesTax="st" :items="invoiceItems"
    :setting="setting" />
  <preview-classic-invoice v-if="isPreview && setting.invoice_template == invoiceTemplate_2" :invoice="invoice"
    :grandTotal="grandTotal" :subTotal="subTotal" :salesTax="st" :items="invoiceItems" :setting="setting" />
  <preview-professional-invoice v-if="isPreview && setting.invoice_template == invoiceTemplate_3"
    :invoice="invoice" :grandTotal="grandTotal" :subTotal="subTotal" :salesTax="st" :items="invoiceItems"
    :setting="setting" />
</template>

<script setup>
import { onMounted, watch, reactive, toRefs } from "vue";
import { saveInvoice, EditInvoice, updateTotal } from "@/compositions/invoices";
import { useInvoiceItems } from "@/compositions/invoices/items";
import { useSettings } from "@/compositions/invoices/settings";
import { usePayment } from "@/compositions/payment/index";
import config from "@/config";
import TopBar from "./TopBar.vue";
import Logo from "./logo.vue";
import BusinessDetail from "../business-detail/Main.vue";
import BilledCustomer from "../customer/Main.vue";
import InvoiceItems from "../items/Main.vue";
import InvoiceColumnModal from "../invoice-columns/Modal.vue";
import AddSalesTax from "../sales-tax/AddSalesTax.vue";
import PreviewDefaultInvoice from "../invoice-template/default-layout.vue";
import PreviewClassicInvoice from "../invoice-template/classic-layout.vue";
import PreviewProfessionalInvoice from "../invoice-template/professional-layout.vue";
import SendInvoiceModal from "../view/SendInvoiceModal.vue";
import PaymentModal from "../payment/Modal.vue";
import Payments from "../payment/Main.vue";
import RemainingBalance from "../payment/remaining-balance.vue";
import InvoiceFormSkeleton from "./InvoiceFormSkeleton.vue";
import _ from "lodash";
import fakerData from "@/utils/faker";

  const defaultAccordionState = {
    paymenthistory:false,
    notes: false,
    emailhistory: false,
  }

  const state = reactive({
      isPreview : false,
      isAccordionOpen: { ...defaultAccordionState },
      st        : [],
      customerEmail : '',
      companyName   : '',
      invoiceTemplate_1 : config.INVOICE_TEMPLATE_1,
      invoiceTemplate_2 : config.INVOICE_TEMPLATE_2,
      invoiceTemplate_3 : config.INVOICE_TEMPLATE_3,
  })

  const {
      setting,
      columns,
      showLoadingIcon,
      isSaved,
      validationErrors,
      onFilePicked,
      updateInvoiceColumns,
      isOpenInvoiceColumnModal,
  } = useSettings()

  const {
      title,
      invoice,
      invoiceItems: $invoiceItems,
      salesTax: $salesTax,
      validate,
      validateItems,
      taxes,
      subTotal,
      grandTotal,
      permissions,
      isPublished,
      isDrafted,
      isDisabled,
      isLoaded,
      type,
      isOpenSendInvoiceModal,
      submit,
      completeInvoice
    } = saveInvoice();

  const { 
      invoiceItems, 
      salesTax, 
      selectedTaxId, 
      isInvoiceItemupdate 
  } = useInvoiceItems()

  const {isOpenPaymentModal , dueAmount} = usePayment()

	const printInvoice = () => { window.print()}
  const preview 	   = () => { state.isPreview = !state.isPreview }
  const setCustomerEmail  = email => { state.customerEmail = email }
  const setCompanyName    = name  => { state.companyName = name }
  const toggleAccordion = (key) => {
    state.isAccordionOpen[key] = !state.isAccordionOpen[key]
  }

  onMounted(() => {
      if (router.currentRoute.value.name == "edit-invoice") {        
          EditInvoice(router.currentRoute.value.params.uid);      
          router.updateMeta('edit-invoice', { title: `${title.value} - #${invoice.value.invoiceNumber}` });
      }else {
        title.value = "New Invoice"
        invoice.value.id = '';
      }
  })

  watch( () => { return isLoaded.value}, () => {
    if(isLoaded.value) {
        if(type.value == 'send') isOpenSendInvoiceModal.value = true
        if(type.value == 'payment') isOpenPaymentModal.value = true
        if(type.value) type.value = ''
    }
  })

  watch(() => { return isInvoiceItemupdate.value }, () => {
      $invoiceItems.value = invoiceItems.value
      updateTotal(true)
      isInvoiceItemupdate.value = false
  })

  watch(() => {return salesTax.value},() => {
      $salesTax.value = salesTax.value
      state.st = $salesTax.value
      updateTotal(true)
  })

	const { 
      isPreview, 
      st, 
      customerEmail, 
      companyName, 
      invoiceTemplate_1, 
      invoiceTemplate_2, 
      invoiceTemplate_3,
     } = toRefs(state)

</script>
<style>
  input.form-control{
    height:40px !important
  }

  .accordion-title{
    @apply flex items-center justify-between p-3 border-b border-gray-200 cursor-pointer
  }

  .accordion-title label{
    @apply text-lg font-semibold;
    margin-bottom:0.1rem !important;
  }

  .accordion-enter-active, .accordion-leave-active {
    transition: max-height 0.3s ease, opacity 0.3s ease;
    overflow: hidden;
  }

  .accordion-enter-from,
  .accordion-leave-to {
    max-height: 0;
    opacity: 0;
  }

  .accordion-enter-to,
  .accordion-leave-from {
    max-height: 500px;
    opacity: 1;
  }

  .no-box{
    box-shadow:none;
    background-color: transparent;
  }

</style>
