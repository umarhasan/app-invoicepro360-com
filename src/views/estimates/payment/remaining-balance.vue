<template>
  <!-- Remaining Balance-->
  <div class="w-full text-center" v-if="isModalbox">
    <div class="">
      <span class="text-base font-medium">Remaining Balance: </span>
      <span class="text-primary font-bold text-xl leading-9"
            v-html="$h.formatCurrency(displayAmountDue)"></span>
    </div>
  </div>

  <div v-if="!isModalbox">
    <div class="">
      <span class="text-base font-medium">Amount Paid: </span>
      <span class="font-semibold text-xl leading-9"
        v-html="$h.formatCurrency(displayAmountPaid)"></span>
      <div class="">
        <span class="text-base font-medium">Amount Due: </span>
        <span class="font-semibold text-xl leading-9"
          v-html="$h.formatCurrency(displayAmountDue)"></span>
      </div>
    </div>
  </div>
  <!-- Remaining Balance-->
</template>
<script setup>

import { usePayment } from "@/compositions/payment/index";

const props = defineProps(['isModalbox'])
const { displayAmountDue,displayAmountPaid } = usePayment();

</script>
