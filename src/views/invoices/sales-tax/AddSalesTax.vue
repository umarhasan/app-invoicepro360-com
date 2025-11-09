<template>
  <div class="add-sales-tax flex justify-between items-center">
    <div class="text-left font-semibold">Tax</div>
    <div class="text-right relative w-3/4">
      <div class="invoice-tax-list rounded relative" :class="{ 'z-50': showDropDown }">
        <div class="relative text-left">
          <div
            class="px-3 w-full"
            @click="
              () => {
                showDropDown = !showDropDown;
              }
            "
          >
            {{ taxName }}
            <Lucide icon="ChevronDown" class="w-4 h-4 absolute my-auto inset-y-0 mr-2 right-0" />
          </div>
        </div>

        <div
          v-if="showDropDown"
          v-click-away="
            () => {
              showDropDown = false;
            }
          "
        >
          <div class="text-left bg-white border-t dark:border-dark-3">
            <div class="flex-1 relative">
              <input
                type="text"
                placeholder="Select a tax"
                class="form-control w-full dark:border-dark-3"
                v-model="search"
              />
              <Lucide icon="Search" class="w-4 h-4 absolute my-auto inset-y-0 mr-2 right-0" />
            </div>
          </div>
          <div class="tax-options">
            <div v-for="(tax, key) in filteredTaxes" :key="key">
              <div
                class="item"
                @click="selectTax(tax)"
                v-if="!selectedIds.includes(tax.id)"
              >
                {{ tax.taxName }} - {{ tax.taxRate }} %
              </div>

              <div
                class="item"
                :class="{ disabled: selectedIds.includes(tax.id) }"
                v-if="selectedIds.includes(tax.id)"
              >
                {{ tax.taxName }} - {{ tax.taxRate }} %
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useInvoiceItems } from "@/compositions/invoices/items";

export default defineComponent({
  props: ["taxes", "selectedIds"],
  setup(props) {
    const search = ref("");
    const taxName = ref("Select a tax");
    const showDropDown = ref(false);

    const { addTax, permissions } = useInvoiceItems();

    const selectTax = (data) => {
      let tax = {
        id: data.id,
        intuit_id : data.intuit_id,
        taxName: data.taxName,
        taxAbbreviation: data.taxAbbreviation,
        taxNumber: data.taxNumber,
        taxRate: data.taxRate,
        taxAmount: 0,
      };

      addTax(tax);

      taxName.value = `${tax.taxName}  ${tax.taxRate} %`
      showDropDown.value = false;
    };

    const filteredTaxes = computed(() => {
      return props.taxes.filter((tax) => tax.taxName.match(search.value));
    });
   

    return {
      search,
      taxName,
      showDropDown,
      filteredTaxes,
      selectTax,
      selectedIds: props.selectedIds,
      permissions,
    };
  },
});
</script>