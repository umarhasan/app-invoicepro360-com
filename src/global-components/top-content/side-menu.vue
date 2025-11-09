<template>
  <div class="top-bar">
    <div class="mr-auto">
      <img alt="Invoice PRO 360" class="w-32 dash-logo" src="@/assets/images/invoice-logo.png" />
      <!-- <h1 class="text-xl font-medium mr-auto dash-title">{{ title }}</h1> -->
    </div>

    <div class="top-2 rounded-full drop-shadow-sm w-10 h-10 cursor-pointer shadow text-center transition flex items-center justify-center border bg-white dark:bg-dark-3 dark:text-white" @click="toggleDarkMode()" >
      <Lucide icon="SunMoon" class="w-6 h-6" ></Lucide>
    </div>

    <div class="sm:flex">
      <a
        href="javascript:;"
        class="flex items-center rounded-full drop-shadow-sm border-gray border h-10 px-3 p-2 mx-3 bg-white dark:bg-dark-3 dark:text-white "
        @click="showModalBox = !showModalBox"
      >
        <span class="xl:block overflow-hidden whitespace-nowrap overflow-ellipsis" >{{ currentBusinessName }}
        </span>
        <Lucide icon="ChevronDown" class="xl:block ml-1 h-4 w-4" v-if="!showModalBox" />
        <Lucide icon="ChevronUp" class="xl:block ml-1" v-if="showModalBox" />
      </a>
    </div>
    <ModalBox v-if="showModalBox" />

    <!-- BEGIN: Account Menu -->
    <div class="dropdown">
      <div
        class="dropdown-toggle w-10 h-10 flex items-center justify-center bg-white rounded-full drop-shadow-sm p-2 border overflow-hidden shadow-md dark:bg-dark-3 dark:text-white"
        role="button"
        aria-expanded="false"
        data-tw-toggle="dropdown"
      >
        <Lucide icon="User" class="w-6 h-6" />
      </div>
      <div class="dropdown-menu w-56">
        <div class="dropdown-menu__content box">
          <div class="p-4 border-b border-theme-27">
            <div class="font-medium">{{ user.firstName }} {{ user.lastName }}</div>
          </div>

          <div class="p-2">
            <router-link
              to="/user/profile"
              class="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md"
            >
              <Lucide icon="User" class="w-4 h-4 mr-2" />Manage Profile
            </router-link>

            <router-link
              :to="{ name: 'add-businesses' }"
              class="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md"
            >
              <Lucide icon="Edit" class="w-4 h-4 mr-2" /> Create new Business
            </router-link>

            <router-link
              :to="{ name: 'businesses' }"
              class="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md"
              @click="$emit('closeModalBox')"
            >
              <Lucide icon="List" class="w-4 h-4 mr-2" />
              View all Businesses</router-link
            >
          </div>

          <div class="p-2 border-t border-theme-27">
            <a
              href="javascript:;"
              @click="logout()"
              class="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md"
            >
              <Lucide icon="ToggleRight" class="w-4 h-4 mr-2" /> Logout
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Account Menu -->
  </div>

  <div
    class="alert alert-primary show mt-5 mx-10 hidden"
    role="alert"
    v-if="!isIntuitAccessTokenValid && !isHideIntuitAlert && isSetup"
  >
    <div class="flex items-center">
      <div class="font-medium text-lg">QuickBooks Sync Alert</div>

      <button type="button" class="btn-close top" @click="hideIntuitAlert">
        <Lucide icon="X" class="w-4 h-4" />
      </button>
    </div>
    <div class="mt-3 mb-3">
      Navigate to Settings > Quickbooks integration <br />
      Please click "connect" and use your credentials to finish the connection.
    </div>

    <router-link
      tag="button"
      :to="{ name: 'intuit-integration' }"
      class="rounded-md bg-white bg-opacity-20 dark:bg-darkmode-300 hover:bg-opacity-30 py-1 px-5 mt-2"
    >
      Setup
    </router-link>
  </div>
</template>

<script>
import { defineComponent, watch, ref, onMounted } from "vue";
import { useAuth } from "@/compositions/auth";

import { useUtils } from "@/compositions/utils";
import setBusiness from "@/components/set-business/Main.vue";
import ModalBox from "@/layouts/top-menu/Modal.vue";
import helper from "@/utils/helper"

export default defineComponent({
  components: {
    setBusiness,
    ModalBox,
  },
  emits: ["closeModalBox"],
  
  
  setup() {
    const { logout, user } = useAuth();
    const showModalBox = ref(false);
    const title = ref(router.currentRoute.value.meta.title);
    
    const {
      currentBusinessName,
      isSetup,
      isIntuitAccessTokenValid,
      intuitSyncSettings,
      isHideIntuitAlert,
      hideIntuitAlert,
      toggleDarkMode
    } = useUtils();

    watch(
      () => {
        return router.currentRoute.value.name;
      },
      () => {
        if (router.currentRoute.value.name == "intuit-integration") {
          isHideIntuitAlert.value = true;
        }
        title.value = router.currentRoute.value.meta.title;
      }
    );

    return {
      title,
      user,
      isSetup,
      logout,
      showModalBox,
      currentBusinessName,
      isIntuitAccessTokenValid,
      intuitSyncSettings,
      hideIntuitAlert,
      isHideIntuitAlert,
      toggleDarkMode
    };
  },
});
</script>
