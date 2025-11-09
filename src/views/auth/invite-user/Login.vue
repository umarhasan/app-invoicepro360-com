<template>
  <div class="container sm:px-10">
    <!-- BEGIN: Login Form -->

    <div class="h-screen flex">
      <div
        class="m-auto w-full sm:w-3/4 lg:w-2/5 border rounded shadow bg-gray-50"
        v-if="!isTokenValidate"
      >
        <div class="h-40 p-10">
          <LoadingIcon icon="oval" class="w-20" />
        </div>
      </div>

      <div
        class="m-auto w-full sm:w-3/4 lg:w-2/5 border rounded shadow bg-gray-50 py-10"
        v-if="!isTokenValid"
      >
        <h1 class="text-xl font-semibold text-theme-7 text-center">
          User invitation token has been expired or invalid.
        </h1>
      </div>

      <div
        class="m-auto w-full sm:w-3/4 lg:w-2/5 border rounded shadow bg-gray-50"
        v-show="isTokenValidate && isTokenValid"
      >
        <a href="" class="pt-5 flex justify-center">
          <img
            alt="Invoice Pro 360"
            class="w-6"
            src="@/assets/images/logo.svg"
          />
          <span class="text-theme-1 text-3xl ml-3">
            Invoicepro<span class="font-medium">360</span>
          </span>
        </a>

        <h1 class="my-2 text-xl font-semibold text-theme-7 text-center">
          You’ve been invited by {{BusinessName}} to use Invoicepro360
        </h1>

        <h2 class="mb-2 text-theme-7 text-center">
          Sign in with an existing account to join this business, or
          <router-link
            class="text-theme-3 font-medium underline"
            :to="{ name: 'invite-user-register' }"
            tag="button"
            >create an account</router-link
          >
        </h2>

        <form class="px-8 py-4" @submit.prevent="submit">
          <h2 class="text-2xl text-center font-medium text-theme-1 hidden">Sign In</h2>
          <div class="mt-2">
            <input
              v-model="formData.username"
              type="text"
              class="form-control py-3 px-4 border-gray-300 block"
              placeholder="Email"
              :class="{
                'border-theme-6': validate.username.$error,
              }"
            />
            <div
              v-if="validate.username.required.$invalid && validate.username.$dirty"
              class="text-theme-6 mt-2"
            >
              {{ validate.username.required.$message }}
            </div>

            <div v-if="isInvalidUser" class="text-theme-6 mt-2">
              {{ invalidUserMessage }}
            </div>
            <div class="relative">
              <input
                v-model="formData.password"
                :type="passwordType"
                class="form-control py-3 px-4 border-gray-300 block mt-4"
                placeholder="Password"
              />
              <Lucide icon="EyeOff"
                class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 text-gray-700 cursor-pointer"
                v-if="passwordType === 'password'"
                @click="switchVisibility()"
              />

              <Lucide icon="Eye"
                class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 text-gray-700 cursor-pointer"
                v-if="passwordType === 'text'"
                @click="switchVisibility()"
              />
            </div>

            <div
              v-if="validate.password.required.$invalid && validate.password.$dirty"
              class="text-theme-6 mt-2"
            >
              {{ validate.password.required.$message }}
            </div>
          </div>
          <div class="mt-4 text-center">
            <button
              class="btn btn-primary-auth"
              :class="{ disable: showLoadingIcon }"
              :disabled="showLoadingIcon"
            >
              <span v-if="!showLoadingIcon">Login</span>
              <LoadingIcon
                icon="oval"
                color="white"
                class="w-7 h-7"
                v-if="showLoadingIcon"
              />
            </button>
          </div>
          <div class="text-right">
            <router-link
              class="block mt-1 text-small text-theme-3"
              :to="{ name: 'forgot-password' }"
              tag="button"
              >Forgot Password?</router-link
            >
          </div>
        </form>
      </div>
    </div>
    <!-- END: Login Form -->
  </div>
</template>

<script>
import { defineComponent, onMounted, watch, ref } from "vue";
import { login, validateInvitationToken } from "@/compositions/auth";
import cash from "cash-dom"

export default defineComponent({
  components: {},
  setup() {
    const token = router.currentRoute.value.params.token;

    const {
      formData,
      passwordType,
      showLoadingIcon,
      submit,
      switchVisibility,
      validate,
      isInvalidUser,
      invalidUserMessage,
    } = login(token);

    const { isTokenValid, isTokenValidate, BusinessName } = validateInvitationToken(
      token
    );

    onMounted(() => {
      cash("body").removeClass("main").removeClass("error-page").addClass("bg-white");
    });

    watch([isInvalidUser], () => {
      setTimeout(() => {
        isInvalidUser.value = false;
      }, 4000);
    });

    return {
      formData,
      passwordType,
      showLoadingIcon,
      submit,
      switchVisibility,
      validate,
      isInvalidUser,
      invalidUserMessage,
      token,
      isTokenValid,
      isTokenValidate,
      BusinessName,
    };
  },
});
</script>
