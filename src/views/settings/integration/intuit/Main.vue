<template>
  <SettingLayout current-tab="integrations">
    <div class="alert alert-danger-soft show my-2" v-if="validationErrors">
      <ul>
        <li v-for="(err, index) in validationErrors" :key="index">
          {{ err }}
        </li>
      </ul>
      <button
        type="button"
        class="absolute right-2 top-2 bg-white px-2 py-1 rounded"
        @click="validationErrors = null"
      >
        <Lucide icon="X" class="w-4 h-4" />
      </button>
    </div>

    <div class="box col-span-12 xxl:col-span-6">
      <div
        class="flex items-center px-5 py-5 sm:py-0 border-b border-gray-200 dark:border-ddark-5"
      >
        <h2 class="font-medium text-base mr-auto">Intuit Integration</h2>
        <div class="nav nav-tabs ml-auto sm:flex" role="tablist">
          <a
            data-toggle="tab"
            data-target="#configuration-tab"
            href="javascript:;"
            class="py-5 ml-6 active"
            role="tab"
            aria-selected="true"
            >Configuration</a
          >
          <a
            data-toggle="tab"
            data-target="#chart-account-tab"
            href="javascript:;"
            class="py-5 ml-6"
            role="tab"
            aria-selected="false"
            >Chart of Accounts</a
          >
          <a
            data-toggle="tab"
            data-target="#sync-failed-tab"
            href="javascript:;"
            class="py-5 ml-6"
            role="tab"
            aria-selected="false"
            >Sync Failed</a
          >
        </div>
      </div>
      <div class="tab-content">
        <!-- BEGIN: Configuration -->
        <div
          id="configuration-tab"
          class="tab-pane active"
          role="tabpanel"
          aria-labelledby="configuration-tab"
        >
          <div class="flex p-5">
            <div class="flex items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Intuit_QuickBooks_logo.svg/512px-Intuit_QuickBooks_logo.svg.png"
                class="image img w-36"
              />
            </div>

            <div class="px-5 flex items-center">
              <h2 class="text-lg font-medium tracking-wder hidden">Configuration</h2>
              <p class="text-sm tracking-wider pl-1" v-if="isIntuitAccessTokenValid">
                Invoicepro360 is connected to your QuicksBooks Online account.
              </p>
              <p class="text-sm tracking-wider pl-1" v-if="!isIntuitAccessTokenValid">
                Please click "connect" and use your credentials to finish the connection.
              </p>
            </div>
          </div>

          <div class="flex flex-row justify-end pr-10 pb-5 border-b border-gray-200">
            <button
              type="button"
              class="btn btn-secondary px-7 mr-1 rounded-full border border-theme-8"
              :class="{ disable: AccountLoadingIcon }"
              :disabled="AccountLoadingIcon"
              v-if="isIntuitAccessTokenValid"
              @click="ImportChartofAccounts()"
            >
              <span v-if="!AccountLoadingIcon">Import Accounts</span>
              <LoadingIcon
                icon="oval"
                color="white"
                class="w-5 h-5"
                v-if="AccountLoadingIcon"
              />
            </button>

            <button
              type="button"
              class="btn btn-primary px-7 mr-1 rounded-full"
              :class="{ disable: ConnectLoadingIcon }"
              :disabled="ConnectLoadingIcon"
              @click="Connect()"
              v-if="!isIntuitAccessTokenValid || !intuitSyncSettings.isConnected"
            >
              <span v-if="!ConnectLoadingIcon">Connect</span>
              <LoadingIcon
                icon="oval"
                color="white"
                class="w-5 h-5"
                v-if="ConnectLoadingIcon"
              />
            </button>

            <button
              type="button"
              class="btn btn-primary px-7 mr-1 rounded-full"
              :class="{ disable: ConnectLoadingIcon }"
              :disabled="ConnectLoadingIcon"
              @click="Disconnect()"
              v-if="isIntuitAccessTokenValid && intuitSyncSettings.isConnected"
            >
              <span v-if="!ConnectLoadingIcon">Disconnect</span>
              <LoadingIcon
                icon="oval"
                color="white"
                class="w-5 h-5"
                v-if="ConnectLoadingIcon"
              />
            </button>

            <button
              type="button"
              class="btn btn-primary px-7 mr-1 rounded-full"
              :class="{ disable: PauseLoadingIcon }"
              :disabled="PauseLoadingIcon"
              v-if="isIntuitAccessTokenValid && !intuitSyncSettings.isPaused"
              @click="Paused()"
            >
              <span v-if="!PauseLoadingIcon">Pause</span>
              <LoadingIcon
                icon="oval"
                color="white"
                class="w-5 h-5"
                v-if="PauseLoadingIcon"
              />
            </button>

            <button
              type="button"
              class="btn btn-primary px-7 mr-1 rounded-full"
              :class="{ disable: PauseLoadingIcon }"
              :disabled="PauseLoadingIcon"
              v-if="isIntuitAccessTokenValid && intuitSyncSettings.isPaused"
              @click="Resume()"
            >
              <span v-if="!PauseLoadingIcon">Resume</span>
              <LoadingIcon
                icon="oval"
                color="white"
                class="w-5 h-5"
                v-if="PauseLoadingIcon"
              />
            </button>
          </div>

          <div v-if="isIntuitAccessTokenValid">
            <SyncSettingForm />
          </div>

          <div v-if="isIntuitAccessTokenValid">
            <SyncPastEvent />
          </div>
        </div>
        <!-- END: Configuration -->
        <!-- BEGIN: Chart of accounts -->
        <div
          id="chart-account-tab"
          class="tab-pane"
          role="tabpanel"
          aria-labelledby="chart-account-tab"
        >
          <ChartofAccounts />
        </div>
        <!-- END: Chart of accounts -->

        <!-- BEGIN: Sync failed -->
        <div
          id="sync-failed-tab"
          class="tab-pane"
          role="tabpanel"
          aria-labelledby="sync-failed-tab"
        >
          <SyncFailed />
        </div>
        <!-- END: Sync failed -->
      </div>
    </div>
  </SettingLayout>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import SettingLayout from "@/views/settings/Setting-layout.vue";

import { useIntegration, useChartofAccount } from "@/compositions/intuit/integrations";
import SyncPastEvent from "./SyncPastEvent.vue";
import SyncSettingForm from "./SyncSettingForm.vue";
import ChartofAccounts from "./ChartofAccounts.vue";
import SyncFailed from "./SyncFailed.vue";

export default {
  components: {
    SettingLayout,
    SyncPastEvent,
    SyncSettingForm,
    ChartofAccounts,
    SyncFailed,
  },
  setup() {
    const formTitle = ref("Intuit Integration");
    const {
      ConnectLoadingIcon,
      PauseLoadingIcon,
      validationErrors,
      getIntuitRedirect,
      Connect,
      Disconnect,
      Paused,
      Resume,
      intuitSyncSettings,
      isIntuitAccessTokenValid,
    } = useIntegration();

    const { AccountLoadingIcon, ImportChartofAccounts } = useChartofAccount();

    onMounted(() => {
      getIntuitRedirect();
    });

    const goBack = () => {
      router.push({ name: "integrations" });
    };

    return {
      formTitle,
      ConnectLoadingIcon,
      PauseLoadingIcon,
      validationErrors,
      goBack,
      Connect,
      Disconnect,
      Paused,
      Resume,
      intuitSyncSettings,
      isIntuitAccessTokenValid,
      AccountLoadingIcon,
      ImportChartofAccounts,
    };
  },
};
</script>
