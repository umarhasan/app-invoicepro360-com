<template>
  <div>
    <onboarding-skeleton v-if="!isSetup"></onboarding-skeleton>

    <div class="container px-10" v-if="isSetup">
      <div class="w-full mx-auto">
        <a href="" class="pt-5 flex justify-center">
          <img
            alt="Invoice Pro 360"
            class="w-6"
            src="@/assets/images/invoice-logo.png"
          />
          <span class="text-theme-1 text-3xl ml-3">
            Invoice Pro <span class="font-medium">360</span>
          </span>
        </a>
      </div>
      <!-- BEGIN: Login Form -->

      <div class="flex">
        <div class="mx-auto my-10 box p-8 w-full sm:w-3/4 lg:w-3/5">
          <h2 class="text-2xl text-center text-theme-1">Setup Your Business Details</h2>
          <div class="mt-2 text-gray-500 text-center">
            setup your business to create invoice.
          </div>

          <form @submit.prevent="submit">
            <div class="sm:grid grid-cols-1 gap-6 mt-5">
              <div>
                <input
                  v-model="business.companyName"
                  type="text"
                  class="yr-form-control form-control"
                  placeholder="Business name"
                  :class="{ error: validate.companyName.$error }"
                />
                <div
                  v-if="
                    validate.companyName.required.$invalid && validate.companyName.$dirty
                  "
                  class="text-theme-6 mt-1"
                >
                  {{ validate.companyName.required.$message }}
                </div>
              </div>
            </div>

            <div class="sm:grid grid-cols-2 gap-6 mt-5">
              <div>
                <div>
                  <TomSelect class="w-full" v-model="business.companyType"                                        
                    :class="{ error: validate.companyType.$error }">
                    <option v-for="ct in companyTypes" :key="ct.value" :value="ct.value">
                      {{ ct.label }}
                    </option>
                  </TomSelect>
                </div>
                <div
                  v-if="
                    validate.companyType.required.$invalid && validate.companyType.$dirty
                  "
                  class="text-theme-6 mt-1"
                >
                  {{ validate.companyType.required.$message }}
                </div>
              </div>
              <div class="">
                <div>
                  <TomSelect v-model="business.businessType" class="w-full"
                    :class="{ error: validate.businessType.$error }"
                  >
                    <option v-for="bt in businessTypes" :key="bt.value" :value="bt.value">
                      {{ bt.label }}
                    </option>
                  </TomSelect>
                </div>
                <div
                  v-if="
                    validate.businessType.required.$invalid &&
                    validate.businessType.$dirty
                  "
                  class="text-theme-6 mt-1"
                >
                  {{ validate.businessType.required.$message }}
                </div>
              </div>
            </div>

            <div class="sm:grid grid-cols-2 gap-6 mt-5">
              <div>
                <input
                  v-model="business.addressLine1"
                  type="text"
                  class="yr-form-control form-control"
                  placeholder="Business address"
                  :class="{
                    error: validate.addressLine1.$error,
                  }"
                />
                <div
                  v-if="
                    validate.addressLine1.required.$invalid &&
                    validate.addressLine1.$dirty
                  "
                  class="text-theme-6 mt-1"
                >
                  {{ validate.addressLine1.required.$message }}
                </div>
              </div>
              <div>
                <input
                  v-model="business.addressLine2"
                  type="text"
                  class="yr-form-control form-control"
                  placeholder="Address 2 (optional)"
                />
              </div>
            </div>

            <div class="sm:grid grid-cols-2 gap-6 mt-5">
              <div class="">
                <div>
                  <TomSelect v-model="business.country" :class="{ error: validate.country.$error }"
                  >
                    <option value="">Select Country</option>
                    <option
                      v-for="(country, key) in countries"
                      :key="key"
                      :value="country.code"
                    >
                      {{ country.name }}
                    </option>
                  </TomSelect>
                </div>
                <div
                  v-if="validate.country.required.$invalid && validate.country.$dirty"
                  class="text-theme-6 mt-1"
                >
                  {{ validate.country.required.$message }}
                </div>
              </div>

              <div class="">
                <div>
                  <TomSelect
                    v-model="business.state"
                    :options="{
                      search: true,
                      classNames: 'w-full',
                      placeholder: 'Select State',
                    }"
                    :class="{ error: validate.country.$error }"
                  >
                    <option
                      v-for="state in holdStates"
                      :key="state.id"
                      :value="state.state_code"
                    >
                      {{ state.name }}
                    </option>
                  </TomSelect>
                </div>

                <div
                  v-if="validate.state.required.$invalid && validate.state.$dirty"
                  class="text-theme-6 mt-1"
                >
                  {{ validate.state.required.$message }}
                </div>
              </div>
            </div>

            <div class="sm:grid grid-cols-3 gap-6 mt-5">
              <div>
                <input
                  v-model="business.city"
                  type="text"
                  class="yr-form-control form-control"
                  placeholder="City"
                  :class="{ error: validate.city.$error }"
                />
                <div
                  v-if="validate.city.required.$invalid && validate.city.$dirty"
                  class="text-theme-6 mt-1"
                >
                  {{ validate.city.required.$message }}
                </div>
              </div>

              <div>
                <input
                  v-model="business.zipcode"
                  type="text"
                  class="yr-form-control form-control"
                  placeholder="Zip Code"
                  :class="{ error: validate.zipcode.$error }"
                />
                <div
                  v-if="validate.zipcode.required.$invalid && validate.zipcode.$dirty"
                  class="text-theme-6 mt-1"
                >
                  {{ validate.zipcode.required.$message }}
                </div>
              </div>

              <div>
                <input
                  v-model="business.fax"
                  type="text"
                  class="yr-form-control form-control"
                  placeholder="Fax"
                />
              </div>
            </div>

            <div class="sm:grid grid-cols-3 gap-6 mt-5">
              <div >
                
                <VueTelInput 
                    id="mobile-number" 
                    v-model="business.mobileNumber" 
                    :autoFormat="true" 
                    :default-country="''"
                    :showSearchBox="true" 
                    :inputOptions="{ placeholder: '(999) 999-999' }" 
                    :class="{ error: validate.mobileNumber.$error}"/>
                  
                  <div class="text-theme-6 mt-1"
                  v-if="
                    validate.mobileNumber.required.$invalid &&
                    validate.mobileNumber.$dirty">
                    {{ validate.mobileNumber.required.$message }}
                  </div>
                </div>

              <div>                
                <VueTelInput 
                    id="phone-number" 
                    v-model="business.phoneNumber" 
                    :autoFormat="true"
                    :default-country="''"
                    :showSearchBox="true" 
                    :inputOptions="{ placeholder: '(999) 999-999' }" />
              </div>

              <div>
                <input
                  v-model="business.website"
                  type="text"
                  class="form-control yr-form-control"
                  placeholder="Website URL"
                />
              </div>
            </div>

            <div class="mt-4 w-64">
              <button
                class="btn btn-primary-auth"
                :class="{ disable: showLoadingIcon }"
                :disabled="showLoadingIcon"
              >
                <span v-if="!showLoadingIcon">Create Business</span>

                <LoadingIcon
                  icon="oval"
                  color="white"
                  class="w-7 h-7"
                  v-if="showLoadingIcon"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- END: Form -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, watchEffect, computed } from "vue";
import { saveBusiness } from "@/compositions/business";
import { useUtils } from "@/compositions/utils";
import OnboardingSkeleton from "./OnBoardingSkeleton.vue";

    const {
      countries,
      states,
      businesses,
      isSetup,
      isBusinessLoaded,
    } = useUtils();

    const {
      business,
      showLoadingIcon,
      submit,
      validate,
      businessTypes,
      companyTypes,
    } = saveBusiness("dashboard");

    onMounted(() => {
      document.body.classList.remove("main",'error-page')
      document.body.classList.add('login')
    });

    const holdStates = computed(() => {
      if (!states.value) return;
      return states.value.filter((st) => st.country_code == business.value.country);
    });

    watchEffect(
      () => {
        return isBusinessLoaded.value;
      },
      () => {
        // console.log("Onboarding business count" + businesses.value.length)
        if (businesses.value.length > 0) router.push({ name: "dashboard" });
      }
    );

    watchEffect(() => {
      return business.value.country;
    }, holdStates);
    
</script>