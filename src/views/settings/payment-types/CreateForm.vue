<template>
  <SettingLayout current-tab="payment-types">
    <div class="box p-5">
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
      <div class="flex pb-5">
        <h2 class="text-2xl text-gray-700 tracking-wide font-bold">{{ formTitle }}</h2>
      </div>
      <form @submit.prevent="submit()">
        <div class="pb-5">
          <div class="sm:grid grid-cols-2 gap-5">
            <div>
              <label
                for="tax-name"
                class="form-label font-medium text-gray-700 mb-1 block"
              >
                Name <span class="text-red-700">*</span>
              </label>
              <input
                v-model="paymentTypes.name"
                type="text"
                class="form-control yr-form-control"
                placeholder="Name"
                :class="{ error: validate.name.$error }"
              />

              <div
                v-if="validate.name.required.$invalid && validate.name.$dirty"
                class="text-theme-6 mt-2"
              >
                Name is required
              </div>
            </div>
          </div>

          <div class="mt-5">
            <label
              for="tax-description"
              class="form-label font-medium text-gray-700 mb-1 block"
              >Description</label
            >
            <input
              v-model="paymentTypes.description"
              type="text"
              class="form-control yr-form-control"
              placeholder="Description"
            />
          </div>
        </div>

        <!-- Line Item -->
        <CustomFields :items="paymentTypes.custom_fields" />
        <!-- Line Item -->

        <div class="flex justify-between">
          <div>
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
        </div>
      </form>
    </div>
  </SettingLayout>
</template>

<script>
import {
  readPaymentTypes,
  savePaymentTypes,
} from "@/compositions/settings/payment-types";
import { onMounted, ref } from "vue";
import SettingLayout from "../Setting-layout.vue";
import CustomFields from "./custom-fields/Main.vue";

export default {
  components: {
    SettingLayout,
    CustomFields,
  },
  setup() {
    const formTitle = ref("Add Payment Types");
    const {
      paymentTypes,
      submit,
      validate,
      isSaved,
      isDeleted,
      showLoadingIcon,
      validationErrors,
      resetForm,
      error,
      status,
    } = savePaymentTypes();

    onMounted(() => {
      if (router.currentRoute.value.name == "edit-payment-types") {
        readPaymentTypes(router.currentRoute.value.params.type_id);
      } else {
        resetForm();
      }
    });

    const goBack = () => {
      router.push({ name: "payment-types" });
    };

    return {
      formTitle,
      validate,
      paymentTypes,
      submit,
      isSaved,
      isDeleted,
      showLoadingIcon,
      validationErrors,
      goBack,
    };
  },
};
</script>
