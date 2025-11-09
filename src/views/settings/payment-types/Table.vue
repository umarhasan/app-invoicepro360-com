<template>
  <table class="table box">
    <thead class="border-b">
      <tr>
        <th class="text-left"><div class="align-middle">Name</div></th>
        <th class="text-left"><div class="align-middle">Descripiton</div></th>
        <th class="text-right"><div class="align-middle"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index" class="py-5" :row="row">
        <td class="border-b text-normal text-gray-700 capitalize">
          {{ row.name }}
        </td>

        <td class="border-b text-normal text-gray-700 capitalize">
          <div class="text-gray-600 text-xs whitespace-nowrap pt-1">
            {{ row.description }}
          </div>
        </td>

        <td class="table-report__action border-b">
          <div class="flex">
            <div class="ml-auto">
              <router-link
                v-if="canEdit"
                class="btn btn-sm btn-outline-primary px-3 hover:text-white py-1 flex gap-1"
                :to="{ name: 'edit-payment-types', params: { type_id: row.id } }"
              >
                <Lucide icon="Pencil" class="w-3 h-3" />Edit</router-link
              >
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
              :to="{ name: 'add-payment-types' }"
              >Add payment types</router-link
            >
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
      emit("deleteType", row);
    };

    return {
      cols,
      rows,
      deleteHandle,
      canEdit,
      canDelete,
      canCreate,
    };
  },
};
</script>
