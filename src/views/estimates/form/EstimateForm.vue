<template>
  <div class="grid grid-cols-12 gap-3">
      <div :class="isPreview ? 'col-span-12' : 'col-span-10'">        
        <div :class="!isPreview ? 'box' : 'no-box'">
          <top-bar 
                :title="title"
                :uid="estimate.id"
                :estimateNumber="estimate.estimateNumber"
                :isPreview="isPreview"
                :is-published="isPublished" 
                :is-drafted="isDrafted" 
                :is-disabled="isDisabled" 
                @preview="preview"
                @submit="submit" 
                @print="printEstimate" />

          <div class="col-span-12 estimate-form mt-2 px-4"
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
              <div class="estimate-header flex flex-wrap">
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
           <div class="sm:grid grid-cols-2 gap-2 my-2">
                <div>
                  <input
                    v-model="estimate.estimateTitle"
                    type="text"
                    class="form-control"
                    placeholder="Title"
                  />
                </div>
                <div>
                  <input
                    v-model="estimate.estimateSummary"
                    type="text"
                    class="form-control"
                    placeholder="Subheading"
                  />
                </div>
              </div>
              <div class="sm:grid grid-cols-2 gap-3 mb-2">
                <div>
                  <input
                    v-model="estimate.estimateNumber"
                    type="text"
                    class="form-control"
                    placeholder="Estimate Number"
                  />
                </div>

                <div>
                  <input
                    v-model="estimate.referenceNumber"
                    type="text"
                    class="form-control"
                    placeholder="Reference Number"
                  />
                </div>
              </div>

              <div class="sm:grid grid-cols-2 gap-3">
                <div class="relative">
                  <div
                    class="absolute rounded-l w-10 h-full flex items-center justify-center bg-gray-100 border text-gray-600"
                  >
                    <Lucide icon="Calendar" class="w-4 h-4" />
                  </div>
                  <Litepicker
                    v-model="estimate.estimateDate"
                    placeholder="Estimate Date"
                    class="form-control pl-12"
                    :options="{
                      autoApply: false,
                      showWeekNumbers: true,
                      dropdowns: {
                        minYear: 1990,
                        maxYear: null,
                        months: true,
                        years: true,
                      },
                    }"
                  />
                </div>
              </div>
          </div>

          <div class="grid grid-cols-12 p-4 no-print" v-if="!isPreview">
            <div class="col-span-12 estimate-items mb-4">
              <EstimateItems :items="estimateItems" :setting="setting" @showModal="isOpenEstimateColumnModal = true" />
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
                  placeholder="Enter a footer for this estimate (e.g. tax information, thank you note)"
                  v-model="estimate.footerNotes"></textarea>
              </div>
            </transition>
          </div>
        </div>
      </div>
    <!-- col span 3 sider -->
  </div>

  <div class="flex" v-if="estimate.id">
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
            @click="completeEstimate" 
            class="btn btn-md btn-success w-64" 
            v-if="dueAmount <= 0">
            Complete
        </button>
      </div>
      <div class="w-1/3 text-right">
        <RemainingBalance :isModalbox="false" v-if="estimate.id" />
      </div>
      <div class="w-1/3"></div>
    </div>
  </div>

  <div class="no-print mt-5" v-if="!isPreview">
    <EstimateColumnModal :columns="columns" :setting="setting" :showLoadingIcon="showLoadingIcon"
      :validationErrors="validationErrors" :isOpen="isOpenEstimateColumnModal"
      @updateEstimateColumns="updateEstimateColumns" @close="isOpenEstimateColumnModal = false" />
    <SendEstimateModal 
        :estimateNumber="estimate.estimateNumber" 
        :to="customerEmail" 
        :isOpen="isOpenSendEstimateModal"
        :estimateId="estimate.id" 
        :company-name="companyName" 
        @close="isOpenSendEstimateModal = false" />
    <PaymentModal :estimateId="estimate.id" />
  </div>

  <preview-default-estimate v-if="isLoaded && isPreview &&
      (setting.estimate_template == estimateTemplate_1 || setting.estimate_template == '')
    " :estimate="estimate" :grandTotal="grandTotal" :subTotal="subTotal" :salesTax="st" :items="estimateItems"
    :setting="setting" />
  <preview-classic-estimate v-if="isPreview && setting.estimate_template == estimateTemplate_2" :estimate="estimate"
    :grandTotal="grandTotal" :subTotal="subTotal" :salesTax="st" :items="estimateItems" :setting="setting" />
  <preview-professional-estimate v-if="isPreview && setting.estimate_template == estimateTemplate_3"
    :estimate="estimate" :grandTotal="grandTotal" :subTotal="subTotal" :salesTax="st" :items="estimateItems"
    :setting="setting" />
</template>

<script setup>
import { onMounted, watch, reactive, toRefs } from "vue";
import { saveEstimate, EditEstimate, updateTotal } from "@/compositions/estimates";
import { useEstimateItems } from "@/compositions/estimates/items";
import { useSettings } from "@/compositions/estimates/settings";
import { usePayment } from "@/compositions/payment/index";
import config from "@/config";
import TopBar from "./TopBar.vue";
import Logo from "./logo.vue";
import BusinessDetail from "../business-detail/Main.vue";
import BilledCustomer from "../customer/Main.vue";
import EstimateItems from "../items/Main.vue";
import EstimateColumnModal from "../estimate-columns/Modal.vue";
import AddSalesTax from "../sales-tax/AddSalesTax.vue";
import PreviewDefaultEstimate from "../estimate-template/default-layout.vue";
import PreviewClassicEstimate from "../estimate-template/classic-layout.vue";
import PreviewProfessionalEstimate from "../estimate-template/professional-layout.vue";
import SendEstimateModal from "../view/SendEstimateModal.vue";
import PaymentModal from "../payment/Modal.vue";
import Payments from "../payment/Main.vue";
import RemainingBalance from "../payment/remaining-balance.vue";

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
      estimateTemplate_1 : config.ESTIMATE_TEMPLATE_1,
      estimateTemplate_2 : config.ESTIMATE_TEMPLATE_2,
      estimateTemplate_3 : config.ESTIMATE_TEMPLATE_3,
  })

  const {
      setting,
      columns,
      showLoadingIcon,
      isSaved,
      validationErrors,
      onFilePicked,
      updateEstimateColumns,
      isOpenEstimateColumnModal,
  } = useSettings()

  const {
      title,
      estimate,
      estimateItems: $estimateItems,
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
      isOpenSendEstimateModal,
      submit,
      completeEstimate
    } = saveEstimate();

  const { 
      salesTax, 
      selectedTaxId, 
      isEstimateItemupdate 
  } = useEstimateItems()

  const {isOpenPaymentModal , dueAmount} = usePayment()

	const printEstimate = () => { window.print()}
  const preview 	   = () => { state.isPreview = !state.isPreview }
  const setCustomerEmail  = email => { state.customerEmail = email }
  const setCompanyName    = name  => { state.companyName = name }
  const toggleAccordion = (key) => {
    state.isAccordionOpen[key] = !state.isAccordionOpen[key]
  }

  onMounted(() => {
      if (router.currentRoute.value.name == "edit-estimate") {        
          EditEstimate(router.currentRoute.value.params.uid);      
          router.updateMeta('edit-estimate', { title: `${title.value} - #${estimate.value.invoiceNumber}` });
      }else {
        title.value = "New Estimate"
        estimate.value.id = '';
      }
  })

  watch( () => { return isLoaded.value}, () => {
    if(isLoaded.value) {
        if(type.value == 'send') isOpenSendEstimateModal.value = true
        if(type.value == 'payment') isOpenPaymentModal.value = true
        if(type.value) type.value = ''
    }
  })

  watch(() => { return isEstimateItemupdate.value }, () => {
      $estimateItems.value = estimateItems.value
      updateTotal(true)
      isEstimateItemupdate.value = false
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
      estimateTemplate_1, 
      estimateTemplate_2, 
      estimateTemplate_3,
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
