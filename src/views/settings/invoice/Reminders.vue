<template>
  <SettingLayout current-tab="invoice-reminders">
    <form name="invoice-reminders" @submit.prevent="updateReminderDays" class="box">
      <div class="border-b border-gray-200">
        <h2 class="text-2xl font-medium p-5 truncate content-heading">Invoice Reminder</h2>
        <div class="text-gray-800 text-sm hidden">
          Follow up on overdue invoices by sending gentle reminders to your customers
        </div>
      </div>

      <div class="p-5 border-b border-gray-200 mb-5">
        <span class="text-base font-medium text-gray-700">After Due Date Reminder</span>
        <div class="mt-2 ml-5">
          <Checkbox
            v-for="day in reminderDayList"
            :key="day"
            classes="mb-3"
            v-model:checked="setting.reminder_days"
            :true-value="day"
            :false-value="0"
          >
            {{ day }} Days
          </Checkbox>
        </div>
      </div>

      <div class="pl-5 pb-5">
        <button
          type="submit"
          class="btn btn-primary"
          :class="{ disable: showLoadingIcon.reminder_days }"
          :disabled="showLoadingIcon.reminder_days"
          @click="updateReminderDays"
        >
          <span v-if="!showLoadingIcon.reminder_days">Save changes</span>
          <LoadingIcon
            icon="oval"
            color="white"
            class="w-5 h-5"
            v-if="showLoadingIcon.reminder_days"
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
      reminderDayList,
      updateReminderDays,
      showLoadingIcon,
      isSaved,
    } = useSettings();

    // Notification for sucess / error
    watch(isSaved, () => {
      if (isSaved.value) showNotification();
    });

    return {
      setting,
      reminderDayList,
      updateReminderDays,
      showLoadingIcon,
    };
  },
};
</script>
