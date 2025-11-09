<template>
  <tr class="item px-2 border-t">
    <td class="w-54">
      <input
        v-model="item.name"
        type="text"
        class="form-control"
        :class="{ error: validateItem.name.$error }"
      />
      <div v-if="validateItem.name.$error" class="text-theme-6">
        <span v-if="validateItem.name.required.$invalid">Item Name is required.</span>
        <span v-if="validateItem.name.minLength.$invalid">Item Name must be at least 3 characters.</span>
      </div>
    </td>
    <td class="w-20" v-if="showTaxAgencyField">
      <input
        v-model="item.agency_name"
        type="text"
        class="form-control"
        @click="showItemsDropdown(item.uid)"
        @focus="showItemsDropdown(item.uid)"
      />
      <!-- No inline validation error for agency_name -->
      <div
        v-if="item.showItemsDropdown"
        v-click-away="hideItemDropdown"
        class="relative"
      >
        <ItemDropdown
          :tax-agency-list="taxAgencies"
          :uid="item.uid"
          placeholder="Select Tax Agency"
          @selectItem="selectItem"
          @addNewItem="addNewAgency"
        />
      </div>
    </td>
    <td class="w-20">
      <input
        type="text"
        class="form-control text-right"
        v-model="item.rate"
        @keydown="updateItemTotal"
        @change="updateItemTotal"
        v-decimal="'auto'"
        :class="{ error: validateItem.rate.$error }"
      />
      <div v-if="validateItem.rate.$error" class="text-theme-6">
        <span v-if="validateItem.rate.required.$invalid">Rate is required.</span>
        <span v-if="validateItem.rate.numeric.$invalid">Rate must be numeric.</span>
        <span v-if="validateItem.rate.notZero.$invalid">Rate must be greater than zero.</span>
      </div>
    </td>
    <td class="w-10 text-center">
      <Lucide
        icon="Trash2Icon"
        class="ml-3 -mt-2 hover:text-theme-6 cursor-pointer"
        @click="deleteItem(item.uid)"
      />
    </td>
  </tr>
</template>

<script>
import { defineComponent } from "vue";
import ItemDropdown from "./ItemDropdown.vue";
import { useTaxItems } from "@/compositions/settings/sales-tax";
import { useVuelidate } from "@vuelidate/core";
import { required, numeric, minLength } from "@vuelidate/validators";

export default defineComponent({
  components: { ItemDropdown },
  props: {
    item: Object,
    validateTaxItems: Object, // optional if passed from parent
  },
  setup(props) {
    const {
      taxAgencies,
      deleteItem,
      updateItemTotal,
      addNewAgency,
      hideItemDropdown,
      showItemsDropdown,
      selectItem,
      showTaxAgencyField,
    } = useTaxItems();

    // Validation rules for the tax item.
    const rules = {
      name: {
        required,
        minLength: minLength(3),
      },
      rate: {
        required,
        numeric,
        notZero(value) {
          if (typeof value === "string" && value.includes("%")) {
            const num = parseFloat(value.replace("%", ""));
            return num > 0;
          }
          return parseFloat(value) > 0;
        },
      },
    };

    const validateItem = useVuelidate(rules, props.item);

    return {
      taxAgencies,
      item: props.item,
      updateItemTotal,
      deleteItem,
      addNewAgency,
      hideItemDropdown,
      showItemsDropdown,
      selectItem,
      showTaxAgencyField,
      validateItem,
    };
  },
});
</script>

<style>
tr.item td {
  padding: 0.5em !important;
}
</style>
