<template>
  <table class="table box">
    <tbody>
      <tr v-for="(row, index) in rows" :key="index" class="py-5" :row="row">
        <td class="border-b text-normal text-gray-700">
          {{ row.taxName }} -
          <span class="bg-theme-14 text-xs px-2 py-1 rounded-md tracking-widest">
            tax rate: {{ formatTaxRate(row.taxRate) }}%
          </span>

          <div class="text-gray-600 text-xs whitespace-nowrap pt-1">
            {{ row.taxDescription }}
          </div>
        </td>

        <td class="table-report__action border-b">
          <div class="flex">
            <div class="ml-auto">
              <router-link
                v-if="canEdit"
                class="btn btn-sm btn-outline-primary rounded-full w-16 mr-2 hover:text-white"
                :to="{ name: 'edit-sales-tax', params: { tax_id: row.id } }"
              >
                <Lucide icon="Pencil" class="w-3 h-3 mr-1" /> Edit
              </router-link>

              <a
                v-if="canDelete"
                class="btn btn-sm btn-outline-danger rounded-full w-16 hover:text-white"
                href="javascript:void(0);"
                @click="deleteHandle(row)"
              >
                <Lucide icon="Trash" class="w-3 h-3 mr-1" /> Delete
              </a>
            </div>
          </div>
        </td>
      </tr>
      <tr v-if="!rows">
        <td colspan="2" class="border-b text-normal text-gray-700 text-center font-bold">
          No records found.
          <span v-if="canCreate">
            <router-link
              class="font-bold text-blue-600 underline"
              :to="{ name: 'add-sales-tax' }"
            >
              Add sales tax
            </router-link>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ["columns", "records", "canEdit", "canDelete", "canCreate"],
  setup(props, { emit }) {
    const cols = props.columns;
    const rows = props.records;
    const canCreate = props.canCreate;
    const canEdit = props.canEdit;
    const canDelete = props.canDelete;

    const deleteHandle = (row) => {
      emit("deleteTax", row);
    };

    const formatTaxRate = (rate) => {
      return parseFloat(rate).toFixed(2);
    };

    return {
      cols,
      rows,
      deleteHandle,
      canEdit,
      canDelete,
      canCreate,
      formatTaxRate,
    };
  },
};
</script>
