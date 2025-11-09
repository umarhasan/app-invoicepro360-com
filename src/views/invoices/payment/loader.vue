<template>
  <div
    v-if="showLoadingIcon && !isSaved && !showPaymentConfirmed"
    class="top-0 right-0 left-0 bottom-0 w-full bg-white z-50"
  >
    <div class="w-16 mx-auto pt-20">
      <LoadingIcon icon="grid" color="grey" class="w-2 h-2" />
    </div>
    <div class="text-center text-xl pt-2 font-semibold pb-2">Payment Processing...</div>
    <div class="px-5 pb-20 text-center">
      <button type="button" class="btn btn-primary" @click="updatePaymentRequest()">
        Payment Cancel
      </button>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { usePayment } from "@/compositions/payment/index";

export default defineComponent({
  setup() {
    const {
      showLoadingIcon,
      isSaved,
      updatePaymentRequest,
      showPaymentConfirmed,
    } = usePayment();

    // showLoadingIcon.value = false;
    // isSaved.value = true;

    return {
      showLoadingIcon,
      isSaved,
      updatePaymentRequest,
      showPaymentConfirmed,
    };
  },
});
</script>
