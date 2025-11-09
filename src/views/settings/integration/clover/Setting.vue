<template>
  <SettingLayout current-tab="pos-setting">
    <h2 class="font-medium text-2xl pb-5 truncate content-heading">POS Setting</h2>
    <form name="pos-setting" @submit.prevent="updateSetting('save')" class="box">
        <!-- <div class="border-b border-gray-200">
          
        </div> -->

      <div class="p-5 border-b border-gray-200">
        <div class="md:flex md:items-center mb-5">
          <div class="md:w-1/6">
            <label
              for="default-date-format"
              class="block font-medium text-gray-700 mb-2 md:mb-0 pr-4 md:text-right"
            >
              Payment Device</label
            >
          </div>
          <div class="md:w-4/6 mx-auto xl:mr-0 xl:ml-4">
            <TomSelect
              v-model="cloverSettings.device"
              :options="{
                search: true,
                classNames: 'w-full form-control',
              }"
            >
              <option value="">Select Clover Device</option>
              <option v-for="(dt, k) in devices" :key="k" :value="dt.value">
                {{ dt.name }}
              </option>
            </TomSelect>
          </div>
        </div>

        <div class="md:flex md:items-center mb-2">
          <div class="md:w-1/6">
            <label
              for="default-currency"
              class="block font-medium text-gray-700 mb-2 md:mb-0 pr-4 md:text-right"
            >
              Printer Device</label
            >
          </div>
          <div class="md:w-4/6 mx-auto xl:mr-0 xl:ml-4">
            <TomSelect
              v-model="cloverSettings.printer"
              :options="{
                search: true,
                classNames: 'w-full form-control',
              }"
            >
              <option value="">Select Printer</option>
              <option v-if="printers.length > 0 "v-for="(p, k) in printers" :key="k" :value="p.id">
                {{ p.id }} - {{ p.name }}
              </option>
            </TomSelect>
          </div>
        </div>

        <div class="md:flex md:items-center">
          <div class="md:w-1/6"></div>

          <div class="md:w-4/6 flex items-start mx-auto xl:mr-0 xl:ml-4">
            <div class="font-medium my-3">
              <Checkbox
                classes="ml-1"
                v-model:checked="cloverSettings.isTipEnabled"
                :true-value="true"
                :false-value="false"
              >
                Enable Tip Screen
              </Checkbox>
            </div>
          </div>
        </div>
      </div>

      <div class="p-5">
        <button
          type="submit"
          class="btn btn-primary"
          :class="{ disable: showLoadingIcon }"
          :disabled="showLoadingIcon"
        >
          <span v-if="!showLoadingIcon">Save changes</span>
          <LoadingIcon icon="oval" color="white" class="w-5 h-5" v-if="showLoadingIcon" />
        </button>
      </div>
    </form>
  </SettingLayout>
</template>

<script setup>
import { watch, onMounted } from "vue";
import SettingLayout from "@/views/settings/Setting-layout.vue";
import {
  useClover,
  RegisteredDevices,
  showNotification,
} from "@/compositions/clover/index";

    const {
      showLoadingIcon,
      validationErrors,
      devices,
      printers,
      cloverSettings,
      updateSetting,
      isSaved,
    } = useClover();


    // Notification for success / error
    watch(isSaved, () => {
      if (isSaved.value) showNotification();
    });

    onMounted(() => {
      RegisteredDevices();
    });
</script>
