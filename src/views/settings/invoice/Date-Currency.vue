<template>
  <SettingLayout current-tab="date-currency">
    <form name="date-currency" @submit.prevent="updateDateCurrency" class="box">
      <div class="border-b border-gray-200">
        <h2 class="text-2xl font-medium p-5 truncate content-heading">Date & Currency</h2>
      </div>

      <div class="p-5 border-b border-gray-200">
        <div class="md:flex md:items-center mb-5">
          <div class="md:w-1/6">
            <label
              for="default-date-format"
              class="block font-medium text-gray-700 mb-2 md:mb-0 pr-4 md:text-right"
            >
              Date Format</label
            >
          </div>
          <div class="md:w-4/6 mx-auto xl:mr-0 xl:ml-4">
            <TomSelect
              v-model="setting.date_format"
              :options="{
                search: true,
                classNames: 'w-full',
              }"
            >
              <option>Select Date Format</option>
              <option v-for="(dt, k) in DateFormatList" :key="k" :value="k">
                {{ dt }}
              </option>
            </TomSelect>
          </div>
        </div>

        <div class="md:flex md:items-center">
          <div class="md:w-1/6">
            <label
              for="default-currency"
              class="block font-medium text-gray-700 mb-2 md:mb-0 pr-4 md:text-right"
            >
              Currency</label
            >
          </div>
          <div class="md:w-4/6 mx-auto xl:mr-0 xl:ml-4">
            <TomSelect
              v-model="setting.currency"
              :options="{
                search: true,
                classNames: 'w-full',
              }"
            >
              <option>Select Currency</option>
              <option v-for="(c, k) in currencies" :key="k" :value="c.code">
                {{ c.code }} - {{ c.country }}
              </option>
            </TomSelect>
          </div>
        </div>
      </div>

      <div class="p-5">
        <button
          type="submit"
          class="btn btn-primary"
          :class="{ disable: showLoadingIcon.date_currency }"
          :disabled="showLoadingIcon.date_currency"
          @click="updateDateCurrency"
        >
          <span v-if="!showLoadingIcon.date_currency">Save changes</span>
          <LoadingIcon
            icon="oval"
            color="white"
            class="w-5 h-5"
            v-if="showLoadingIcon.date_currency"
          />
        </button>
      </div>
    </form>
  </SettingLayout>
</template>

<script>
import { watch } from "vue";
import SettingLayout from "../Setting-layout.vue";
import { useSettings, showNotification } from "@/compositions/invoices/settings";

export default {
  components: {
    SettingLayout,
  },
  setup() {
    const {
      setting,
      updateDateCurrency,
      showLoadingIcon,
      currencies,
      DateFormatList,
      isSaved,
    } = useSettings();

    // Notification for sucess / error
    watch(isSaved, () => {
      if (isSaved.value) showNotification();
    });

    return {
      setting,
      currencies,
      DateFormatList,
      updateDateCurrency,
      showLoadingIcon,
    };
  },
};
</script>
