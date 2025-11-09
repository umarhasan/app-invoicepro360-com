<template>
  <div v-click-away="hideCustomerDropdown" class="w-full">
    <div v-if="!customerLoaded" class="w-12 ">
      <LoadingIcon icon="oval" color="grey" class="w-2 h-2" />
      loading...
    </div>
    <div v-if="customerLoaded" class="flex items-center justify-center">
      <!-- <button
        v-if="!showCustomerDropdown && !isCustomerPreview"
        class="btn btn-outline-primary border-dashed hover:bg-theme-5 w-52 text-lg dark:border-dark-3 dark:text-white"
        type="button"
        name="add-customer-btn"
        @click="addCustomer"
      >
        New Customer
      </button> -->

      <button
        v-if="!showCustomerDropdown && !isCustomerPreview"
        class="btn btn-lg btn-secondary w-50  text-md dark:border-dark-3 dark:text-white"
        type="button"
        name="add-customer-btn"
        @click="addCustomer"
      >
       <Lucide icon="User" class="w-5 h-5 me-2"></Lucide> New Customer
      </button>

      <div v-if="showCustomerDropdown" class="invoice-customer-box w-full">
        <CustomerDropdown
          :customer-id="customerId"
          :customer-list="customers"
          :permissions="permissions"
          placeholder="Search by customer name or email"
          @selectCustomer="selectCustomer"
          @showCustomerModal="showCustomerModal"
          class="w-full"
        >
        </CustomerDropdown>
      </div>
      
      <div
        v-if="isCustomerPreview"
        class="customer-preview w-full p-2 -bg-gray-100 -border-2 -border-dashed -border-gray-150 rounded-md dark:bg-dark-3"
      >
      <div class="grid grid-cols-2 gap-6">
          <div >
            <h3 class="font-semibold text-lg mb-2">Billed To:</h3>
            <div class="details leading-6">
              <p>{{ billedCustomer.customer}}</p>
              <p>{{billedCustomer.firstName + ' ' + billedCustomer.lastName }}</p>
              <p>{{billedCustomer.billingAddressLine1}}</p>
              <p>{{billedCustomer.billingAddressLine2}}</p>
              <p>{{billedCustomer.billingCity}}, {{billedCustomer.billingState}} {{billedCustomer.billingZipcode}}</p>
              <p>{{billedCustomer.billingCountry}}</p>              
              <p>{{billedCustomer.email}}</p>
              <p>{{billedCustomer.phoneNumber ?? billedCustomer.mobileNumber}}</p>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-lg mb-2">Billed To:</h3>
            <div class="details leading-6">
              <p>{{ billedCustomer.shippingName ?? billedCustomer.customer }}</p>
              <p>{{billedCustomer.shippingAddressLine1}}</p>
              <p>{{billedCustomer.shippingAddressLine2}}</p>
              <p>{{billedCustomer.shippingCity}}, {{billedCustomer.shippingState}} {{billedCustomer.shippingZipcode}}</p>
              <p>{{billedCustomer.shippingCountry}}</p>              
              <p >{{billedCustomer.shipppingPhoneNumber ?? billedCustomer.phoneNumber}}</p>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <button
            name="edit-customer-btn"
            class="export-btn border-slate-300 mx-1"
            @click="editCustomer"
            v-if="permissions.updateCustomer"
          >
            Edit {{ billedCustomer.customer }}
          </button>
          <button
            name="change-customer-btn"
            class="export-btn border-slate-300 mx-1"
            @click="addCustomer"
          >
            Change Customer
          </button>
        </div>
      </div>
    </div>
    <CustomerModal 
    :isOpen="isOpenCustomerModal"
    @setBilledCustomer="setBilledCustomer"
    @close="isOpenCustomerModal = false"
    ></CustomerModal>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { useCustomer } from "@/compositions/estimates/customer";
import CustomerDropdown from "./CustomerDropdown.vue";
import CustomerModal from "./CustomerModal.vue";

const emits = defineEmits(['setCustomerEmail'])
    const customerLoaded = ref(false);
    const {
      addCustomer,
      editCustomer,
      fetchCustomer,
      hideCustomerDropdown,
      selectCustomer,
      showCustomerModal,
      setBilledCustomer,
      showCustomerDropdown,
      customers,
      isCustomerLoaded,
      billedCustomer,
      customerId,
      isCustomerPreview,
      permissions,
      isOpenCustomerModal,
    } = useCustomer();

    onMounted(() => {
      fetchCustomer();
      emits('setCustomerEmail',billedCustomer.value.email)
    });

    watchEffect(() => {
        if (isCustomerLoaded.value) 
        {
          customerLoaded.value = true;
        }
      }
    );
</script>
