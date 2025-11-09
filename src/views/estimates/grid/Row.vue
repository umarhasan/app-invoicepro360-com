<template>
  <tr class="invoice-tr" :class="{ 'border-t': index > 0 }">
    <td>
      <span
        class="status uppercase"
        :class="{
          'bg-theme-18 text-theme-9': row.status == 'saved',
          'bg-gray-300 text-gray-700': row.status == 'draft',
        }"
        >{{ row.status }}</span
      >
    </td>
    <td class="text-normal text-gray-700 whitespace-nowrap">
      <div>
        {{ row.customerName }}
        <div class="text-gray-600 text-sm font-medium">{{ row.estimateNumber }}</div>
      </div>
    </td>
    <td class="text-center">{{ $h.formatDate(row.estimateDate) }}</td>
    <td class="text-center" v-html="$h.formatCurrency(row.grandTotal)"></td>

    <td class="table-report__action text-center">
      <div class="dropdown">
        <button
          class="dropdown-toggle border-2 border-gray-400 rounded"
          aria-expanded="false"
        >
          <Lucide icon="MoreVertical" class="w-4 h-8 text-gray-600" />
        </button>
        <div class="dropdown-menu w-40">
          <div class="dropdown-menu__content box">
            <div class="p-2">
              <a
                class="table-action-btn"
                href="javascript:void(0);"
                @click="r('view-estimate', row.id)"
              >
              <Lucide icon="Eye" class="w-4 h-4 text-gray-700 mr-2" />
                View
              </a>

              <a
                class="table-action-btn"
                href="javascript:void(0);"
                @click="r('edit-estimate', row.id)"
              >
                <Lucide icon="Edit2" class="w-4 h-4 text-gray-700 mr-2" /> Edit
              </a>

              <a
                class="table-action-btn"
                href="javascript:void(0);"
                @click="r('delete-esitmate', row.id)"
              >
                <Lucide icon="Trash" class="w-4 h-4 text-gray-700 mr-2" /> Delete
              </a>
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import cash from "cash-dom"
export default {
  props: ["row", "key"],
  setup(props) {
    const row = props.row;
    const index = props.key;
    const r = (name, uid) => {
      cash(".dropdown-menu").remove();
      router.push({ name: name, params: { uid: uid } });
    };

    return {
      row,
      index,
      r,
    };
  },
};
</script>
