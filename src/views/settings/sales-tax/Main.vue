<template>
  <div class="content">
    <!-- Show loading spinner while data is being fetched -->
    <div v-if="!isLoaded" class="flex flex-col items-center py-10">
      <LoadingIcon icon="grid" class="w-20" />
      <div class="text-center text-xl mt-2">Loading...</div>
    </div>
    <!-- Once loaded, display the Sales Tax list -->
    <div v-else>
      <div class="flex items-center pb-5">
        <h2 class="text-2xl font-medium mr-auto truncate content-heading">Sales Tax</h2>
        <router-link v-if="permissions.create"
          class="add-btn"
          :to="{ name: 'add-sales-tax' }" tag="button">
          Add Sales Tax
        </router-link>
      </div>
      <!-- HTML Table Data -->
      <div class="intro-y">
        <div class="scrollbar-hidden">
          <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
            <Table class="my-2 table">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th @click="sort('taxName')" class="border-b-0 whitespace-nowrap">
                    TAX NAME
                    <Lucide :icon="getSortIcon('taxName')" class="inline w-4 h-4 ml-1" />
                  </Table.Th>
                  <Table.Th @click="sort('taxAbbreviation')" class="border-b-0 whitespace-nowrap">
                    ABBREVIATION
                    <Lucide :icon="getSortIcon('taxAbbreviation')" class="inline w-4 h-4 ml-1" />
                  </Table.Th>
                  <Table.Th @click="sort('taxNumber')" class="border-b-0 whitespace-nowrap">
                    TAX NUMBER
                    <Lucide :icon="getSortIcon('taxNumber')" class="inline w-4 h-4 ml-1" />
                  </Table.Th>
                  <Table.Th @click="sort('taxRate')" class="border-b-0 whitespace-nowrap">
                    TAX RATE
                    <Lucide :icon="getSortIcon('taxRate')" class="inline w-4 h-4 ml-1" />
                  </Table.Th>
                  <Table.Th @click="sort('status')" class="text-center border-b-0 whitespace-nowrap">
                    STATUS
                    <Lucide :icon="getSortIcon('status')" class="inline w-4 h-4 ml-1" />
                  </Table.Th>
                  <Table.Th class="text-center border-b-0 whitespace-nowrap">ACTIONS</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr v-for="(tax, index) in paginatedTaxes" :key="tax.id">
                  <Table.Td>{{ index + 1 + ((currentPage - 1) * limit) }}</Table.Td>
                  <Table.Td>
                    <router-link :to="{ name: 'edit-sales-tax', params: { tax_id: tax.id } }">
                      {{ tax.taxName }}
                    </router-link>
                  </Table.Td>
                  <Table.Td>{{ tax.taxAbbreviation }}</Table.Td>
                  <Table.Td>{{ tax.taxNumber }}</Table.Td>
                  <Table.Td>{{ formatTaxRate(tax.taxRate) }}%</Table.Td>
                  <Table.Td class="text-center">
                    <div :class="tax.status === 'active' ? 'text-success' : 'text-danger'">
                      {{ tax.status === 'active' ? 'Active' : 'Inactive' }}
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <div class="flex items-center justify-center">
                      <router-link
                        v-if="permissions.edit"
                        class="flex items-center mr-3"
                        :to="{ name: 'edit-sales-tax', params: { tax_id: tax.id } }"
                      >
                        <Lucide icon="Pencil" class="w-4 h-4 mr-1" /> Edit
                      </router-link>
                      <a
                        v-if="permissions.delete"
                        class="flex items-center text-danger"
                        href="#"
                        @click="confirmDelete(tax.id)"
                      >
                        <Lucide icon="Trash2" class="w-4 h-4 mr-1" /> Delete
                      </a>
                    </div>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
          <!-- Pagination -->
          <div class="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
            <Pagination class="w-full sm:w-auto sm:mr-auto">
              <Pagination.Link @click="goToPage(1)">
                <Lucide icon="ChevronsLeft" class="w-4 h-4" />
              </Pagination.Link>
              <Pagination.Link @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                <Lucide icon="ChevronLeft" class="w-4 h-4" />
              </Pagination.Link>
              <Pagination.Link
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :active="page === currentPage"
              >
                {{ page }}
              </Pagination.Link>
              <Pagination.Link @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                <Lucide icon="ChevronRight" class="w-4 h-4" />
              </Pagination.Link>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {computed,watch } from "vue";
import { FormSelect } from "@/components/Form";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import { fetchSalesTax, confirmDelete, showNotification } from "@/compositions/settings/sales-tax";
import { useRouter } from "vue-router";
const router = useRouter();
const {
  records,
  permissions,
  isNotify,
  currentPage,
  totalPages,
  limit,
  isLoaded,
  sortColumn,
  sortDirection,
  sort,
} = fetchSalesTax();
// Sorted records based on the selected column and direction.
const sortedTaxes = computed(() => {
  if (!sortColumn.value) return records.value;
  return [...records.value].sort((a, b) => {
    let result = 0;
    if (a[sortColumn.value] < b[sortColumn.value]) result = -1;
    if (a[sortColumn.value] > b[sortColumn.value]) result = 1;
    return sortDirection.value === "asc" ? result : -result;
  });
});
// Paginate the sorted records.
const paginatedTaxes = computed(() => {
  const start = (currentPage.value - 1) * Number(limit.value);
  return sortedTaxes.value.slice(start, start + Number(limit.value));
});
// Format tax rate to two decimals.
const formatTaxRate = (rate) => parseFloat(rate).toFixed(2);
// Return the appropriate sort icon.
const getSortIcon = (field) => {
  if (sortColumn.value !== field) return "ChevronsUpDown";
  return sortDirection.value === "asc" ? "ChevronUp" : "ChevronDown";
};
// Pagination handler.
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};
// ✅ Watch for notification trigger
watch(
      () => {
        if (isNotify.value) showNotification();
      },
      () => {
        return isNotify.value;
      }
    );
</script>
<style scoped>
/* Add any Sales Tax–specific styles here */
</style>