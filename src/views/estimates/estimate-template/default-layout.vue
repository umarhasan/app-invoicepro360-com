<template>
  <!-- BEGIN: Invoice -->
  <div class="box intro-y overflow-hidden mt-5">
    <div class="border-b border-gray-200 text-center sm:text-left">
      <div
        class="flex flex-col lg:flex-row pt-5 px-5 sm:px-10 sm:pt-10 lg:pb-5 text-center sm:text-left"
      >
        <div class="w-36">
          <img :src="setting.logo" v-if="setting.logo" />
        </div>

        <div class="mt-10 lg:mt-0 lg:ml-auto lg:text-right">
          <div class="text-theme-1 font-semibold text-3xl uppercase">
            {{ estimate.estimateTitle ? estimate.estimateTitle : "estimate" }}
          </div>
          <div class="text-gray-600" v-if="estimate.estimateSummary">
            {{ estimate.estimateSummary }}
          </div>

          <div class="text-xl text-primary font-medium mt-2">
            {{ business.companyName }}
          </div>
          <div class="mt-1">
            {{ business.phoneNumber }}
          </div>
          <div class="mt-1">{{ business.addressLine1 }} {{ business.addressLine2 }}</div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row px-10 pt-10 pb-5">
        <div>
          <div class="text-base text-gray-600">Billed To</div>
          <div class="text-lg font-medium text-theme-1 mt-2">
            {{ billedCustomer.name }}
          </div>
          <div class="mt-1">{{ billedCustomer.email }}</div>
          <div class="mt-1">{{ billedCustomer.phone_number }}</div>
          <div class="mt-1 hidden">260 W. Storm Street New York, NY 10025.</div>
        </div>

        <div class="lg:text-right mt-10 lg:mt-0 lg:ml-auto">
          <div class="flex gap-4 items-center">
            <div class="text-base font-medium w-40 md:text-right">Estimate Number:</div>
            <div class="font-medium text-gray-600">{{ estimate.estimateNumber }}</div>
          </div>

          <div class="flex gap-4 items-center">
            <div class="text-base font-medium w-40 md:text-right">Reference Number:</div>
            <div class="font-medium text-gray-600">{{ estimate.referenceNumber }}</div>
          </div>

          <div class="flex gap-4 items-center">
            <div class="text-base font-medium w-40 md:text-right">Estimate Date:</div>
            <div class="font-medium text-gray-600">
              {{ $h.formatDate(estimate.estimateDate) }}
            </div>
          </div>

          <div class="flex gap-4 items-center">
            <div class="text-base font-medium w-40 md:text-right">Validity Date:</div>
            <div class="font-medium text-gray-600">
              {{ $h.formatDate(estimate.validityDate) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pb-10">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr class="uppercase">
              <th class="border-b whitespace-nowrap">
                {{
                  setting.invoice_columns.items.name == "others"
                    ? setting.invoice_columns.items.value
                    : setting.invoice_columns.items.name
                }}
              </th>
              <th
                class="border-b-2 text-right whitespace-nowrap"
                v-if="!setting.invoice_columns.units.hide"
              >
                {{
                  setting.invoice_columns.units.name == "others"
                    ? setting.invoice_columns.units.value
                    : setting.invoice_columns.units.name
                }}
              </th>
              <th
                class="border-b-2 text-right whitespace-nowrap"
                v-if="!setting.invoice_columns.price.hide"
              >
                {{
                  setting.invoice_columns.price.name == "others"
                    ? setting.invoice_columns.price.value
                    : setting.invoice_columns.price.name
                }}
              </th>
              <th
                class="border-b-2 text-right whitespace-nowrap"
                v-if="!setting.invoice_columns.taxable.hide"
              >
                {{
                  setting.invoice_columns.taxable.name == "others"
                    ? setting.invoice_columns.taxable.value
                    : setting.invoice_columns.taxable.name
                }}
              </th>
              <th
                class="border-b-2 text-right whitespace-nowrap"
                v-if="!setting.invoice_columns.amount.hide"
              >
                {{
                  setting.invoice_columns.amount.name == "others"
                    ? setting.invoice_columns.amount.value
                    : setting.invoice_columns.amount.name
                }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td class="border-b">
                <div class="font-medium whitespace-nowrap">
                  {{ item.name }}
                </div>
                <div
                  class="text-gray-600 text-xs whitespace-nowrap"
                  v-if="!setting.invoice_columns.items.hide"
                >
                  {{ item.description }}
                </div>
              </td>
              <td
                class="text-right border-b w-32"
                v-if="!setting.invoice_columns.units.hide"
              >
                {{ item.quantity }}
              </td>
              <td
                class="text-right border-b w-32"
                v-html="$h.formatCurrency(item.price)"
                v-if="!setting.invoice_columns.price.hide"
              ></td>
              <td
                class="text-right border-b w-32"
                v-if="!setting.invoice_columns.taxable.hide"
              >
                {{ item.isTaxable ? "YES" : "NO" }}
              </td>
              <td
                class="text-right border-b w-32 font-medium"
                v-html="$h.formatCurrency(item.total)"
                v-if="!setting.invoice_columns.amount.hide"
              ></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid grid-col grid-cols-12 px-5">
      <div class="text-center sm:text-left mt-10 sm:mt-0 col-span-8">
        <div class="text-base font-medium">Notes / Terms</div>
        <div class="mt-1 text-gray-600">{{ estimate.notes }}</div>
      </div>
      <div class="col-span-4">
        <div class="flex gap-4 items-center">
          <div class="text-base font-medium w-40 md:text-right">Subtotal:</div>
          <div
            class="font-medium text-gray-600"
            v-html="$h.formatCurrency(subTotal)"
          ></div>
        </div>

        <div class="flex gap-4 items-center" v-for="tax in salesTax" :key="tax.id">
          <div class="text-base font-medium w-40 md:text-right">
            {{ tax.taxAbbreviation }} {{ tax.taxRate }}%
          </div>
          <div
            class="font-medium text-gray-600"
            v-html="$h.formatCurrency(tax.taxAmount)"
          ></div>
        </div>

        <div class="flex gap-4 items-center">
          <div class="text-base font-medium w-40 md:text-right">Total:</div>
          <div
            class="font-medium text-gray-600"
            v-html="$h.formatCurrency(grandTotal)"
          ></div>
        </div>
      </div>
    </div>

    <div class="px-5 py-5 border-t mt-5 flex justify-center text-base text-gray-600">
      {{ estimate.footerNotes }}
    </div>
  </div>
  <!-- END: Invoice -->
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useCustomer } from "@/compositions/estimates/customer";
import { saveBusiness, businessDetail } from "@/compositions/business";

export default defineComponent({
  props: ["estimate", "items", "setting", "subTotal", "grandTotal", "salesTax"],
  setup(props) {
    const { billedCustomer } = useCustomer();
    const { business } = saveBusiness("modal");

    onMounted(async () => {
      const holdBusiness = await businessDetail();

      // business_id.value           = holdBusiness.id
      business.value.companyName = holdBusiness.companyName;
      business.value.companyType = holdBusiness.companyType;
      business.value.businessType = holdBusiness.businessType;
      business.value.currency = holdBusiness.currency;
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
    });

    return {
      billedCustomer,
      business,
      invoice: props.estimate,
      items: props.items,
      setting: props.setting,
      subTotal: props.subTotal,
      grandTotal: props.grandTotal,
      salesTax: props.salesTax,
    };
  },
});
</script>
