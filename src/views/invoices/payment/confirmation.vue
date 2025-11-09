<template>
  <div
    v-if="showLoadingIcon && !isSaved && showPaymentConfirmed"
    class="top-0 right-0 left-0 bottom-0 w-full bg-white z-50"
  >
    <div class="w-16 mx-auto pt-20">
      <Lucide icon="CheckCircle" class="w-16 h-16 text-theme-9 mx-auto mt-3" />
    </div>
    <div class="text-center text-xl pt-2 font-semibold pb-2">Payment Confirmation</div>
    <div class="px-5 pb-20 text-center">
      <button type="button" class="btn btn-primary pr-5" @click="closeModal()">
        Complete Payment
      </button>

      <button type="button" class="btn btn-danger" @click="closeModal()">
        Void Payment
      </button>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { usePayment } from "@/compositions/payment/index";

export default defineComponent({
  setup() {
    const { closeModal, showLoadingIcon, isSaved, showPaymentConfirmed } = usePayment();

    // showLoadingIcon.value = false;
    // isSaved.value = true;

    return {
      showLoadingIcon,
      isSaved,
      showPaymentConfirmed,
      closeModal,
    };
  },
});
</script>
