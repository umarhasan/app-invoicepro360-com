<template>
  <SettingLayout current-tab="invoice-columns">
    <div class="bg-white rounded">
      <div class="flex items-center border-b border-gray-200">
        <h2 class="text-2xl font-medium p-5 truncate content-heading">Invoice Field Names</h2>
      </div>

      <div class="p-5">
        <ColumnTitle
          name="Items"
          :columns="columns.items"
          :checked-name="setting.invoice_columns.items"
        />

        <ColumnTitle
          name="Units"
          :columns="columns.units"
          :checked-name="setting.invoice_columns.units"
        />

        <ColumnTitle
          name="Price"
          :columns="columns.price"
          :checked-name="setting.invoice_columns.price"
        />

        <ColumnTitle
          name="Taxable"
          :columns="columns.taxable"
          :checked-name="setting.invoice_columns.taxable"
        />

        <ColumnTitle
          name="Amount"
          :columns="columns.amount"
          :checked-name="setting.invoice_columns.amount"
        />
      </div>

      <div class="border-b border-gray-200"></div>

      <div class="p-5 border-b border-gray-200 mb-5">
        <div class="text-gray-700 text-base font-bold">
          Choose which columns on your invoices to hide:
        </div>

        <div class="mt-4">
          <div class="mt-2">
            <Checkbox
              classes="mb-3 ml-3"
              v-model:checked="setting.invoice_columns.items.hide"
              :true-value="true"
              :false-value="false"
            >
              Hide Description
            </Checkbox>

            <Checkbox
              classes="mb-3 ml-3"
              v-model:checked="setting.invoice_columns.units.hide"
              :true-value="true"
              :false-value="false"
            >
              Hide Units
            </Checkbox>

            <Checkbox
              classes="mb-3 ml-3"
              v-model:checked="setting.invoice_columns.price.hide"
              :true-value="true"
              :false-value="false"
            >
              Hide Price
            </Checkbox>

            <Checkbox
              classes="mb-3 ml-3"
              v-model:checked="setting.invoice_columns.taxable.hide"
              :true-value="true"
              :false-value="false"
            >
              Hide Taxable
            </Checkbox>

            <Checkbox
              classes="mb-3 ml-3"
              v-model:checked="setting.invoice_columns.amount.hide"
              :true-value="true"
              :false-value="false"
            >
              Hide Amount
            </Checkbox>
          </div>
        </div>
      </div>
      <div class="pl-5 pb-5">
        <button
          type="submit"
          class="btn btn-primary"
          :class="{ disable: showLoadingIcon.invoice_columns }"
          :disabled="showLoadingIcon.invoice_columns"
          @click="updateInvoiceColumns"
        >
          <span v-if="!showLoadingIcon.invoice_columns">Save changes</span>
          <LoadingIcon
            icon="oval"
            color="white"
            class="w-5 h-5"
            v-if="showLoadingIcon.invoice_columns"
          />
        </button>
      </div>
    </div>
  </SettingLayout>
</template>

<script>
import { watch } from "vue";
import { useSettings, showNotification } from "@/compositions/invoices/settings";

import SettingLayout from "../Setting-layout.vue";
import ColumnTitle from "@/components/invoice/ColumnTitle.vue";

export default {
  components: {
    SettingLayout,
    ColumnTitle,
  },
  setup() {
    const {
      setting,
      columns,
      updateInvoiceColumns,
      showLoadingIcon,
      isSaved,
    } = useSettings();

    // Notification for success / error
    watch(isSaved, () => {
      if (isSaved.value) showNotification();
    });

    return {
      setting,
      columns,
      updateInvoiceColumns,
      showLoadingIcon,
    };
  },
};
</script>
