<template>
  <div
    id="sales-tax-modal"
    class="modal"
    data-backdrop="static"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <form method="POST" @submit.prevent="submit">
        <div class="modal-content">
          <!-- BEGIN: Modal Header -->
          <div class="modal-header">
            <h2 class="font-medium text-base mr-auto">{{ formTitle }}</h2>
            <Lucide icon="X" class="w-8 h-8 cursor-pointer" @click="closeModal" />
          </div>
          <!-- END: Modal Header -->
          <!-- BEGIN: Modal Body -->
          <div class="modal-body p-0 bg-white">
            <div class="alert alert-danger-soft show my-2" v-if="validationErrors">
              <ul>
                <li v-for="(err, index) in validationErrors" :key="index">{{ err }}</li>
              </ul>
              <button
                type="button"
                class="absolute right-2 top-2 bg-white px-2 py-1 rounded"
                @click="validationErrors = null"
              >
                <Lucide icon="X" class="w-4 h-4" />
              </button>
            </div>
            <div class="py-5 px-20">
              <div class="md:flex md:items-center mb-2">
                <div class="md:w-1/4">
                  <label
                    for="tax-name"
                    class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                  >
                    Tax Name <span class="text-theme-6">*</span>
                  </label>
                </div>

                <div class="md:w-3/4">
                  <input
                    v-model="salesTax.taxName"
                    type="text"
                    class="form-control yr-form-control"
                    :class="{
                      'border-theme-6 focus:border-theme-6': validate.taxName.$error,
                    }"
                    placeholder="Tax name"
                  />
                  <div
                    v-if="validate.taxName.required.$invalid && validate.taxName.$dirty"
                    class="text-theme-6 text-xs"
                  >
                    Tax Name is required
                  </div>
                </div>
              </div>
              <div class="md:flex md:items-center mb-2">
                <div class="md:w-1/4">
                  <label
                    for="tax-abbreviation"
                    class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                  >
                    Abbreviation <span class="text-theme-6">*</span>
                  </label>
                </div>
                <div class="md:w-3/4">
                  <input
                    v-model="salesTax.taxAbbreviation"
                    type="text"
                    class="form-control yr-form-control"
                    placeholder="Abbr."
                    :class="{
                      'border-theme-6 focus:border-theme-6':
                        validate.taxAbbreviation.$error,
                    }"
                  />
                  <div
                    v-if="
                      validate.taxAbbreviation.required.$invalid &&
                      validate.taxAbbreviation.$dirty
                    "
                    class="text-theme-6 text-xs"
                  >
                    Tax Abbreviation is required
                  </div>
                </div>
              </div>

              <div class="md:flex md:items-center mb-2">
                <div class="md:w-1/4">
                  <label
                    for="tax-description"
                    class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >Description
                  </label>
                </div>
                <div class="md:w-3/4">
                  <textarea
                    v-model="salesTax.taxDescription"
                    name="tax_description"
                    cols="25"
                    rows="3"
                    class="form-control yr-form-control"
                    placeholder="Tax Info"
                  ></textarea>
                </div>
              </div>

              <div class="md:flex md:items-center mb-2">
                <div class="md:w-1/4">
                  <label
                    for="tax-number"
                    class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                    >Tax Number
                  </label>
                </div>
                <div class="md:w-3/4">
                  <input
                    v-model="salesTax.taxNumber"
                    type="text"
                    class="form-control yr-form-control w-48"
                    placeholder="Tax number"
                  />
                </div>
              </div>

              <div class="md:flex md:items-center mb-2">
                <div class="md:w-1/4">
                  <label
                    for="tax-rate"
                    class="block font-medium text-gray-700 mb-1 md:mb-0 pr-4 md:text-right"
                  >
                    Tax Rate (%) <span class="text-theme-6">*</span>
                  </label>
                </div>
                <div class="md:w-3/4">
                  <input
                    v-model="salesTax.taxRate"
                    type="text"
                    class="form-control yr-form-control w-48"
                    placeholder="0.00"
                    :class="{
                      'border-theme-6 focus:border-theme-6': validate.taxRate.$error,
                    }"
                    v-decimal
                  />

                  <div
                    v-if="validate.taxRate.required.$invalid && validate.taxRate.$dirty"
                    class="text-theme-6 text-xs"
                  >
                    Tax Rate is required
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- END: Modal Body -->

          <!-- BEGIN: Modal Footer -->
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
          <!-- END: Modal Footer -->
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watchEffect, onMounted } from "vue";
import { saveTax } from "@/compositions/settings/sales-tax";
import cash from "cash-dom"

export default defineComponent({
  setup(props, { emit }) {
    const formTitle = ref("Add Sales Tax");
    const {
      salesTax,
      submit,
      validate,
      isSaved,
      isDeleted,
      showLoadingIcon,
      validationErrors,
      records,
      error,
      status,
    } = saveTax();

    const closeModal = () => {
      cash("#sales-tax-modal").modal("hide");
      showLoadingIcon.value = false;
    };

    watchEffect(() => {
      if (isSaved.value) {
        closeModal();
      }
    });

    onMounted(() => {
      salesTax.value.id = null;
      salesTax.value.taxName = null;
      salesTax.value.taxAbbreviation = null;
      salesTax.value.taxDescription = null;
      salesTax.value.taxNumber = null;
      salesTax.value.taxRate = null;
      records.value = null;
      error.value = null;
      status.value = null;
    });

    return {
      formTitle,
      salesTax,
      submit,
      validate,
      isSaved,
      isDeleted,
      showLoadingIcon,
      validationErrors,
      records,
      error,
      status,
      closeModal,
    };
  },
});
</script>
