<template>
  <tr class="invoice-tr" :class="{ 'border-t': index > 0 }">
    <td>
      <span
        class="status uppercase"
        :class="{
          'bg-yellow-100 text-yellow-500':
            row.status == 'Partial',
          'bg-theme-18 text-theme-9': row.status == 'Paid' || row.status == 'publish',
          'bg-red-100 text-red-500': row.status == 'Unpaid',
          'bg-gray-300 text-gray-700': row.status == 'draft',
        }"
        >{{ row.status }}</span
      >
    </td>
    <td class="text-normal text-gray-700 whitespace-nowrap">
      <div>
        {{ row.customerName }}
        <div class="text-gray-600 text-sm font-medium">{{ row.invoiceNumber }}</div>
      </div>
    </td>
    <td class="text-center">{{ $h.formatDate(row.invoiceDate) }}</td>
    <td class="text-center" v-html="$h.formatCurrency(row.grandTotal)"></td>
    <td class="text-center" v-html="$h.formatCurrency(row.dueAmount)"></td>

    <td class="table-report__action text-center">
      <div class="flex justify-center">
            <Menu>
              <Menu.Button :as="Button" variant="primary">
                <Lucide icon="ChevronDown" class="w-5 h-5 text-gray-600" />
              </Menu.Button>
              <Menu.Items class="w-48">
                <Menu.Item>
                  <a href="javascript:void(0);" @click="r('view-invoice', row.id)" >
                    <Lucide icon="Eye" class="w-4 h-4 text-gray-700 mr-2" /> View
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a href="javascript:void(0);" @click="r('edit-invoice', row.id)">
                    <Lucide icon="Edit2" class="w-4 h-4 text-gray-700 mr-2" /> Edit
                  </a>
                </Menu.Item>

                <Menu.Item v-show="row.status == 'draft'">
                  <a href="javascript:void(0);" @click="$emit('showDeleteModal',row,true)">
                    <Lucide icon="Trash" class="w-4 h-4 text-gray-700 mr-2" /> Delete
                  </a>
                </Menu.Item>
              </Menu.Items>
            </Menu>
        </div>
    </td>
  </tr>
</template>

<script setup>

import Button from "@/components/Button";
import { Menu } from "@/components/Headless";


const props = defineProps(["row", "key"])
const row = props.row;
const index = props.key;
const r = (name, uid) => {
  router.push({ name: name, params: { uid: uid } });
};

</script>