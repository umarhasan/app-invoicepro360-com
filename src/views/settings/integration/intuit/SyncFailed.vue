<template>
  <div>
    <div class="w-full p-5 flex border-b">
      <div class="relative mr-3">
        <TomSelect
          :options="{
            search: false,
            classNames: 'w-full',
          }"
          :class="{ 'error-border-2': validate.type.$error }"
          v-model="form.type"
        >
          <option>Select Module Type</option>
          <option value="customer">Customer</option>
          <option value="item">Product & Services</option>
          <option value="invoice">Invoice</option>
        </TomSelect>
      </div>
      <div class="relative mr-3">
        <TomSelect
          :options="{
            search: false,
            classNames: 'w-full',
          }"
          :class="{ 'error-border-2': validate.status.$error }"
          v-model="form.status"
        >
          <option>Select Sync Status</option>
          <option value="action-required">Action Required</option>
          <option value="never-sync">Never Sync</option>
          <option value="synced">Synced</option>
        </TomSelect>
      </div>

      <div class="relative mr-3">
        <button
          type="button"
          class="btn btn-primary px-10 tracking-wider rounded-full"
          :class="{ disable: SyncFailedLoadingIcon }"
          :disabled="SyncFailedLoadingIcon"
          @click="filter"
        >
          <span v-if="!SyncFailedLoadingIcon">Filter</span>
          <LoadingIcon
            icon="oval"
            color="white"
            class="w-5 h-5"
            v-if="SyncFailedLoadingIcon"
          />
        </button>
      </div>
    </div>
    <div v-if="!isSyncFailedLoaded" class="flex flex-col items-center py-10">
      <LoadingIcon icon="grid" class="w-20" />
      <div class="text-center text-xl mt-2">Loading...</div>
    </div>
    <div class="x-overflow-auto" v-if="records.length > 0 && isSyncFailedLoaded">
      <table class="table bg-white border-t">
        <thead class="border-b">
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Error Message</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in records">
            <td>
              <div
                class="bg-yellow-100 text-xs px-2 py-1 rounded-md tracking-widest capitalize border-theme-12 border"
              >
                {{ record.status.replace("-", " ") }}
              </div>
            </td>

            <td>{{ record.name }}</td>

            <td>
              <pre
                class="bg-red-50 text-xs px-2 py-1 rounded-md border-red-100 border overflow-scroll"
                style="width: 250px"
                >{{ JSON.parse(record.error) }}</pre
              >
            </td>
            <td>
              <a
                class="btn btn-sm btn-danger rounded-full px-3 py-1"
                href="javascript:void(0);"
                @click="Retry(record)"
              >
                Retry</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, watchEffect } from "vue";
import { useSyncFailed } from "@/compositions/intuit/integrations";

export default defineComponent({
  setup() {
    const {
      form,
      validate,
      filter,
      records,
      SyncFailedLoadingIcon,
      isSyncFailedLoaded,
      Retry,
    } = useSyncFailed();

    // onMounted( ()=> {
    //     fetchChartofAccounts()
    // })

    // watchEffect(() => {
    //     console.log(ischartofAccountLoaded.value)
    //     fetchChartofAccounts()

    // },[ischartofAccountLoaded.value])

    return {
      form,
      validate,
      filter,
      records,
      SyncFailedLoadingIcon,
      isSyncFailedLoaded,
      Retry,
    };
  },
});
</script>
