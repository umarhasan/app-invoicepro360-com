<template>
  <SettingLayout current-tab="profile">
    <div class="alert alert-danger-soft show mb-2" v-if="validationErrors">
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

    <SuccessAlert v-if="isSaved">
      {{ alertMessage }}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="
          () => {
            isSaved = false;
          }
        "
      >
        <Lucide icon="X" class="w-4 h-4" />
      </button>
    </SuccessAlert>

    <div class="box p-5">
      <div class="flex items-center">
        <h2 class="font-medium text-2xl">Personal Information</h2>
      </div>
      <div class="pt-5">
        <form method="POST" @submit.prevent="updateProfile()">
          <div class="sm:grid grid-cols-2 gap-6">
            <div>
              <label for="username" class="text-normal font-medium text-gray-700"
                >Username</label
              >
              <input
                v-model="user.username"
                type="text"
                class="form-control yr-form-control"
                placeholder="Username"
                :class="{
                  error: validate.username.$error,
                }"
              />
              <div
                v-if="validate.username.required.$invalid && validate.username.$dirty"
                class="text-theme-6 mt-2"
              >
                Username is required
              </div>
            </div>
            <div>
              <label for="email" class="text-normal font-medium text-gray-700"
                >Email</label
              >
              <input
                v-model="user.email"
                type="text"
                class="form-control yr-form-control"
                placeholder="Last name"
                :class="{
                  error: validate.email.$error,
                }"
              />
              <div
                v-if="validate.email.required.$invalid && validate.email.$dirty"
                class="text-theme-6 mt-2"
              >
                Email is required
              </div>
            </div>
          </div>

          <div class="sm:grid grid-cols-2 gap-6 mt-5">
            <div>
              <label for="first_name" class="text-normal font-medium text-gray-700"
                >First Name</label
              >
              <input
                v-model="user.firstName"
                type="text"
                class="form-control yr-form-control"
                placeholder="First name"
                :class="{
                  error: validate.firstName.$error,
                }"
              />
              <div
                v-if="validate.firstName.required.$invalid && validate.firstName.$dirty"
                class="text-theme-6 mt-2"
              >
                First name is required
              </div>
            </div>
            <div>
              <label for="last_name" class="text-normal font-medium text-gray-700"
                >Last Name</label
              >
              <input
                v-model="user.lastName"
                type="text"
                class="form-control yr-form-control"
                placeholder="Last name"
                :class="{
                  error: validate.lastName.$error,
                }"
              />
              <div
                v-if="validate.lastName.required.$invalid && validate.lastName.$dirty"
                class="text-theme-6 mt-2"
              >
                Last name is required
              </div>
            </div>
          </div>

          <div class="sm:grid grid-cols-2 gap-6 mt-5">
            <div>
              <label for="country" class="text-normal font-medium text-gray-700"
                >Country</label
              >
              <TomSelect
                v-model="user.country"
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

              <div
                v-if="validate.country.required.$invalid && validate.country.$dirty"
                class="text-theme-6 mt-2"
              >
                Country is required
              </div>
            </div>

            <div>
              <label for="state" class="text-normal font-medium text-gray-700">State</label>
              <TomSelect
                v-model="user.state"
                :options="{
                  search: true,
                  classNames: 'w-full',
                }">
                <option
                  v-for="state in holdStates"
                  :key="state.id"
                  :value="state.state_code">
                  {{ state.name }}
                </option>
              </TomSelect>
            </div>
          </div>

          <div class="sm:grid grid-cols-2 gap-6 mt-5">
            <div>
              <label for="city" class="text-normal font-medium text-gray-700">City</label>
              <input
                v-model="user.city"
                type="text"
                class="form-control yr-form-control"
                placeholder="City"
              />
            </div>

            <div>
              <label for="zip-code" class="text-normal font-medium text-gray-700">
                Zip Code
              </label>
              <input
                v-model="user.zipCode"
                type="text"
                class="form-control yr-form-control"
                placeholder="Zip Code"
              />
            </div>
          </div>

          <div class="sm:grid grid-cols-2 gap-6 mt-5">
            <div>
              <label for="mobile-number" class="text-normal font-medium text-gray-700">Mobile Number</label>
              <vue-tel-input
                id="profile-mobile-number"
                v-model="user.mobileNumber"
                :autoFormat="true"
                :inputOptions="{ placeholder: '(999) 999-999' }"
                @on-input="mobileNumberUpdate"
                :class="{ error: validate.mobileNumber.$error}"
              ></vue-tel-input>

              <div
                v-if="
                  (validate.mobileNumber.required.$invalid &&
                    validate.mobileNumber.$dirty) ||
                  !isMobileNumberValid
                "
                class="text-theme-6 mt-2">
                Mobile number is invalid
              </div>
            </div>

            <div>
              <label for="phone-number" class="text-normal font-medium text-gray-700"
                >Phone Number</label>
              <VueTelInput
                id="profile-phone-number"
                v-model="user.phoneNumber"
                :default-country="'us'"
                :showSearchBox="true"
                :inputOptions="{ placeholder: '(999) 999-999' }"
                @on-input="phoneNumberUpdate"
              />
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary px-5 mt-5 tracking-wider"
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
        </form>
      </div>
    </div>
  </SettingLayout>
</template>

<script>
import { computed, watchEffect,watch } from "vue";

import SettingLayout from "../settings/Setting-layout.vue";
import { saveProfile } from "@/compositions/profile";
export default {
  name: "EditProfile",
  components: {
    SettingLayout,
  },
  setup() {
    const {
      user,
      countries,
      states,
      updateProfile,
      validate,
      validationErrors,
      showLoadingIcon,
      isSaved,
      alertMessage,
      phoneNumberUpdate,
      mobileNumberUpdate,
      isMobileNumberValid,
      isPhoneNumberValid,
      showNotification,
    } = saveProfile();

    watch(isSaved, () => {
      if (isSaved.value) showNotification();
    });

    const holdStates = computed(() => {
      return states.value.filter((st) => st.country_code == user.value.country);
    });

    watchEffect(() => {
      return user.value.country;
    }, holdStates);

    return {
      holdStates,
      user,
      states,
      countries,
      updateProfile,
      validate,
      validationErrors,
      showLoadingIcon,
      isSaved,
      alertMessage,
      phoneNumberUpdate,
      mobileNumberUpdate,
      isMobileNumberValid,
      isPhoneNumberValid,
    };
  },
};
</script>

