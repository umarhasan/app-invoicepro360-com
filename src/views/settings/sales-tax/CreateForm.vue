<template>
  <SettingLayout current-tab="sales-tax">
    <div class="box p-5">
      
      <div class="flex pb-5">
        <h2 class="text-2xl text-gray-700 tracking-wide font-bold">{{ formTitle }}</h2>
      </div>
      <form @submit.prevent="submit">
        <!-- Sales Tax fields -->
        <div class="sm:grid grid-cols-3 gap-5">
          <div>
            <label class="form-label font-medium text-gray-700 mb-1 block">
              Tax Name <span class="text-red-700">*</span>
            </label>
            <input v-model="salesTax.taxName"
              type="text"
              class="form-control yr-form-control"
              placeholder="Tax name"
              :class="{ error: validate.taxName.$error && validate.taxName.$dirty }"
              @blur="validate.taxName.$touch()"
            />
            <div v-if="validate.taxName.required.$invalid && validate.taxName.$dirty" class="text-theme-6 mt-2">
              Tax Name is required.
            </div>
            <div v-if="validate.taxName.unique.$invalid && validate.taxName.$dirty" class="text-theme-6 mt-2">
              Tax Name already exists.
            </div>
          </div>

          <div>
            <label class="form-label font-medium text-gray-700 mb-1 block">
              Abbreviation <span class="text-red-700">*</span>
            </label>
            <input
              v-model="salesTax.taxAbbreviation"
              type="text"
              class="form-control yr-form-control"
              placeholder="Abbr."
              :class="{ error: validate.taxAbbreviation.$error }"
            />
            <div v-if="validate.taxAbbreviation.required.$invalid && validate.taxAbbreviation.$dirty" class="text-theme-6 mt-2">
              Tax Abbreviation is required.
            </div>
          </div>

          <div>
            <label class="form-label font-medium text-gray-700 mb-1 block">
              Account Number
            </label>
            <input
              v-model="salesTax.taxNumber"
              type="text"
              class="form-control yr-form-control"
              placeholder="Tax number"
            />
          </div>
        </div>

        <div class="mt-5">
          <label class="form-label font-medium text-gray-700 mb-1 block">
            Description
          </label>
          <textarea
            v-model="salesTax.taxDescription"
            cols="25"
            rows="3"
            class="form-control yr-form-control"
            placeholder="Tax Info"
          ></textarea>
        </div>

        <!-- Tax Items Section -->
        <TaxItems :items="taxItems" :validateTaxItems="validateTaxItems" />

        <div class="flex justify-between mt-5">
          <div>
            <button
              type="submit"
              class="btn btn-primary px-5 mr-3 tracking-wider"
              :class="{ disable: showLoadingIcon }"
              :disabled="showLoadingIcon"
            >
              <span v-if="!showLoadingIcon">Save</span>
              <LoadingIcon
                v-if="showLoadingIcon"
                icon="oval"
                color="white"
                class="w-5 h-5"
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
          <div
            class="text-primary font-bold text-xl leading-9"
            v-html="$h.formatAmount(salesTax.taxRate, false)+ '% '"
          ></div>
        </div>
      </form>
    </div>
  </SettingLayout>
</template>

<script>
import { onMounted, ref } from "vue";
import SettingLayout from "../Setting-layout.vue";
import TaxItems from "./items/Main.vue";
import { readTax, saveTax } from "@/compositions/settings/sales-tax";

export default {
  components: {
    SettingLayout,
    TaxItems,
  },
  setup() {
    const formTitle = ref("Add Sales Tax");
    const {
      salesTax,
      submit,
      validate,
      validateTaxItems,
      showLoadingIcon,
      validationErrors,
      taxItems,
    } = saveTax();

    onMounted(() => {
      salesTax.value.id = null;
      salesTax.value.taxName = "";
      salesTax.value.taxAbbreviation = "";
      salesTax.value.taxDescription = "";
      salesTax.value.taxNumber = "";
      salesTax.value.taxRate = 0.0;
      taxItems.value = [];

      if (router.currentRoute.value.name === "edit-sales-tax") {
        formTitle.value = "Edit Sales Tax";
        readTax(router.currentRoute.value.params.tax_id);
      }
    });

    const goBack = () => {
      router.push({ name: "sales-tax" });
    };

    return {
      formTitle,
      validate,
      salesTax,
      taxItems,
      submit,
      showLoadingIcon,
      validationErrors,
      goBack,
      validateTaxItems,
    };
  },
};
</script>