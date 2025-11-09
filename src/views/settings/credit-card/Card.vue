<template>
  <div class="grid grid-cols-12 gap-5">
    <CloverCard></CloverCard>
    <div
      class="col-span-6 intro-y sm:col-span-6 2xl:col-span-4"
      v-for="(row, index) in records"
      :key="index"
    >
      <div class="box">
        <div class="p-5">
          <div
            class="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10"
          >
            <img :src="'/src/assets/images/' + row.image" class="rounded-md" :alt="row.name"/>
          </div>
        </div>
        <div
          class="flex items-center justify-center p-3 border-t lg:justify-end border-slate-200/60"
        >
          <button
            v-if="row.type == defaultPaymentGateway"
            class="btn btn-sm border-theme-11 rounded-full mr-2"
          >
            <Lucide icon="Star" class="w-4 h-4 text-theme-11" />
            <span class="pl-1 text-theme-11">Default Payment Gateway</span>
          </button>

          <button
            class="btn btn-sm text-theme-9 border-theme-9 rounded-full w-16"
            @click="showPaymentGatewayModal(row)"
          >
            <Lucide icon="Edit3" class="w-4 h-4 text-theme-9" v-if="row.status == 1" />
            <Lucide icon="LifeBuoy" class="w-4 h-4 text-theme-9" v-if="row.status == 0" />
            <span class="pl-1 text-theme-9">{{
              row.status == 1 ? "Edit" : "Setup"
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { usePaymentGateway } from "@/compositions/settings/payment-gateways";
import CloverCard from "@/views/settings/integration/clover/Main.vue";

export default defineComponent({
  components: {
    CloverCard,
  },
  setup() {
    const {
      records,
      defaultPaymentGateway,
      showPaymentGatewayModal,
    } = usePaymentGateway();

    return {
      records,
      defaultPaymentGateway,
      showPaymentGatewayModal,
    };
  },
});
</script>
