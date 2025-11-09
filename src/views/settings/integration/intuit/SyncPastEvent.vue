<template>
  <div class="pb-5">
    <div class="border-b mb-5">
      <h2 class="text-lg font-medium tracking-wider px-3 pt-3">Sync Past Events</h2>

      <p class="text-sm tracking-wider px-3 py-3">
        <b>Whats's this?</b> When you first set up your QuickBooks integration , only
        financial events created after that point are synced. if you want to sync events
        created before that time, you can use this tool. Transactions that need to be
        resynced are listed as "Never Synced" on th Financial Events tab
      </p>
    </div>

    <SuccessAlert :cssClass="['mx-5' ,'py-3.5']" v-if="isAlert">
        {{alertMessage}}
        <button type="button" class="btn-close" @click="isAlert = false">
            <Lucide icon="X" class="w-4 h-4" />
        </button>
    </SuccessAlert>

    <div class="w-full px-5 flex">
      <div class="relative z-50 mr-3">
        <Litepicker
          placeholder="Start Date"
          class="form-control yr-form-control pr-12"
          :class="{ 'border-theme-6': validate.startDate.$error }"
          v-model="form.startDate" 
          :options="{
            autoApply: false,
            showWeekNumbers: true,
            dropdowns: {
              minYear: 1990,
              maxYear: null,
              months: true,
              years: true,
            },
          }"
        />
        <div
          class="absolute right-0 top-0 rounded-r w-10 h-full flex items-center justify-center bg-gray-100 border-2 text-gray-600"
          :class="{ 'border-theme-6': validate.endDate.$error }"
        >
          <Lucide icon="Calendar" class="w-4 h-4" />
        </div>
      </div>

      <div class="relative mr-3">
        <Litepicker
          placeholder="End Date"
          class="form-control yr-form-control pr-12 -ml-1"
          :class="{ 'border-theme-6': validate.endDate.$error }"
          v-model="form.endDate" 
          :options="{
            autoApply: false,
            showWeekNumbers: true,
            dropdowns: {
              minYear: 1990,
              maxYear: null,
              months: true,
              years: true,
            },
          }"
        />
        <div
          class="absolute right-0 top-0 rounded-r w-10 h-full flex items-center justify-center bg-gray-100 border-2 text-gray-600"
          :class="{ 'border-theme-6': validate.endDate.$error }"
        >
          <Lucide icon="Calendar" class="w-4 h-4" />
        </div>
      </div>
      <div class="relative mr-3">
        <TomSelect
          :options="{
            search: true,
            classNames: 'w-full',
          }"
          :class="{ 'error-border-2': validate.eventType.$error }"
          v-model="form.eventType"
        >
          <option>Select Event Type</option>
          <option value="customer">Customer</option>
          <option value="item">Product & Services</option>
          <option value="invoice">Invoice</option>
        </TomSelect>
      </div>
    </div>

    <div class="flex px-5 mt-3 pb-5">
      <button
        type="button"
        class="btn btn-primary px-10 tracking-wider rounded-full"
        :class="{ disable: SyncLoadingIcon }"
        :disabled="SyncLoadingIcon"
        @click="filter">
        <span v-if="!SyncLoadingIcon">Sync</span>
        <LoadingIcon icon="oval" color="white" class="w-5 h-5" v-if="SyncLoadingIcon" />
      </button>
    </div>


    <div v-if="!isEventLoaded && isFiltered" class="flex flex-col items-center py-10">
        <LoadingIcon icon="grid" class="w-20" />
        <div class="text-center text-xl mt-2">Loading...</div>
    </div>
    <div class="overflow-auto lg:overflow-visible" v-if="events.length > 0 && isEventLoaded">
        <table  class="table bg-white border-t">
            <thead class="border-b">
            <tr>
                <td><div>Status</div></td>
                <td><div>Date</div></td>
                <td><div>Type</div></td>
            </tr>
            </thead>
            <tbody>
                <tr v-for="(event,index) in events">
                    <td>
                     <span class="bg-yellow-100 text-xs px-2 py-1 rounded-md tracking-widest uppercase border-theme-12 border"
                     
                     v-if="event.status == 'processing'">{{ event.status }}</span>

                     <span class="bg-green-100 text-xs px-2 py-1 rounded-md tracking-widest uppercase border-theme-8 border"
                     
                     v-if="event.status == 'completed'">{{ event.status }}</span>
                    </td>

                    <td>
                     <span class="bg-green-50 text-xs px-2 py-1 rounded-md tracking-widest uppercase border-theme-8 border">{{ $h.formatDate(event.startDate,'d MMM, YYYY') }} - {{ $h.formatDate(event.endDate,'d MMM, YYYY') }}</span>
                    </td>

                    <td>
                     <span class="bg-green-50 text-xs px-2 py-1 rounded-md tracking-widest uppercase border-theme-8 border">{{ event.eventType }}</span>
                    </td>                    
                </tr>
            </tbody>
        </table>
    </div>


  </div>
</template>

<script>
import { defineComponent, onMounted, watchEffect } from "vue";
import { useSyncPastEvent } from "@/compositions/intuit/integrations";

export default defineComponent({
  setup() {
    const {
      SyncLoadingIcon,
      validate,
      isAlert,
      alertMessage,
      form,
      eventTypes,
      filter,
      fetchSyncEventList,
      events,
      isEventLoaded,
      isFiltered
    } = useSyncPastEvent();

    onMounted(() => {
        fetchSyncEventList()
    })

    watchEffect(() => { 
        if(isFiltered.value) {
          fetchSyncEventList()
        }             
    })

    return {
      SyncLoadingIcon,
      validate,
      isAlert,
      alertMessage,
      form,
      eventTypes,
      filter,
      events,
      isEventLoaded,
      isFiltered,
    };
  },
});
</script>
