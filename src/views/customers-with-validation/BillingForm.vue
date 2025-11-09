<template>
  <div class="billing-section">
    <div class="flex items-center mt-5 my-2">
      <h2 class="font-medium text-xl mr-auto">Billing Address</h2>
    </div>
    <div class="grid grid-cols-12 gap-x-5 gap-y-2 px-0 pb-5 border-b border-gray-200">
      <div class="col-span-6">
        <label for="billing-address-line-2" class="form-label"
          >Address Line 1 <span class="text-theme-6">*</span></label
        >
        <input
          v-model="customer.billing.addressLine1"
          type="text"
          class="form-control yr-form-control"
          placeholder="Address"
          :class="{
            'border-theme-6': vb$.billing.addressLine1.$error,
          }"
        />
        <div
          v-if="
            vb$.billing.addressLine1.required.$invalid && vb$.billing.addressLine1.$dirty
          "
          class="text-theme-6 text-xs"
        >
          Billing address is required
        </div>
      </div>

      <div class="col-span-6">
        <label for="billing-address-line-2" class="form-label">Address Line 2</label>
        <input
          v-model="customer.billing.addressLine2"
          type="text"
          class="form-control yr-form-control"
          placeholder="Address 2"
        />
      </div>

      <div
        class="col-span-6 select-control"
        :class="{
          error: vb$.billing.country.$error,
        }"
      >
        <label for="billing-country">Country <span class="text-theme-6">*</span></label>
        <div>
          <TomSelect
            v-model="customer.billing.country"
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
          v-if="vb$.billing.country.required.$invalid && vb$.billing.country.$dirty"
          class="text-theme-6 text-xs"
        >
          Country is required
        </div>
      </div>

      <div class="col-span-6 select-control" :class="{ error: vb$.billing.state.$error }">
        <label for="billing-states">States <span class="text-theme-6">*</span></label>
        <div>
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
        <div
          v-if="vb$.billing.state.required.$invalid && vb$.billing.state.$dirty"
          class="text-theme-6 text-xs"
        >
          States is required
        </div>
      </div>

      <div class="col-span-6">
        <label for="billing-city" class="form-label"
          >City <span class="text-theme-6">*</span></label
        >
        <input
          v-model="customer.billing.city"
          type="text"
          class="form-control yr-form-control"
          placeholder="City"
          :class="{
            'border-theme-6': vb$.billing.city.$error,
          }"
        />
        <div
          v-if="vb$.billing.city.required.$invalid && vb$.billing.city.$dirty"
          class="text-theme-6 text-xs"
        >
          City is required
        </div>
      </div>

      <div class="col-span-6">
        <label for="billing-zip-code" class="form-label">
          Postal/Zip Code <span class="text-theme-6">*</span></label
        >
        <input
          v-model="customer.billing.zipCode"
          type="text"
          class="form-control yr-form-control"
          placeholder=""
          :class="{ 'border-theme-6': vb$.billing.zipCode.$error }"
        />

        <div
          v-if="vb$.billing.zipCode.required.$invalid && vb$.billing.zipCode.$dirty"
          class="text-theme-6 text-xs"
        >
          Zip code is required
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watchEffect } from "vue";
export default {
  name: "BillingForm",
  props: {
    customer: Object,
    vb: Object,
    countries: Object,
    states: Array,
  },
  setup(props) {
    const customer = props.customer;
    const vb$ = props.vb;
    const countries = props.countries;
    const states = props.states;

    //computed property for dependent billing states
    const billingStates = computed(() => {
      return states.filter((st) => st.country_code == customer.billing.country);
    });

    watchEffect(() => {
      return customer.billing.country;
    }, billingStates);

    return {
      customer,
      vb$,
      billingStates,
      countries,
      states,
    };
  },
};
</script>
