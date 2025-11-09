<template>
  <!-- Payment types nav -->
  <div class="col-span-5" v-if="!showLoadingIcon && showPaymentForm">
    <div class="border border-gray rounded bg-theme-2 px-2 py-2 h-full">
      <ul class="flex flex-col align-items-center">      
      <li v-for="(paymentType, index) in paymentTypes" class="w-full">
        <label
          @click="selectPaymentType(paymentType)"
          :class="{
            'text-theme-1 bg-white': payment.paymentType == paymentType.type,
            'text-gray-900 bg-transparent': payment.paymentType != paymentType.type,
          }"
          class="w-full inline-flex items-center justify-between w-full px-2 py-3 cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-theme-1 hover:bg-white rounded"
        >
          <div class="flex items-center gap-2">
            <Lucide icon="CreditCard" class="w-7 h-7" ></Lucide>
            <div class="w-full font-semibold">{{ paymentType.name }}</div>
          </div>
          <svg
            class="w-2 h-2 ms-3 rtl:rotate-180 text-gray-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </label>
      </li>
    </ul>
    </div>
    
  </div>
  <!-- Payment types nav -->
</template>

<script setup>
import { usePayment } from "@/compositions/payment/index";
import Lucide from "@/global-components/Lucide/Lucide.vue";
	const {
		selectPaymentType,
		paymentTypes,
		showLoadingIcon,
		showPaymentForm,
		payment
	} = usePayment()
</script>
