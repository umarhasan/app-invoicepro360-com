<template>
  <SettingLayout current-tab="payment-types">
    <div class="grid grid-cols-12 gap-10">
      <div class="col-span-12 mb-10">
        <DangerAlert v-if="error">
          {{ error }}
          <button type="button" class="btn-close" @click="error = null">
            <Lucide icon="X" class="w-4 h-4" />
          </button>
        </DangerAlert>
        <SuccessAlert v-if="isSaved">
          Payment types saved successfully.
          <button type="button" class="btn-close" @click="isSaved = false">
            <Lucide icon="X" class="w-4 h-4" />
          </button>
        </SuccessAlert>

        <div class="flex items-center pb-5">
          <h2 class="mr-auto truncate">Payment Types</h2>

          <router-link
            v-if="permissions.create"
            class="add-btn flex gap-1"
            :to="{ name: 'add-payment-types' }"
            tag="button"
          >
          <Plus />
          <Lucide icon="Plus" class="w1 h1" />
            Add Payment Types
          </router-link>
        </div>

        <div v-if="!isLoaded" class="flex flex-col items-center py-10">
          <LoadingIcon icon="grid" class="w-20" />
          <div class="text-center text-xl mt-2">Loading...</div>
        </div>

        <!-- BEGIN: Data List -->
        <div v-if="isLoaded" class="overflow-auto lg:overflow-visible">
          <Table
            :columns="columns"
            :records="records"
            :can-create="permissions.create"
            :can-edit="permissions.edit"
            :can-delete="permissions.delete"
            @deleteType="showDeleteModal"
          ></Table>
        </div>
        <!-- END: Data List -->
      </div>
    </div>
    <DeleteModal @delete="confirmDelete"></DeleteModal>
  </SettingLayout>
</template>

<script>
import SettingLayout from "../Setting-layout.vue";
import Table from "./Table.vue";
import { usePaymentTypes , showNotification } from "@/compositions/settings/payment-types";
import { defineComponent, ref, onMounted, watchEffect , watch } from "vue";

export default defineComponent({
  components: {
    SettingLayout,
    Table,
  },
  setup() {
    const columns = [
      { name: "Name", isCenter: false },
      { name: "Descripiton", isCenter: false },
      { name: "Action", isCenter: true },
    ];

    const isLoaded = ref(false);
    const {
      records,
      error,
      status,
      isSaved,
      isDeleted,
      permissions,
      fetchPaymentTypes,
      confirmDelete,
      showDeleteModal,
    } = usePaymentTypes();

    onMounted(() => {
      fetchPaymentTypes();
    });

    watchEffect(() => {
      if (status.value === 200) isLoaded.value = true;
    });

    /* pop‑notification on first load & subsequent saves */
    watch(
    isSaved,
    (val) => {
        if (val) showNotification();
    },
    { immediate: true } // show toast if isSaved was already true
    );

    return {
      columns,
      records,
      isLoaded,
      confirmDelete,
      showDeleteModal,
      error,
      isSaved,
      isDeleted,
      permissions,
    };
  },
});
</script>
