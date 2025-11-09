<template>
  <SettingLayout current-tab="integrations">
    <div class="grid grid-cols-12 gap-10">
      <div class="col-span-12 mb-10">
        <SuccessAlert v-if="isSaved">
          {{ alertMessage }}
          <button type="button" class="btn-close" @click="isSaved = false">
            <Lucide icon="X" class="w-4 h-4" />
          </button>
        </SuccessAlert>

        <div class="flex items-center pb-5">
          <h2 class="text-2xl font-medium mr-auto">Integrations</h2>
        </div>

        <div class="overflow-auto lg:overflow-visible">
          <Card></Card>
        </div>        

      </div>
    </div>
  </SettingLayout>
</template>

<script>
import SettingLayout from "../Setting-layout.vue"
import { defineComponent, ref, watchEffect, onMounted } from "vue";
import Card from "./Card.vue";

export default defineComponent({
  components: {
    SettingLayout,
    Card
  },
  setup() {
    const isLoaded = ref(false);
    const isSaved = ref(false);

    const alertMessage = ref("Integrations");

    return {
      // isConnectionFail,
      alertMessage,
      isSaved,
      isLoaded
    };
  },
});
</script>
