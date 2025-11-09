<template>
  <div class="content">
    <h2 class="content-heading">Customer List</h2>
    <div v-if="permissions.view">
      <TopBar
        create-link-route="add-customer"
        create-link-text="Create Customer"
        :can-create="permissions.create"
      >
        <template #more-action>
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
        </template>

        <template #search-form>
          <form id="tabulator-html-filter-form" class="flex">
            <div class="w-60 relative text-gray-700">
              <input
                type="text"
                class="form-control w-60 placeholder-theme-13"
                placeholder="Search by name or email"
                v-model="filter"
                @input="onSearch"
              />
              <Lucide icon="Search" class="w-4 h-4 absolute my-auto inset-y-0 right-3" />
            </div>
          </form>
        </template>
      </TopBar>

      <!-- BEGIN: HTML Table Data -->
      <div class="intro-y">
        <div class="scrollbar-hidden">
          <!-- BEGIN: Data List -->
          <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
            <Table class="my-2 table">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>

                  <Table.Th @click="sort('customer')" class="cursor-pointer select-none">NAME
                    <Lucide :icon="getSortIcon('customer')" class="inline w-4 h-4 ml-1" />
                  </Table.Th>

                  <Table.Th @click="sort('email')" class="cursor-pointer select-none">EMAIL
                    <Lucide :icon="getSortIcon('email')" class="inline w-4 h-4 ml-1" />
                  </Table.Th>

                  <Table.Th @click="sort('phoneNumber')" class="cursor-pointer select-none">PHONE
                    <Lucide :icon="getSortIcon('phoneNumber')" class="inline w-4 h-4 ml-1" />
                  </Table.Th>

                  <Table.Th @click="sort('status')" class="cursor-pointer select-none">STATUS
                    <Lucide :icon="getSortIcon('status')" class="inline w-4 h-4 ml-1" />
                  </Table.Th>

                  <Table.Th class="text-center">ACTIONS</Table.Th>
                </Table.Tr>
              </Table.Thead>
          <Table.Tbody>
            <Table.Tr v-for="(customer, index) in sortedCustomers" :key="customer.id">
              <Table.Td>{{ index + 1 }}</Table.Td>
              <Table.Td>
                <router-link
                  class="mr-3 text-primary font-medium hover:underline"
                  :to="`/customer/${customer.id}/edit`"
                >
                {{ customer.customer }}
                </router-link>
                
            </Table.Td>
              <Table.Td>{{ customer.email }}</Table.Td>
              <Table.Td>{{ customer.phoneNumber }}</Table.Td>
              <Table.Td>
                <div class="capitalize" :class="customer.status == 'active'? 'text-success' : 'text-danger'">
                  {{ customer.status}}
                </div>
              </Table.Td>
              <Table.Td>
                <div class="flex items-center justify-center">
                  
                <router-link class="flex items-center mr-3" :to="`/customer/${customer.id}/edit`">
                  <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" />Edit
                </router-link>
                  <a class="text-danger" href="#" @click="setDeleteConfirmationModal(customer)">
                    <Lucide icon="Trash2" class="w-4 h-4 mr-1" />Delete</a>
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
          </div>
          <!-- END: Data List -->
          <!-- BEGIN: Pagination -->
          <div
            class="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap"
          >
          <Pagination class="w-full sm:w-auto sm:mr-auto">
              <!-- First Page -->
              <Pagination.Link @click="goToPage(1)">
                <Lucide icon="ChevronsLeft" class="w-4 h-4" />
              </Pagination.Link>
              <!-- Previous Page -->
              <Pagination.Link @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                <Lucide icon="ChevronLeft" class="w-4 h-4" />
              </Pagination.Link>
              <!-- Dynamic Page Numbers -->
              <Pagination.Link
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :active="page === currentPage"
              >
                {{ page }}
              </Pagination.Link>
              <!-- Next Page -->
              <Pagination.Link @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                <Lucide icon="ChevronRight" class="w-4 h-4" />
              </Pagination.Link>
              <!-- Last Page -->
              <Pagination.Link @click="goToPage(totalPages)">
                <Lucide icon="ChevronsRight" class="w-4 h-4" />
              </Pagination.Link>
            </Pagination>
            <FormSelect class="w-20 mt-3 !box sm:mt-0" v-model="limit" @change="goToPage(currentPage)">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="35">35</option>
              <option value="50">50</option>
            </FormSelect>
          </div>
          <!-- END: Pagination -->
        </div>
      </div>
      <!-- END: HTML Table Data -->
    </div>

    <DeleteModal 
      :isOpen="isDeleteModal"
      btn-text="Mark as Inactive"
      @delete="deleteCustomer"
      @close="isDeleteModal = false"
      message="Do you really want to inactive the record?"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { FormInput, FormSelect } from "@/components/Form";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import {
  fetchCustomer,
  deleteCustomer,
  exportCSV,
  showNotification,
} from "@/compositions/customer/";

  const {
    filter,
    onSearch,
    isNotify,
    isSaved,
    permissions,
    showLoadingIcon,
    isDeleteModal,
    customers,
    currentPage,
    totalPages,
    limit,
    goToPage,
    showDeleteModal,
    getCustomers,
    sortColumn,
    sortDirection,
    sort
  } = fetchCustomer();

  const setDeleteConfirmationModal = (customer) => {
    showDeleteModal(customer);
  };

  onMounted(() => {
  if (isNotify.value || isSaved.value) showNotification();   // ← UPDATED
   getCustomers();
 });

 watch([isNotify, isSaved], () => {                           // ← UPDATED
  if (isNotify.value || isSaved.value) showNotification();
});

  // Sorting logic with icon
  const getSortIcon = (column) => {
    if (sortColumn.value !== column) return "ChevronsUpDown";
    return sortDirection.value === "asc" ? "ChevronUp" : "ChevronDown";
  };

const sortedCustomers = computed(() => {
  if (!sortColumn.value) return customers.value;
  return [...customers.value].sort((a, b) => {
    let result = 0;
    if (a[sortColumn.value] < b[sortColumn.value]) result = -1;
    if (a[sortColumn.value] > b[sortColumn.value]) result = 1;
    return sortDirection.value === "asc" ? result : -result;
  });
});

</script>
<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.select-none {
  user-select: none;
}
</style>