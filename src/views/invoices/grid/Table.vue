<template>
  <table class="table my-2">
    <thead>
      <tr>
        <th
          :class="{
            'text-center': col.isCenter,
          }"
          v-for="(col, index) in cols"
          :key="index"
        >
          <div>{{ col.name }}</div>
        </th>
      </tr>
    </thead>
    <tbody>
      <Row v-for="(row, index) in rows" :k="index" :row="row" @showDeleteModal="showDeleteModal"></Row>
      <tr v-if="rows.length == 0">
        <td colspan="6" class="border-b text-normal text-gray-700 text-center font-bold">
          No Invoice found.
          <!--        <span v-if="canCreate"></span>-->
          <span>
            <router-link
              class="font-bold text-blue-600 underline"
              :to="{ name: 'add-invoice' }"
              >Create an Invoice</router-link
            >
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { showDeleteModal } from "@/compositions/invoices";
import Row from "./Row.vue";
export default {
  components: {
    Row,
  },

  props: ["columns", "records"],
  setup(props) {
    const cols = props.columns;
    const rows = props.records;

    return {
      cols,
      rows,
      showDeleteModal
    };
  },
};
</script>
