<template>
  <div class="" v-if="!showLoadingIcon && isSaved && showPaymentConfirmed">
    <div class="p-5 text-center">
      <Lucide icon="CheckCircle" class="w-16 h-16 text-theme-9 mx-auto mt-3" />
      <div class="text-3xl mt-5">Success!</div>
      <div class="text-gray-600 mt-2">Payment has been recorded!</div>
    </div>
    <div class="px-5 pb-8 text-center">
      <button type="button" @click="closeModal()" class="btn btn-primary w-24">
        Close
      </button>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { usePayment } from "@/compositions/payment/index";

export default defineComponent({
  setup() {
    const { showLoadingIcon, isSaved, showPaymentConfirmed, closeModal } = usePayment();

    return {
      showLoadingIcon,
      showPaymentConfirmed,
      isSaved,
      closeModal,
    };
  },
});
</script>
