<template>
  <SettingLayout current-tab="credit-card">
    <div class="grid grid-cols-12 gap-10">
      <div class="col-span-12 mb-10">
        <SuccessAlert v-if="isSaved">
          {{ alertMessage }}
          <button type="button" class="btn-close" @click="isSaved = false">
            <Lucide icon="X" class="w-4 h-4" />
          </button>
        </SuccessAlert>

        <div class="flex items-center pb-5">
          <h2 class="text-2xl font-medium mr-auto">Credit Card</h2>
        </div>

        <div v-if="!isLoaded" class="flex flex-col items-center py-10">
          <LoadingIcon icon="grid" class="w-20" />
          <div class="text-center text-xl mt-2">Loading...</div>
        </div>

        <div
          class="alert alert-outline-danger alert-dismissible mb-2 yr-danger bg-white text-normal tracking-wide show"
          v-if="isConnectionFail"
        >
          <h2 class="text-2xl font-medium text-center">
            Payment gateway service down. Please try later
          </h2>
        </div>

        <!-- BEGIN: Data List -->
        <div
          v-if="isLoaded && !isConnectionFail"
          class="overflow-auto lg:overflow-visible"
        >
          <Card></Card>
        </div>
        <!-- END: Data List -->

        <Modalbox :is-open="isPaymentGatewayModal" @close="isPaymentGatewayModal = false"></Modalbox>
      </div>
    </div>
  </SettingLayout>
</template>

<script setup>
import SettingLayout from "../Setting-layout.vue";
import Card from "./Card.vue";
import Modalbox from "./Modalbox.vue";
import { ref, watchEffect, onMounted } from "vue";
import { usePaymentGateway } from "@/compositions/settings/payment-gateways";
	const isLoaded = ref(false);
	const {
		status,
		isSaved,
		alertMessage,
		isConnectionFail,
		fetchOptions,
		isPaymentGatewayModal
	} = usePaymentGateway();

	onMounted(() => {
		fetchOptions();
	});

	watchEffect(() => {
		if (status.value === 200) isLoaded.value = true;
		if (status.value == 503) isLoaded.value = true;
		if (isSaved.value == true) isPaymentGatewayModal.value = false
	});
</script>
