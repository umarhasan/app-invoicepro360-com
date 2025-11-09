<template>
  <div class="flex flex-wrap mb-6 filters">
    <div class="w-full md:w-1/5 px-1">
      <TomSelect
        v-model="filter.customer"
        :options="{
          search: true,
          classNames: 'w-full',
        }"
      >
        <option>Select Customer</option>
        <option v-for="(c, k) in customers" :key="k" :value="c.id">
          {{ c.customer }}
        </option>
      </TomSelect>
    </div>
    <div class="w-full md:w-1/5 px-1">
      <TomSelect
        v-model="filter.status"
        :options="{
          search: false,
          classNames: 'w-full',
        }"
      >
        <option>All Status</option>
        <option value="saved">Saved</option>
        <option value="draft">Draft</option>
      </TomSelect>
    </div>
    <div class="w-full md:w-2/5 px-1 flex">
      <div class="relative z-50 flex-1">
        <Litepicker
          v-model="filter.fromDate"
          placeholder="From"
          class="litepicker1"
          :options="{
            autoApply: true,
            showWeekNumbers: true,
            ranges: true,
            dropdowns: {
              minYear: 1990,
              maxYear: null,
              months: true,
              years: true,
            },
          }"
        />
        <div
          class="absolute right-2 top-2 dark:text-white" >
          <Lucide icon="Calendar" class="w-4 h-4 cursor-pointer" />
        </div>
      </div>

      <div class="relative -ml-1 flex-1">
        <Litepicker
          v-model="filter.toDate"
          placeholder="To"
          class="litepicker1"
          :options="{
            autoApply: true,
            showWeekNumbers: true,
            dropdowns: {
              minYear: 1990,
              maxYear: null,
              months: true,
              years: true,
            },
          }"
        />
        <div
          class="absolute right-2 top-2 dark:text-white" >
          <Lucide icon="Calendar" class="w-4 h-4 cursor-pointer" />
        </div>
      </div>
    </div>

    <div class="w-full md:w-1/5 px-1">
      <div class="relative">
        <input
          v-model="estimateNumber"
          class="form-control yr-form-control"
          type="text"
          placeholder="Invoice #"
        />
        <div
          class="absolute right-2 top-2 dark:text-white" >
          <Lucide icon="Search" class="cursor-pointer" @click="search"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: ["customers", "filter"],
  setup(props) {
    const estimateNumber = ref(null);

    const search = () => {
      props.filter.estimateNumber = estimateNumber.value;
    };
    return {
      customers: props.customers,
      filter: props.filter,
      estimateNumber,
      search,
    };
  },
});
</script>
