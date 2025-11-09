<template>
  <div class="content">
    <div v-if="permissions.view">
      <TopBar
        create-link-route="add-product"
        create-link-text="Add a New Product or Service"
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
          <div class="flex">
            <!-- Type Filter -->
            <div class="w-60 relative text-gray-700">
              <TomSelect
                v-model="selectedType"
                :options="{
                  search: false,
                  classNames: 'w-full',
                  placeholder: 'Select Product Type'
                }"
                @update:modelValue="onTypeChange"
              >
                <option value="product">Product</option>
                <option value="service">Service</option>
              </TomSelect>
            </div>
            <!-- Text Search -->
            <div class="w-60 relative text-gray-700 ml-2">
              <input
                type="text"
                class="form-control yr-form-control w-60 placeholder-theme-13"
                placeholder="Name or description"
                v-model="filter"
                @input="onSearch"
              />
              <Lucide
                icon="Search"
                class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
              />
            </div>
          </div>
        </template>
      </TopBar>

      <!-- HTML Table Data -->
      <div class="intro-y">
        <div class="scrollbar-hidden">
          <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
            <Table class="my-2 table">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>      
                  <Table.Th @click="sort('name')" class="border-b-0 whitespace-nowrap"> NAME <Lucide :icon="getSortIcon('name')" class="inline w-4 h-4 ml-1" /></Table.Th>
                  <Table.Th @click="sort('price')" class="border-b-0 whitespace-nowrap"> PRICE<Lucide :icon="getSortIcon('price')" class="inline w-4 h-4 ml-1" /> </Table.Th>
                  <Table.Th @click="sort('description')" class="border-b-0 whitespace-nowrap"> DESCRIPTION<Lucide :icon="getSortIcon('description')" class="inline w-4 h-4 ml-1" /> </Table.Th>
                  <Table.Th @click="sort('type')" class="border-b-0 whitespace-nowrap"> TYPE<Lucide :icon="getSortIcon('type')" class="inline w-4 h-4 ml-1" /> </Table.Th>
                  <Table.Th @click="sort('status')" class="text-center border-b-0 whitespace-nowrap"> STATUS <Lucide :icon="getSortIcon('status')" class="inline w-4 h-4 ml-1" /></Table.Th>
                  <Table.Th class="text-center border-b-0 whitespace-nowrap"> ACTIONS </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr v-for="(product, index) in sortedProducts" :key="product.id">
               <Table.Td>{{ index + 1 }}</Table.Td>
                <Table.Td>
                    <a href="#" class="font-medium break-words max-w-xs">
                      {{ product.name }}
                    </a>
                  </Table.Td>
                  <Table.Td>
                    <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                      ${{ product.price }}
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <div
                      :class="product.description.length > 30
                        ? 'truncate max-w-xs cursor-help description'
                        : 'whitespace-normal break-words'"
                      :data-tooltip="product.description.length > 30
                        ? product.description
                        : null"
                    >
                      {{ product.description }}
                    </div>
                  </Table.Td>
                  <Table.Td>
                    {{ product.type }}
                  </Table.Td>
                  <Table.Td class="text-center   ">
                    <div
                      :class="[
                        'flex items-center justify-center',
                        { 'text-success': product.status === 'active' },
                        { 'text-danger': product.status !== 'active' }
                      ]"
                    >
                      <Lucide icon="CheckSquare" class="w-4 h-4 mr-2" />
                      {{ product.status === 'active' ? "Active" : "Inactive" }}
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <div class="flex items-center justify-center">
                      <router-link class="flex items-center mr-3" :to="`/product/${product.id}/edit`">
                        <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" /> Edit
                      </router-link>
                      <a
                        class="flex items-center text-danger"
                        href="#"
                        @click="setDeleteConfirmationModal(product)"
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
      <!-- End HTML Table Data -->
    </div>
    <!-- END: HTML Table Data -->
    <DeleteModal
      message="Do you really want to inactive the record?" 
      btn-text="Mark as Inactive"
      :isOpen="isDeleteModal"
      @delete="deleteProduct"
      @close="isDeleteModal = false"    
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { FormSelect } from "@/components/Form";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import { 
  fetchProduct,
  deleteProduct,
  exportCSV,
  showNotification
} from "@/compositions/products";

const {
  filter,
  selectedType,
  onSearch,
  onTypeChange,
  isNotify,
  isSaved,
  permissions,
  showLoadingIcon,
  isDeleteModal,
  products,
  currentPage,
  totalPages,
  limit,
  goToPage,
  showDeleteModal,
  getProducts,
  sortColumn,
  sortDirection,
  sort,
} = fetchProduct();

const setDeleteConfirmationModal = (product) => {
  showDeleteModal(product);
};

onMounted(() => {
  tippy(".description", {
    content: (el) => el.getAttribute("data-tooltip"),
    placement: "top",
    delay: [100, 50],
  })
  if (isNotify.value || isSaved.value) showNotification();
  getProducts();
})

watch([isNotify, isSaved], () => {                           // ← UPDATED
  if (isNotify.value || isSaved.value) showNotification();
});

// Sorting logic with icon
const getSortIcon = (column) => {
  if (sortColumn.value !== column) return "ChevronsUpDown";
  return sortDirection.value === "asc" ? "ChevronUp" : "ChevronDown";
};

const sortedProducts = computed(() => {
  if (!sortColumn.value) return products.value;
  return [...products.value].sort((a, b) => {
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
.break-words {
  word-break: break-word;
}
</style>