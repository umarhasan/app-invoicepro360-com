<template>
  <div class="col-span-12 alert alert-danger-soft my-2 show" v-if="!validationErrors == null">
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
  <div class="col-span-6 intro-y sm:col-span-6 2xl:col-span-4">
    <div class="box">
      <div class="p-5">
        <div
          class="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10"
        >
          <img src="@/assets/images/clover-pos.png" class="rounded-md" alt="clover pos"/>
        </div>
      </div>
      <div
        class="flex items-center justify-center p-3 border-t lg:justify-end border-slate-200/60"
      >
        <button
          type="button"
          class="btn btn-sm text-theme-9 border-theme-9 rounded-full"
          :class="{ disable: ConnectLoadingIcon }"
          :disabled="ConnectLoadingIcon"
          @click="Connect()"
          v-if="!isCloverAccessTokenValid || !cloverSettings.isConnected"
        >
          <span v-if="!ConnectLoadingIcon">Connect with cloud</span>
          <LoadingIcon
            icon="oval"
            color="white"
            class="w-5 h-5"
            v-if="ConnectLoadingIcon"
          />
        </button>

        <button
          type="button"
          class="btn btn-sm text-theme-9 border-theme-9 rounded-full"
          :class="{ disable: ConnectLoadingIcon }"
          :disabled="ConnectLoadingIcon"
          @click="Disconnect()"
          v-if="isCloverAccessTokenValid && cloverSettings.isConnected"
        >
          <span v-if="!ConnectLoadingIcon">Disconnect with cloud</span>
          <LoadingIcon
            icon="oval"
            color="white"
            class="w-5 h-5"
            v-if="ConnectLoadingIcon"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import SettingLayout from "@/views/settings/Setting-layout.vue";

import { useClover } from "@/compositions/clover/index";

export default {
  components: {
    SettingLayout,
  },
  setup() {
    const formTitle = ref("Clover Device Configuration");
    const {
      ConnectLoadingIcon,
      validationErrors,
      Connect,
      Disconnect,
      isCloverAccessTokenValid,
      cloverSettings,
      getRedirectUrl,
    } = useClover();

    // const goBack = () => {
    //   router.push({ name: "integrations" });
    // };

    // console.log(validationErrors.value);

    onMounted(() => {
      getRedirectUrl();
    });

    return {
      formTitle,
      ConnectLoadingIcon,
      validationErrors,
      //   goBack,
      Connect,
      Disconnect,
      isCloverAccessTokenValid,
      cloverSettings,
    };
  },
};
</script>
