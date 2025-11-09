<template>
  <table class="table my-2">
    <thead class="border-b dark:border-dark-3">
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
      <Row v-for="(row, index) in rows" :key="index" :row="row"></Row>
      <tr v-if="rows.length == 0">
        <td colspan="6" class="border-b text-normal text-gray-700 text-center font-bold">
          No Estimate found.
          <!-- <span v-if="canCreate"></span>-->
          <span>
            <router-link
              class="font-bold text-blue-600 underline"
              :to="{ name: 'add-estimate' }"
              >Create an Estimate</router-link
            >
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
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
    };
  },
};
</script>
