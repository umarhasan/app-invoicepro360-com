<template>
    <Dialog size="lg" staticBackdrop :open="isOpen">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" ></div>

    <!-- Full-screen scrollable container -->
    <div class="fixed inset-0 w-screen overflow-y-auto">
      <!-- Container to center the panel -->
      <div class="flex min-h-full items-center justify-center p-4 dialog-scrolable">

      
    <Dialog.Panel>
        <form method="POST" @submit.prevent="submit">
        <Dialog.Title v-if="!showLoadingIcon">
          <h2 class="font-medium text-base mr-auto ">{{ formTitle }}</h2>
          <Lucide icon="X" class="w-8 h-8 cursor-pointer" @click="closeModal" />
        </Dialog.Title>
        <Dialog.Description class="p-2">
          <div class="p-0 bg-white">
            <div class="border-b">
              <ul class="flex" role="tablist">
                <li
                  id="contact-tab"
                  class="cursor-pointer text-base p-2 mx-3 text-gray-800"
                  :class="{
                    'border-theme-1 text-theme-1 border-b-4 font-bold': isContactActive,
                  }"
                  @click="
                    () => {
                      isContactActive = true;
                      isBillingActive = isShippingActive = false;
                    }
                  "
                >
                  Contact Information
                </li>

                <li
                  id="billing-tab"
                  class="cursor-pointer text-base p-2 mx-3 text-gray-800"
                  :class="{
                    'border-theme-1 text-theme-1 border-b-4 font-bold': isBillingActive,
                  }"
                  @click="
                    () => {
                      vc$.$touch();
                      if (vc$.$invalid) return;
                      isBillingActive = true;
                      isContactActive = isShippingActive = false;
                    }
                  "
                >
                  Billing
                </li>

                <li
                  id="shipping-tab"
                  class="cursor-pointer text-base p-2 mx-3 text-gray-800"
                  :class="{
                    'border-theme-1 text-theme-1 border-b-4 font-bold': isShippingActive,
                  }"
                  @click="
                    () => {
                      vc$.$touch();

                      if (vc$.$invalid) return;
                      isShippingActive = true;
                      isContactActive = isBillingActive = false;
                    }
                  "
                >
                  Shipping
                </li>
              </ul>
            </div>

            <div class="tab-content">
              <!-- CUSTOMER CONTACT -->
              <div id="contact" class="py-5 px-3" v-if="isContactActive">
                <div class="pb-2">
                  <h2 class="font-medium text-xl mr-auto truncate">Contact</h2>
                </div>
                
                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="customer"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      Customer <span class="text-theme-6">*</span>
                    </label>
                  </div>
                  <div class="md:w-3/4">
                    <input
                      v-model="customer.contact.customer"
                      type="text"
                      class="form-control"
                      :class="{ 'border-theme-6': vc$.customer.$error }"
                      placeholder="Person or Business name"
                    />
                    <div
                      v-if="vc$.customer.required.$invalid && vc$.customer.$dirty"
                      class="text-theme-6 text-xs"
                    >
                      Customer name is required
                    </div>
                  </div>
                </div>
                
                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="first-name"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      First Name
                    </label>
                  </div>
                  <div class="md:w-3/4">
                    <input
                      v-model="customer.contact.firstName"
                      type="text"
                      class="form-control"
                      placeholder="First Name"
                    />
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="last-name"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      Last Name
                    </label>
                  </div>
                  <div class="md:w-3/4">
                    <input
                      v-model="customer.contact.lastName"
                      type="text"
                      class="form-control"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="email"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      Email
                    </label>
                  </div>
                  <div class="md:w-3/4">
                    <input
                      v-model="customer.contact.email"
                      type="email"
                      class="form-control"
                      placeholder="Email"
                    />
                  </div>
                </div>

                <!-- Change Format -->
                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="phone-number"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                      >Phone Number
                    </label>
                  </div>
                  <div class="md:w-3/4">
                    <VueTelInput
                      v-model="customer.contact.phoneNumber"
                      type="tel"
                      class="form-control"
                      placeholder="Phone Number"
                      :autoFormat="true" 
                    default-country="us"
                    mode="international"
                    :inputOptions="{ showDialCode: true, placeholder: '+1 (999) 999-9999' }"/>
                    
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="mobile-number"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      Mobile Number
                    </label>
                  </div>
                  <div class="md:w-3/4">
                    <VueTelInput
                      v-model="customer.contact.mobileNumber"
                      type="tel"
                      class="form-control"
                      placeholder="Mobile Number"
                    :autoFormat="true" 
                    default-country="us"
                    mode="international"
                    :inputOptions="{ showDialCode: true, placeholder: '+1 (999) 999-9999' }"/>
                    
                  </div>
                </div>
                
                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="phone-number"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      Website
                    </label>
                  </div>
                  <div class="md:w-3/4">
                    <input
                      v-model="customer.contact.website"
                      type="text"
                      class="form-control"
                      placeholder="Website"
                    />
                  </div>
                </div>
              </div>
              <!-- CUSTOMER CONTACT -->

              <!-- CUSTOMER BILLING -->
              <div id="billing" class="p-5" v-if="isBillingActive">
                <div class="pb-2">
                  <h2 class="font-medium text-xl mr-auto truncate">Billing address</h2>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="billing-address-line1"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                      >Address Line 1
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <input
                      v-model="customer.billing.addressLine1"
                      type="text"
                      class="form-control"
                      placeholder="Address"
                    />
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="billing-address-line2"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      Address Line 2
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <input
                      v-model="customer.billing.addressLine2"
                      type="text"
                      class="form-control"
                      placeholder="Address 2"
                    />
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="billing-country"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      Country
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <TomSelect
                      v-model="customer.billing.country"
                      :options="{
                        search: true,
                        classNames: 'w-full',
                      }"
                    >
                      <option>Select country</option>
                      <option
                        v-for="(country, key) in countries"
                        :key="key"
                        :value="country.code"
                      >
                        {{ country.name }}
                      </option>
                    </TomSelect>
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="billing-state"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      State
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <TomSelect
                      v-model="customer.billing.state"
                      :options="{
                        search: true,
                        classNames: 'w-full',
                      }"
                    >
                      <option
                        v-for="state in billingStates"
                        :key="state.id"
                        :value="state.state_code"
                      >
                        {{ state.name }}
                      </option>
                    </TomSelect>
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="billing-city"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      City
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <input
                      v-model="customer.billing.city"
                      type="text"
                      class="form-control"
                      placeholder="City"
                    />
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="billing-zip-code"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      Postal/Zip Code
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <input
                      v-model="customer.billing.zipCode"
                      type="text"
                      class="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
              <!-- CUSTOMER BILLING -->

              <!-- CUSTOMER SHIPPING -->
              <div id="shipping" class="p-5" v-if="isShippingActive">
                <div class="pb-2 flex">
                  <h2 class="font-medium text-xl mr-auto truncate">Shipping address</h2>

                  <div class="">
                    <label
                      class="yr-checkbox font-medium text-normal"
                      :class="{
                        checked: customer.sameAsBilling,
                        unchecked: !customer.sameAsBilling,
                      }"
                    >
                      <div class="div-checkbox">
                        <input
                          type="checkbox"
                          class="opacity-0 absolute"
                          v-model="customer.sameAsBilling"
                          @change="sameAsBillingAddress"
                        />
                        <svg viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      </div>
                      <div class="select-none">Same as Billing</div>
                    </label>
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="shipping-name"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                      >Shipping Name
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <input
                      v-model="customer.shipping.name"
                      type="text"
                      class="form-control"
                      placeholder="Shipping Name"
                    />
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="shipping-phone-number"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                      >Shipping Phone Number
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <VueTelInput
                      v-model="customer.shipping.phoneNumber"
                      type="text"
                      class="form-control"
                      placeholder="Shipping Phone Number"
                      :autoFormat="true" 
                    default-country="us"
                    mode="international"
                    :inputOptions="{ showDialCode: true, placeholder: '+1 (999) 999-9999' }"/>
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="shipping-address-line1"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                      >Address Line 1
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <input
                      v-model="customer.shipping.addressLine1"
                      type="text"
                      class="form-control"
                      placeholder="Address"
                    />
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="shipping-address-line2"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      Address Line 2
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <input
                      v-model="customer.shipping.addressLine2"
                      type="text"
                      class="form-control"
                      placeholder="Address 2"
                    />
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="shipping-country"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      Country
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <TomSelect
                      v-model="customer.shipping.country"
                      :options="{
                        search: true,
                        classNames: 'w-full',
                      }"
                    >
                      <option>Select country</option>
                      <option
                        v-for="(country, key) in countries"
                        :key="key"
                        :value="country.code"
                      >
                        {{ country.name }}
                      </option>
                    </TomSelect>
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="shipping-state"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      State
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <TomSelect
                      v-model="customer.shipping.state"
                      :options="{
                        search: true,
                        classNames: 'w-full',
                      }"
                    >
                      <option
                        v-for="state in shippingStates"
                        :key="state.id"
                        :value="state.state_code"
                      >
                        {{ state.name }}
                      </option>
                    </TomSelect>
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="shipping-city"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      City
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <input
                      v-model="customer.shipping.city"
                      type="text"
                      class="form-control"
                      placeholder="City"
                    />
                  </div>
                </div>

                <div class="md:flex md:items-center mb-2">
                  <div class="md:w-1/3">
                    <label
                      for="shipping-zip-code"
                      class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >
                      Postal/Zip Code
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <input
                      v-model="customer.shipping.zipCode"
                      type="text"
                      class="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
              <!-- CUSTOMER SHIPPING -->
            </div>
          </div>        
      </Dialog.Description>
      <Dialog.Footer>
          <div class="modal-footer text-right">
            <button
              type="button"
              class="btn btn-primary w-20 mr-1"
              :class="{ disable: showLoadingIcon }"
              :disabled="showLoadingIcon"
              @click="submit"
            >
              <span v-if="!showLoadingIcon">Save</span>
              <LoadingIcon
                icon="oval"
                color="white"
                class="w-5 h-5"
                v-if="showLoadingIcon"
              />
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary w-20"
              @click="closeModal"
            >
              Cancel
            </button>
          </div>
      </Dialog.Footer>
    </form>
    </Dialog.Panel>
    </div>

    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {  ref, watchEffect,computed } from "vue";
import Dialog from "@/components/Headless/Dialog";
import { saveCustomer } from "@/compositions/customer";

  const props = defineProps(['isOpen']);
  const emits = defineEmits(['close','setBilledCustomer']);
  const formTitle = ref("Add/Edit Customer");
const {
  isContactActive,
  isBillingActive,
  isShippingActive,
  isOtherInfoActive,
  countries,
  states,
  customer,
  submit,
  vc$,
  showLoadingIcon,
  validationErrors,
  isSaved,
  sameAsBillingAddress,
}: {
  isContactActive: any,
  isBillingActive: any,
  isShippingActive: any,
  isOtherInfoActive: any,
  countries: any,
  states: any,
  customer: any,
  submit: any,
  vc$: any,
  showLoadingIcon: any,
  validationErrors: any,
  isSaved: any,
  sameAsBillingAddress: any,
} = saveCustomer("modal");


    // Use `any` to disable type checking
    const billingStates = computed<any>(() => {
      return states.value.filter(
        (st: any) => st.country_code === customer.value.billing.country
      );
    });

    const shippingStates = computed<any>(() => {
      return states.value.filter(
        (st: any) => st.country_code === customer.value.shipping.country
      );
    });

    const closeModal = () => {
      emits("close")
      showLoadingIcon.value = false;
    }

    watchEffect(() => {
      if (isSaved.value) {
        emits("setBilledCustomer");
        closeModal();
      }
    });


    // Watch for changes in billing country
    watchEffect(() => {
      // Automatically tracks `customer.value.billing.country` and updates when it changes
      const billingCountry = customer.value.billing.country;
      billingStates.value; // Trigger recomputation of billingStates

      // If you want to perform side-effects, do them here
      console.log(billingCountry); // For example, logging the billing country
    });

    // Watch for changes in shipping country
    watchEffect(() => {
      // Automatically tracks `customer.value.shipping.country` and updates when it changes
      const shippingCountry = customer.value.shipping.country;
      shippingStates.value; // Trigger recomputation of shippingStates

      // You can perform side-effects here as well
      console.log(shippingCountry); // For example, logging the shipping country
    });
    
</script>

