<template>
  <Dialog size="xl" staticBackdrop :open="isOpenPaymentModal">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" ></div>

    <div class="fixed inset-0 w-screen overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 dialog-scrolable">
    
    <Dialog.Panel>
        <Dialog.Title v-if="!showLoadingIcon && showPaymentForm">
          <h2 class="font-medium text-base mr-auto">{{ formTitle }}</h2>
          <Lucide icon="X" class="w-8 h-8 cursor-pointer" @click="() => {
            closeModal()
          }" />
        </Dialog.Title>
        <!-- END: Modal Header -->

        <Dialog.Description class="p-0">
          <SuccessLoader />
          <Loader />

          <div class="grid grid-cols-12 relative">
            <Nav />

            <div
              class="col-span-7 mx-5 py-5 relative"
              v-if="!showLoadingIcon && showPaymentForm"
            >
              <!-- Validation Error -->
              <form method="POST" @submit.prevent="savePayment" class="mb-10">
                <!-- BEGIN: Modal Body -->

                <div class="clover-pos-form" v-if="payment.paymentType == 'clover-pos'">
                  
                  <DangerAlert v-if="!cloverSettings.isConnected">
                    <template v-slot:header>
                      <Lucide icon="AlertOctagon" class="w-6 h-6 mr-2" /> To Clover Please setup from settings
                    </template>
                  </DangerAlert>

                  <DangerAlert v-if="!cloverSettings.device && cloverSettings.isConnected">
                    <template v-slot:header>
                      <Lucide icon="AlertOctagon" class="w-6 h-6 mr-2" /> Please select clover device
                    </template>
                  </DangerAlert>

                  <div class="mb-2" v-if="cloverSettings.isConnected && cloverSettings.device">

                    <div>
                      <label
                        for="amount"
                        class="block font-bold text-gray-600 mb-1 md:mb-0"
                      >
                        Amount <span class="text-theme-6">*</span>
                      </label>
                    </div>
                    <div>
                      <input
                        v-model="payment.amount"
                        type="text"
                        class="form-control yr-form-control"
                        :class="{
                          'border-theme-6 focus:border-theme-6': vcp.amount.$error,
                        }"
                        v-decimal="'auto'"
                      />
                    </div>
                  </div>

                </div>
                <div class="manual-credit-card-form" v-if="payment.paymentType == 'credit'">

                  <DangerAlert v-if="!isPaymentGatewayEnabled">
                    <template v-slot:header>
                      <Lucide icon="AlertOctagon" class="w-6 h-6 mr-2" /> Please setup payment gateway
                    </template>
                  </DangerAlert>
                  
                  <div v-if="isPaymentGatewayEnabled">
                    <div class="mb-2">
                      <div>
                        <label
                          for="owner-name"
                          class="block font-bold text-gray-600 mb-1 md:mb-0"
                        >
                          Card Holder Name <span class="text-theme-6">*</span>
                        </label>
                      </div>
                      <div>
                        <input
                          v-model="payment.name"
                          type="text"
                          class="form-control yr-form-control"
                          :class="{
                            'border-theme-6 focus:border-theme-6': vcc.name.$error,
                          }"
                        />
                      </div>
                    </div>

                    <div class="mb-2">
                      <div>
                        <label
                          for="card-number"
                          class="block font-bold text-gray-600 mb-1 md:mb-0"
                        >
                          Card Number <span class="text-theme-6">*</span>
                        </label>
                      </div>

                      <div>
                        <input
                          :value="formattedCardNumber"
                          @input="cardNumberInput"
                          maxlength="19"
                          type="text"
                          placeholder="Card Number"
                          class="form-control yr-form-control"
                          :class="{
                            'border-theme-6 focus:border-theme-6': vcc.cardNumber.$error,
                          }"
                        />
                      </div>
                    </div>

                    <div class="grid gap-4 mb-2 grid-cols-2">
                      <div class="col-span-2 sm:col-span-1">
                        <div>
                          <label
                            for="card-expiry"
                            class="block font-bold text-gray-600 mb-1 md:mb-0"
                          >
                            Card Expiry <span class="text-theme-6">*</span>
                          </label>
                        </div>

                        <div>
                          <input
                            :value="formattedExpiry"
                            @input="cardExpiryInput"
                            type="text"
                            class="form-control yr-form-control"
                            placeholder="MM/YY"
                            maxlength="5"
                            :class="{
                              'border-theme-6 focus:border-theme-6': vcc.cardExpiry.$error,
                            }"
                          />
                        </div>
                      </div>

                      <div class="col-span-2 sm:col-span-1 mb-2">
                        <div>
                          <label
                            for="card-cvv"
                            class="block font-bold text-gray-600 mb-1 md:mb-0"
                          >
                            CVV <span class="text-theme-6">*</span>
                          </label>
                        </div>

                        <div class="">
                          <input
                            :value="payment.cardCvv"
                            @input="cardCvvInput"
                            maxlength="4"
                            type="text"
                            class="form-control yr-form-control"
                            placeholder="CVV"
                            :class="{
                              'border-theme-6 focus:border-theme-6': vcc.cardCvv.$error,
                            }"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="mb-2">
                      <div>
                        <label
                          for="amount"
                          class="block font-bold text-gray-600 mb-1 md:mb-0"
                        >
                          Amount <span class="text-theme-6">*</span>
                        </label>
                      </div>
                      <div>
                        <input
                          v-model="payment.amount"
                          type="text"
                          class="form-control yr-form-control"
                          :class="{
                            'border-theme-6 focus:border-theme-6': vcc.amount.$error,
                          }"
                          v-decimal="'auto'"
                        />
                      </div>
                    </div>

                    <div class="mb-2">
                      <div>
                        <label
                          for="memo"
                          class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 md:pt-2"
                          >Memo / Notes
                        </label>
                      </div>
                      <div>
                        <textarea
                          v-model="payment.memo"
                          name="memo"
                          cols="25"
                          rows="3"
                          class="form-control yr-form-control"
                          placeholder="Message"
                        ></textarea>
                      </div>
                    </div>
                  </div> 
                </div>

                <div
                  class="cash-form"
                  v-if="
                    payment.paymentType &&
                    payment.paymentType != 'clover-pos' &&
                    payment.paymentType != 'credit'
                  "
                >
                  <div class="mb-2">
                    <div>
                      <label
                        for="amount"
                        class="block font-bold text-gray-600 mb-1 md:mb-0"
                      >
                        Amount <span class="text-theme-6">*</span>
                      </label>
                    </div>
                    <div>
                      <input
                        v-model="payment.amount"
                        type="text"
                        class="form-control yr-form-control"
                        :class="{
                          'border-theme-6 focus:border-theme-6': vmp.amount.$error,
                        }"
                        v-decimal="'auto'"
                      />
                    </div>
                  </div>
                </div>

                <!-- END: Modal Body -->

                <!-- BEGIN: CUSTOM FIELDS -->
                <div class="form-custom-fields">
                  <div
                    v-for="(customField, key) in payment.customFields"
                    class="mb-2 w-half"
                  >
                    <label
                      for=""
                      class="block font-bold text-gray-600 mb-1 md:mb-0 capitalize"
                      >{{ customField.name }}</label
                    >
                    <input
                      type="text"
                      name="custom_field_{key}}"
                      value=""
                      v-if="customField.type == 'text'"
                      class="form-control yr-form-control"
                    />
                    <select
                      name="custom_field_{key}}"
                      id="custom_field_{key}}"
                      class="yr-form-control form-select bg-white"
                      v-if="customField.type == 'dropdown'"
                    >
                      <option
                        v-for="(option, key) in customField.option
                          .replace(/^\s+|\s+$/g, '')
                          .split('\n')"
                        :value="option"
                        :key="key"
                      >
                        {{ option }}
                      </option>
                    </select>
                  </div>
                </div>
                <!-- END: CUSTOM FIELDS -->

                <!-- BEGIN: Modal Footer -->
                

                <div class="pt-3 text-left" 
                v-if="
                    payment.paymentType &&
                    (payment.paymentType == 'credit' && !isPaymentGatewayEnabled ) "
                >
                  <button type="button" class="btn btn-danger btn-lg"
                    @click="r('credit-card')">Click to setup payment gateway</button>
                </div>

                <div class="pt-3 text-left" 
                v-if="
                    payment.paymentType &&
                    (payment.paymentType == 'clover-pos' && !cloverSettings.isConnected ) "
                >
                  <button type="button" class="btn btn-danger w-full btn-lg"
                    @click="r('credit-card')">Click to setup clover</button>
                </div>

                <div class="pt-3 text-left" 
                v-if="
                    payment.paymentType && payment.paymentType == 'clover-pos' && !cloverSettings.device  && cloverSettings.isConnected"
                >
                  <button type="button" class="btn btn-outline-danger"
                  @click="r('pos-setting')">Click to select clover device</button>
                </div>

                <RemainingBalance :isModalbox="true"/>


                <div class="pt-3 text-left" 
                v-if="
                    (payment.paymentType && payment.paymentType != 'clover-pos' && payment.paymentType != 'credit') ||
                    (payment.paymentType && payment.paymentType == 'credit' && isPaymentGatewayEnabled) ||
                    (payment.paymentType && payment.paymentType == 'clover-pos' && 
                    cloverSettings.isConnected &&
                    cloverSettings.device ) "
                
                >
                  <button
                    type="button"
                    class="btn btn-primary mr-1 w-full btn-lg"
                    :class="{ disable: showLoadingIcon }"
                    :disabled="showLoadingIcon || payment.amount > dueAmount || dueAmount <= 0"
                    @click="savePayment"
                  >
                    <span v-if="!showLoadingIcon">Add Payment</span>
                    <LoadingIcon
                      icon="oval"
                      color="white"
                      class="w-5 h-5"
                      v-if="showLoadingIcon"
                    />
                  </button>
                </div>
                <!-- END: Modal Footer -->
              </form>


            </div>
          </div>

        </Dialog.Description>

    </Dialog.Panel>
    </div>
    </div>
   </Dialog>   
</template>

<script setup>
import { onMounted, ref,watch } from "vue";
import { usePayment } from "@/compositions/payment/index";
import { useUtils } from "@/compositions/utils"
import Nav from "./nav.vue";
import Loader from "./loader.vue";
import SuccessLoader from "./success.vue";
import RemainingBalance from "./remaining-balance.vue";
import  Dialog  from "@/components/Headless/Dialog";

  const props   = defineProps(["invoiceId"])
  const {
    formTitle,
    init,
    payment,
    savePayment,
    closeModal,
    cardNumberInput,
    cardExpiryInput,
    cardCvvInput,
    formattedCardNumber,
    formattedExpiry,
    validateManualPayment: vmp,
    validateCreditCard: vcc,
    validateCloverPos: vcp,
    showLoadingIcon,
    showPaymentForm,
    dueAmount,
    isOpenPaymentModal
  } = usePayment();

  const { cloverSettings,isPaymentGatewayEnabled } = useUtils()
  const r = (name) => { closeModal(); router.push({ 'name' : name}) }

  watch([props],() =>{    
    payment.value.invoiceId = props.invoiceId;
  })

  onMounted(() => {
    init();
  });
</script>
