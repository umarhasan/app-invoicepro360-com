<template>
  <SettingLayout current-tab="businesses">
    <div class="box p-5">
      <div class="flex items-center">
        <h2 class="font-medium text-2xl">
          {{ formTitle }}
        </h2>
      </div>

      <div class="alert alert-danger-soft show my-2" v-if="validationErrors">
        <ul>
          <li v-for="(err, index) in validationErrors" :key="index">
            {{ err }}
          </li>
        </ul>
        <button
          type="button"
          class="absolute right-2 top-2 bg-white px-2 py-1 rounded"
          @click="validationErrors = null"
        >
          <Lucide icon="X" class="w-4 h-4" />
        </button>
      </div>
      <div class="py-5">
        <form method="POST" @submit.prevent="submit()">
          <div class="sm:grid grid-cols-3 gap-6">
            <div class="mb-2 sm:mb-0">
              <label for="company-name" class="yr-label hidden">Company Name</label>
              <input
                v-model="business.companyName"
                type="text"
                class="form-control yr-form-control sm:mb-2"
                placeholder="Company name"
                :class="{
                  error: validate.companyName.$error,
                }"
              />
              <div
                v-if="
                  validate.companyName.required.$invalid && validate.companyName.$dirty
                "
                class="text-theme-6 mt-2"
              >
                {{ validate.companyName.required.$message }}
              </div>
            </div>

            <div class="mb-2 sm:mb-0">
              <label for="company-type" class="yr-label hidden">Company Type</label>
              <TomSelect
                v-model="business.companyType"
                :options="{
                  search: true,
                  classNames: 'w-full',
                  placeholder: 'Select Company Type',
                }"
                :class="{ error: validate.companyType.$error }"
              >
                <option v-for="(ct, key) in companyTypes" :key="ct.key" :value="ct.value">
                  {{ ct.label }}
                </option>
              </TomSelect>

              <div
                v-if="
                  validate.companyType.required.$invalid && validate.companyType.$dirty
                "
                class="text-theme-6 mt-2"
              >
                {{ validate.companyType.required.$message }}
              </div>
            </div>

            <div class="mb-2 sm:mb-0">
              <label for="business-type" class="yr-label hidden">Business Type</label>
              <TomSelect
                v-model="business.businessType"
                :options="{
                  search: true,
                  classNames: 'w-full',
                  placeholder: 'Select Business Type',
                }"
                :class="{ error: validate.companyType.$error }"
              >
                <option
                  v-for="(bt, key) in businessTypes"
                  :key="bt.key"
                  :value="bt.value"
                >
                  {{ bt.label }}
                </option>
              </TomSelect>
              <div
                v-if="
                  validate.businessType.required.$invalid && validate.businessType.$dirty
                "
                class="text-theme-6 mt-2"
              >
                {{ validate.businessType.required.$message }}
              </div>
            </div>
          </div>

          <div class="sm:grid grid-cols-2 gap-6 sm:mt-5">
            <div class="mb-2 sm:mb-0">
              <label for="address-line1" class="yr-label hidden">Address Line 1</label>
              <input
                v-model="business.addressLine1"
                type="text"
                class="form-control yr-form-control"
                placeholder="Business address"
                :class="{
                  error: validate.addressLine1.$error,
                }"
              />
              <div
                v-if="
                  validate.addressLine1.required.$invalid && validate.addressLine1.$dirty
                "
                class="text-theme-6 mt-2"
              >
                {{ validate.addressLine1.required.$message }}
              </div>
            </div>
            <div class="mb-2 sm:mb-0">
              <label for="address-line2" class="yr-label hidden">Address Line 2</label>
              <input
                v-model="business.addressLine2"
                type="text"
                class="form-control yr-form-control"
                placeholder="Business address 2"
              />
            </div>
          </div>

          <div class="sm:grid grid-cols-2 gap-6 sm:mt-5">
            <div class="mb-2 sm:mb-0">
              <label for="country" class="yr-label hidden">Country</label>
              <TomSelect
                v-model="business.country"
                :options="{
                  search: true,
                  classNames: 'w-full',
                  placeholder: 'Select Country',
                }"
                :class="{ error: validate.country.$error }"
              >
                <option
                  v-for="(country, key) in countries"
                  :key="key"
                  :value="country.code"
                >
                  {{ country.name }}
                </option>
              </TomSelect>

              <div
                v-if="validate.country.required.$invalid && validate.country.$dirty"
                class="text-theme-6 mt-2"
              >
                {{ validate.country.required.$message }}
              </div>
            </div>

            <div class="mb-2 sm:mb-0">
              <label for="state" class="yr-label hidden">State</label>
              <TomSelect
                v-model="business.state"
                :options="{
                  search: true,
                  classNames: 'w-full',
                  placeholder: 'Select State',
                }"
                :class="{ error: validate.state.$error }"
              >
                <option
                  v-for="state in holdStates"
                  :key="state.id"
                  :value="state.state_code"
                >
                  {{ state.name }}
                </option>
              </TomSelect>
              <div
                v-if="validate.state.required.$invalid && validate.state.$dirty"
                class="text-theme-6 mt-2"
              >
                {{ validate.state.required.$message }}
              </div>
            </div>
          </div>

          <div class="sm:grid grid-cols-3 gap-6 sm:mt-5">
            <div class="mb-2 sm:mb-0">
              <label for="city" class="yr-label hidden">City</label>
              <input
                v-model="business.city"
                type="city"
                class="form-control yr-form-control"
                placeholder="City"
                :class="{ error: validate.city.$error }"
              />
              <div
                v-if="validate.city.required.$invalid && validate.city.$dirty"
                class="text-theme-6 mt-2"
              >
                {{ validate.city.required.$message }}
              </div>
            </div>

            <div class="mb-2 sm:mb-0">
              <label for="zip-code" class="yr-label hidden">Zip Code</label>
              <input
                v-model="business.zipcode"
                type="text"
                class="form-control yr-form-control"
                placeholder="Zip Code"
                :class="{ error: validate.zipcode.$error }"
              />

              <div
                v-if="validate.zipcode.required.$invalid && validate.zipcode.$dirty"
                class="text-theme-6 mt-2"
              >
                {{ validate.zipcode.required.$message }}
              </div>
            </div>

            <div class="mb-2 sm:mb-0">
              <label for="fax" class="yr-label hidden">Fax </label>
              <input
                v-model="business.fax"
                type="text"
                class="form-control yr-form-control"
                placeholder="Fax"
              />
            </div>
          </div>

          <div class="sm:grid grid-cols-3 gap-6 sm:mt-5">
            <div class="mb-2 sm:mb-0">
              <label for="mobile-number" class="yr-label hidden">Mobile Number</label>
              <vue-tel-input
                id="mobile-number"
                v-model="business.mobileNumber"
                :autoFormat="true"
                :inputOptions="{ placeholder: '(999) 999-999' }"                
                :class="{ error: validate.mobileNumber.$error}"
              ></vue-tel-input>
              <div
                v-if="
                  (validate.mobileNumber.required.$invalid &&
                    validate.mobileNumber.$dirty) 
                "
                class="text-theme-6 mt-2"
              >
              {{ validate.mobileNumber.required.$message }}
              </div>
            </div>

            <div class="mb-2 sm:mb-0">
              <label for="phone-number" class="yr-label hidden">Phone Number</label>              
              <vue-tel-input
                id="phone-number"
                v-model="business.phoneNumber"
                :autoFormat="true"
                :inputOptions="{ placeholder: '(999) 999-999' }"
              ></vue-tel-input>
            </div>

            <div class="mb-2 sm:mb-0">
              <label for="website" class="yr-label hidden">Website</label>
              <input
                v-model="business.website"
                type="text"
                class="form-control yr-form-control"
                placeholder="Website url"
              />
            </div>
          </div>

          <div class="mt-5">
            <button
              type="submit"
              class="btn btn-primary px-5 mr-3 tracking-wider"
              :class="{ disable: showLoadingIcon }"
              :disabled="showLoadingIcon"
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
              class="btn btn-default px-5 tracking-wider"
              @click="goBack"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </SettingLayout>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { saveBusiness, readBusiness } from "@/compositions/business";
import SettingLayout from "../../settings/Setting-layout.vue";
export default {
  components: {
    SettingLayout,
  },
  setup() {
    const formTitle = ref("Add new business");

    const {
      business_id,
      business,
      showLoadingIcon,
      validationErrors,
      isSaved,
      submit,
      validate,
      countries,
      states,
      businessTypes,
      companyTypes,
      currencies,
    } = saveBusiness();

    const holdStates = computed(() => {
      return states.value.filter((st) => st.country_code == business.value.country);
    });

    watch(() => {
      return business.value.country;
    }, holdStates);

    onMounted(async () => {
      isSaved.value = false;

      if (router.currentRoute.value.name == "edit-businesses") {
        formTitle.value = "Edit Business";
        const holdBusiness = await readBusiness(
          router.currentRoute.value.params.business_id
        );
        business_id.value = holdBusiness.id;
        business.value.companyName = holdBusiness.companyName;
        business.value.companyType = holdBusiness.companyType;
        business.value.businessType = holdBusiness.businessType;
        business.value.addressLine1 = holdBusiness.addressLine1;
        business.value.addressLine2 = holdBusiness.addressLine2;
        business.value.country = holdBusiness.country;
        business.value.state = holdBusiness.state;
        business.value.city = holdBusiness.city;
        business.value.zipcode = holdBusiness.zipcode;
        business.value.fax = holdBusiness.fax;
        business.value.mobileNumber = holdBusiness.mobileNumber;
        business.value.phoneNumber = holdBusiness.phoneNumber;
        business.value.website = holdBusiness.website;
      }
    });

    const goBack = () => {
      router.push({ name: "businesses" });
    };

    return {
      formTitle,
      business_id,
      business,
      showLoadingIcon,
      validationErrors,
      submit,
      validate,
      countries,
      holdStates,
      goBack,
      businessTypes,
      companyTypes,
      currencies,
    };
  },
};
</script>
