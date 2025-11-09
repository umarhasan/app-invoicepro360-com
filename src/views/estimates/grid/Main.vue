<template>
  <div class="">
    <div class="grid grid-cols-12 gap-10">
      <div class="col-span-12 my-10">
        <!-- <DangerAlert>Unable to delete record</DangerAlert>
        <SuccessAlert>Successfully Deleted</SuccessAlert> -->

        <div class="flex items-center pb-5">
          <h2 class="text-2xl font-medium mr-auto truncate">Estimates</h2>

          <router-link class="add-btn" :to="{ name: 'add-estimate' }" tag="button">
            Create an Estimate
          </router-link>
          <button
            v-if="permissions.export"
            class="export-btn"
            aria-expanded="false"
            :class="{ disable: showLoadingIcon }"
            :disabled="showLoadingIcon"
            @click="exportCSV"
          >
            <LoadingIcon
              icon="oval"
              color="white"
              class="w-7 h-7"
              v-if="showLoadingIcon"
            />
            <span v-if="!showLoadingIcon">
              <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export
            </span>
          </button>
        </div>

        <!--Filter form -->
        <div class="w-full">
          <div class="flex flex-col items-center py-10 bg-white" v-if="!isCustomerLoaded">
            <LoadingIcon icon="circle" class="w-20" />
            <div class="text-center text-xl mt-2">Loading...</div>
          </div>
          <FilterForm :filter="filter" :customers="customers" v-if="isCustomerLoaded" />
        </div>
        <!--Filter form -->

        <!-- ESTIMATES TABS -->
        <div class="pr-5 mt-5 yr-setting-menu mb-1">
          <div
            role="tablist"
            class="nav nav-tabs flex-col sm:flex-row justify-center lg:justify-start"
          >
            <a
              href="javascript:void(0);"
             class="btn btn-sm btn-secondary me-1"
              >All Estimates</a
            >
            <a
              href="javascript:void(0);"
              class="btn btn-sm btn-secondary me-1"
              >Saved</a
            >
            <a
              href="javascript:void(0);"
              class="btn btn-sm btn-secondary"
              >Draft</a
            >
          </div>
        </div>
        <!-- INVOICES TABS -->

        <div class="flex flex-col items-center py-10" v-if="!isLoaded">
          <LoadingIcon icon="grid" class="w-20" />
          <div class="text-center text-xl mt-2">Loading...</div>
        </div>

        <!-- BEGIN: Data List -->
        <div class="overflow-auto lg:overflow-visible" v-if="isLoaded">
          <Table :columns="columns" :records="records" />
          <Pagination :meta="meta" />
        </div>
        <!-- END: Data List -->
      </div>
    </div>
    <DeleteModal 
      message="Do you really want to delete the invoice"  
      :isOpen="isDeleteModal"
      @delete="confirmDelete"
      @close="isDeleteModal = false"
    />
  </div>
</template>

<script>
import { defineComponent, ref, watchEffect, watch } from "vue";
import { useCustomer } from "@/compositions/invoices/customer";
import {
  fetchEstimates,
  confirmDelete,
  showDeleteModal,
  showNotification,
  exportCSV,
} from "@/compositions/estimates";

import Table from "./Table.vue";
import Pagination from "./Pagination.vue";
import FilterForm from "./Filter.vue";

export default defineComponent({
  components: {
    Table,
    Pagination,
    FilterForm,
  },
  setup() {
    const columns = [
      { name: "Status", isCenter: false },
      { name: "Customer/Estimate Number", isCenter: false },
      { name: "Date", isCenter: true },
      { name: "Total Amount", isCenter: true },
      { name: "Action", isCenter: true },
    ];

    const isLoaded = ref(false);
    const isPaginationLoaded = ref(false);
    const { fetchCustomer, customers, isCustomerLoaded } = useCustomer();

    fetchCustomer();

    const {
      records,
      meta,
      status,
      filter,
      showLoadingIcon,
      isNotify,
      permissions,
      isDeleteModal
    } = fetchEstimates();

    watchEffect(() => {
      if (status.value === 200) {
        isLoaded.value = true;
        isPaginationLoaded.value = true;
      }
    });

    //filter invoice
    watch(
      () => {
        return [
          filter.value.customer,
          filter.value.status,
          filter.value.toDate,
          filter.value.fromDate,
          filter.value.estimateNumber,
        ];
      },
      () => {
        isLoaded.value = false;
        status.value = null;
        fetchEstimates();
      }
    );

    //fetch estimate on paginate
    watch(
      () => {
        return meta.value.current;
      },
      () => {
        isLoaded.value = false;
        status.value = null;

        fetchEstimates(meta.value.current, meta.value.size);
      }
    );

    // fetch estimate on itemPerPage update
    watch(
      () => {
        return meta.value.size;
      },
      (newVal, oldVal) => {
        if (newVal != oldVal) {
          isLoaded.value = false;
          status.value = null;
          fetchEstimates(1, meta.value.size);
        }
      }
    );

    watch([isNotify], () => {
      if (isNotify.value) showNotification();
    });

    return {
      columns,
      records,
      meta,
      showLoadingIcon,
      isLoaded,
      confirmDelete,
      showDeleteModal,
      customers,
      isCustomerLoaded,
      filter,
      exportCSV,
      permissions,
      isDeleteModal,
    };
  },
});
</script>

<style scoped>
.tail-select .select-label {
  padding: 5px 32px 5px 12px !important;
  border-width: 2px !important;
}
.tail-select {
  line-height: 25px;
}
</style>
