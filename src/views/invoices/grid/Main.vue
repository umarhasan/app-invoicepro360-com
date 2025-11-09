<template>
  <div class="">
    <div class="grid grid-cols-12 gap-10">
      <div class="col-span-12 my-10">
        <!-- <DangerAlert>Unable to delete record</DangerAlert>
        <SuccessAlert>Successfully Deleted</SuccessAlert> -->

        <div class="flex items-center pb-5">
          <h2 class="mr-auto truncate">Invoices</h2>

          <router-link class="add-btn" :to="{ name: 'add-invoice' }" tag="button">
            Create an Invoice
          </router-link>
          <button
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
        <!-- -->
        <div class="w-full">
          <div
            class="flex flex-col items-center py-10 bg-white mb-4"
            v-if="!isCalculated"
          >
            <LoadingIcon icon="circle" class="w-20" />
            <div class="text-center text-xl mt-2">Loading...</div>
          </div>
          <Top
            :outstandingAmount="outstandingAmount"
            :overdueAmount="overdueAmount"
            :indraftAmount="indraftAmount"
            v-if="isCalculated"
          />
        </div>
        <!-- -->

        <!--Filter form -->
        <div class="w-full">
          <div class="flex flex-col items-center py-10 bg-white" v-if="!isCustomerLoaded">
            <LoadingIcon icon="circle" class="w-20" />
            <div class="text-center text-xl mt-2">Loading...</div>
          </div>
          <FilterForm :filter="filter" :customers="customers" v-if="isCustomerLoaded" />
        </div>
        <!--Filter form -->

        <!-- INVOICES TABS -->
        <div class="mb-1">
          <div
            role="tablist"
            class="nav nav-tabs flex-col sm:flex-row justify-center lg:justify-start"
            style="letter-spacing: 1.5px">
            <a
              href="javascript:void(0);" @click="changeStatus('')"
              class="btn btn-sm btn-secondary me-1"
              :class="{
                'selected' : filter.status == '',
                'switched' : filter.status != ''
                }"    
              >All Invoices</a
            >
            <a
              href="javascript:void(0);" @click="changeStatus('paid')"
              class="btn btn-sm btn-secondary me-1"
              :class="{
                'selected' : filter.status == 'paid',
                'switched' : filter.status != 'paid'
                }"
              >Paid</a
            >
            <a
              href="javascript:void(0);" @click="changeStatus('draft')"
              class="btn btn-sm btn-secondary me-1"
              :class="{
                'selected' : filter.status == 'draft',
                'switched' : filter.status != 'draft'
                }"
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
          <Table :columns="columns" :records="records"  />
          <Pagination :meta="meta" class="pagination" />
        </div>
        <!-- END: Data List -->
      </div>
    </div>
    <DeleteModal 
      message="Do you really want to delete the invoice"  
      btn-text="Delete Invoice"
      :isOpen="isDeleteModal"
      @delete="confirmDelete"
      @close="isDeleteModal = false"
    />

  </div>
</template>

<script setup>
import { ref, watchEffect, watch } from "vue";
import { useCustomer } from "@/compositions/invoices/customer";
import {
  fetchInvoices,
  CalculateInvoicesSum,  
  confirmDelete,
  exportCSV,
  showNotification,
} from "@/compositions/invoices";

import Table from "./Table.vue";
import Pagination from "./Pagination.vue";
import FilterForm from "./Filter.vue";
import Top from "./Top.vue";


  const columns = [
    { name: "Status", isCenter: false },
    { name: "Customer/Invoice Number", isCenter: false },
    { name: "Date", isCenter: true },
    { name: "Total Amount", isCenter: true },
    { name: "Amount Due", isCenter: true },
    { name: "Action", isCenter: true },
  ];

  const isLoaded = ref(false);
  const isPaginationLoaded = ref(false);
  const { fetchCustomer, customers, isCustomerLoaded } = useCustomer();

    fetchCustomer();

    CalculateInvoicesSum();

    const {
      records,
      meta,
      status,
      filter,
      outstandingAmount,
      overdueAmount,
      indraftAmount,
      isCalculated,
      showLoadingIcon,
      isNotify,
      permissions,
      isDeleteModal,
    } = fetchInvoices();

    watchEffect(() => {
      if (status.value === 200) {
        isLoaded.value = true;
        isPaginationLoaded.value = true;
        status.value = null
      }
    });

    watch([isNotify], () => {
      if (isNotify.value) showNotification();
    });

    const changeStatus = (_status) => {
      filter.value.status = _status
    }

    //filter invoice
    watch(
      () => {
        return [
          filter.value.customer,
          filter.value.status,
          filter.value.toDate,
          filter.value.fromDate,
          filter.value.invoiceNumber,
        ];
      },
      () => {
        isLoaded.value = false;
        status.value = null;
        fetchInvoices();
      }
    );

    //fetch invoice on paginate
    watch(
      () => {
        return meta.value.current;
      },
      () => {
        isLoaded.value = false;
        status.value = null;

        fetchInvoices(meta.value.current, meta.value.size);
      }
    );

    // fetch invoice on itemPerPage update
    watch(
      () => {
        return meta.value.size;
      },
      (newVal, oldVal) => {
        if (newVal != oldVal) {
          isLoaded.value = false;
          status.value = null;
          fetchInvoices(1, meta.value.size);
        }
      }
    );
</script>

<style>
.tail-select .select-label {
  padding: 5px 32px 5px 12px !important;
  border-width: 2px !important;
}
.tail-select {
  line-height: 25px;
}

.tabulator-row .tabulator-cell{
  overflow: visible !important;
}
</style>
