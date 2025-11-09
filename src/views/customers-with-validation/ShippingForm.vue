<template>
  <div class="shipping-section">
    <div class="flex items-center mt-5 my-2">
      <h2 class="font-medium text-xl mr-auto">Shipping Address</h2>
      <div class="">
        <label
          class="yr-checkbox"
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
              @change="$emit('sameAsBillingAddress')"
            />
            <svg viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z" /></svg>
          </div>
          <div class="select-none">Same as Billing</div>
        </label>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-x-5 gap-y-2 px-0 pb-5 border-b border-gray-200">
      <div class="col-span-6">
        <label for="shipping-address-line-1" class="form-label"
          >Address Line 1 <span class="text-theme-6">*</span></label
        >
        <input
          v-model="customer.shipping.addressLine1"
          type="text"
          class="form-control yr-form-control"
          placeholder="Address"
          :class="{ 'border-theme-6': vs$.shipping.addressLine1.$error }"
        />
        <div
          v-if="
            vs$.shipping.addressLine1.required.$invalid &&
            vs$.shipping.addressLine1.$dirty
          "
          class="text-theme-6 text-xs"
        >
          Shipping address is required
        </div>
      </div>

      <div class="col-span-6">
        <label for="shipping-address-line-2" class="form-label">Address Line 2</label>
        <input
          v-model="customer.shipping.addressLine2"
          type="text"
          class="form-control yr-form-control"
          placeholder="Address 2"
        />
      </div>

      <div
        class="col-span-6 select-control"
        :class="{ error: vs$.shipping.country.$error }"
      >
        <label for="shipping-country">Country <span class="text-theme-6">*</span></label>
        <div>
          <TomSelect
            v-model="customer.shipping.country"
            :options="{
              search: true,
              classNames: 'w-full',
            }"
          >
            <option>Select country</option>
            <option v-for="(country, key) in countries" :key="key" :value="country.code">
              {{ country.name }}
            </option>
          </TomSelect>
        </div>
        <div
          v-if="vs$.shipping.country.required.$invalid && vs$.shipping.country.$dirty"
          class="text-theme-6 text-xs"
        >
          Country is required
        </div>
      </div>

      <div
        class="col-span-6 select-control"
        :class="{ error: vs$.shipping.state.$error }"
      >
        <label for="shipping-states">States <span class="text-theme-6">*</span></label>
        <div>
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

        <div
          v-if="vs$.shipping.state.required.$invalid && vs$.shipping.state.$dirty"
          class="text-theme-6 text-xs"
        >
          State is required
        </div>
      </div>

      <div class="col-span-6">
        <label for="shipping-city" class="form-label"
          >City <span class="text-theme-6">*</span></label
        >
        <input
          v-model="customer.shipping.city"
          type="text"
          class="form-control yr-form-control"
          placeholder="City"
          :class="{
            'border-theme-6': vs$.shipping.city.$error,
          }"
        />
        <div
          v-if="vs$.shipping.city.required.$invalid && vs$.shipping.city.$dirty"
          class="text-theme-6 text-xs"
        >
          City is required
        </div>
      </div>

      <div class="col-span-6">
        <label for="shipping-zip-code" class="form-label"
          >Postal/Zip Code <span class="text-theme-6">*</span></label
        >
        <input
          v-model="customer.shipping.zipCode"
          type="text"
          class="form-control yr-form-control"
          placeholder=""
          :class="{
            'border-theme-6': vs$.shipping.zipCode.$error,
          }"
        />
        <div
          v-if="vs$.shipping.zipCode.required.$invalid && vs$.shipping.zipCode.$dirty"
          class="text-theme-6 text-xs"
        >
          zip Code is required
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watchEffect } from "vue";
export default {
  name: "ShippingForm",
  props: {
    customer: Object,
    vs: Object,
    countries: Object,
    states: Array,
  },
  emits: ["sameAsBillingAddress"],
  setup(props) {
    const customer = props.customer;
    const vs$ = props.vs;
    const countries = props.countries;
    const states = props.states;

    //computed property for dependent shipping states
    const shippingStates = computed(() => {
      return states.filter((st) => st.country_code == customer.shipping.country);
    });

    watchEffect(() => {
      return customer.shipping.country;
    }, shippingStates);

    return {
      customer,
      vs$,
      shippingStates,
      countries,
      states,
    };
  },
};
</script>
