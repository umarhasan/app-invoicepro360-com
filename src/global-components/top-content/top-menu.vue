<template>
  <div
    class="border-b border-theme-3 no-print flex items-center box bg-theme-3 px-5 py-3 no-print"
  >
    <div class="mr-auto hidden sm:flex">
      <!-- BEGIN: Logo 
      <a
        href="javascript:;"
        class="intro-x flex items-center p-2 rounded-md bg-white my-1 text-theme-1"
      >
        <img alt="Invoice PRO 360" class="w-32" src="@/assets/images/invoice-logo.png" />
      </a>
       END: Logo -->
    </div>

    <div class="sm:flex">
      <!-- BEGIN: Logo -->
      <a
        href="javascript:;"
        class="intro-x flex items-center p-2 rounded-md bg-white mx-2 text-theme-1"
        @click="showModalBox = !showModalBox"
      >
        <span
          class="xl:block text-theme-1 text-lg ml-3 overflow-hidden whitespace-nowrap overflow-ellipsis"
          >{{ currentBusinessName }}
        </span>
        <Lucide icon="ChevronDown" class="xl:block ml-2" v-if="!showModalBox" />
        <Lucide icon="ChevronUp" class="xl:block ml-2" v-if="showModalBox" />
      </a>
      <!-- END: Logo -->
    </div>
    <ModalBox v-if="showModalBox" @closeModalBox="closeModalBox" />
    <!-- END: Search -->
    <!-- BEGIN: Account Menu -->
    <div class="intro-x dropdown w-8 h-8">
      <div
        class="dropdown-toggle w-8 h-8 rounded-full bg-white overflow-hidden shadow-lg image-fit zoom-in"
        role="button"
        aria-expanded="false"
        data-tw-toggle="dropdown"
      >
        <Lucide icon="User" class="w-4 h-4 text-gray-700 mr-2"/>
      </div>
      <div class="dropdown-menu w-56">
        <ul class="dropdown-content bg-theme-10 text-white">
          <li class="p-2">
            <div class="font-medium">{{ user.firstName }} {{ user.lastName }}</div>
          </li>

          <li>
            <hr class="dropdown-divider border-white/[0.08]" />
          </li>
          <li class="p-2">
            <router-link to="/user/profile" class="dropdown-item hover:bg-white/5"
              >Manage Profile</router-link
            >
          </li>
          <li class="p-2">
            <router-link
              :to="{ name: 'add-businesses' }"
              class="dropdown-item hover:bg-white/5"
            >
              Create new Business
            </router-link>
          </li>
          <li class="p-2">
            <router-link
              :to="{ name: 'businesses' }"
              class="dropdown-item hover:bg-white/5"
              @click="$emit('closeModalBox')"
              >View all Businesses</router-link
            >
          </li>
          <li>
            <hr class="dropdown-divider border-white/[0.08]" />
          </li>
          <li class="p-2">
            <a
              href="javascript:;"
              class="dropdown-item hover:bg-white/5"
              @click="logout()"
              >Logout</a
            >
          </li>
        </ul>
      </div>
    </div>
    <!-- END: Account Menu -->
  </div>

  <div
    class="alert alert-primary show mt-5 mx-10 hidden"
    role="alert"
    v-if="!isIntuitAccessTokenValid && !isHideIntuitAlert"
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
import { defineComponent, watch, ref } from "vue";
import { useAuth } from "@/compositions/auth";
import { useUtils } from "@/compositions/utils";
import setBusiness from "@/components/set-business/Main.vue";
import ModalBox from "@/layouts/top-menu/Modal.vue";

export default defineComponent({
  components: {
    setBusiness,
    ModalBox,
  },
  setup() {
    const { logout, user, setDefaultBusiness, defaultBusinessId } = useAuth();
    const showModalBox = ref(false);

    const {
      businesses,
      currentBusinessName,
      isIntuitAccessTokenValid,
      intuitSyncSettings,
      isHideIntuitAlert,
      hideIntuitAlert,
    } = useUtils();

    watch(
      () => {
        return router.currentRoute.value.name;
      },
      () => {
        if (router.currentRoute.value.name == "intuit-integration") {
          isHideIntuitAlert.value = true;
        }
      }
    );

    const closeModalBox = () => {
      showModalBox.value = false;
    };

    return {
      user,
      logout,
      businesses,
      currentBusinessName,
      setDefaultBusiness,
      defaultBusinessId,
      isIntuitAccessTokenValid,
      intuitSyncSettings,
      hideIntuitAlert,
      isHideIntuitAlert,
      showModalBox,
      closeModalBox,
    };
  },
});
</script>
