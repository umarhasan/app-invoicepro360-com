<template>
  <SettingLayout current-tab="password">
    <SuccessAlert v-if="isSaved">
      {{ alertMessage }}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="
          () => {
            isSaved = false;
          }
        "
      >
        <Lucide icon="X" class="w-4 h-4" />
      </button>
    </SuccessAlert>

    <DangerAlert v-if="error">
      {{ alertMessage }}
      <button type="button" class="btn-close" @click="error = false">
        <Lucide icon="X" class="w-4 h-4" />
      </button>
    </DangerAlert>

    <div class="grid grid-cols-12 gap-4">
    
    
      <div class="col-span-12 auth-content">
        <div class="box p-4">
          <div class="password-security">
            <h2 class="py-4 main-heading">Password & Security</h2>
          </div>

          <div class="border-b mb-10 separator"></div>
          
          <div class="card1 px-6 py-8 border rounded">
            <div class="card1-inner grid grid-cols-12 gap-2">
              <div class="col-span-1">
                <img src="/src/assets/images/auth1.png" class="w-[80px] h-auto" />
              </div>
              <div class="col-span-7 content1">
                <h2 class="sub-heading mb-2">Sign-in with authenticator app <span class="bg-green-300 py-1 px-2 rounded font-normal text-sm">Recommended</span></h2>
                <div class="mb-4"><span class="bg-gray-200 px-2 py-1 rounded font-semibold">Inactive</span></div>
                <p><span class="lg:block">You'll need an authentication app like Google</span> Authenticator or Microsoft Authenticator.</p>
              </div>
              <div class="card1-button col-span-4 flex items-center justify-end">
                <button class="btn rounded-full bg-theme-1 text-white">
                  Set-up an authenticator app
                </button>
              </div>
            </div>
          </div>

          <div class="mt-10 mb-10 separator"></div>

          <div class="card1 px-6 py-8 border rounded">
            <div class="card1-inner grid grid-cols-12 gap-2">
              <div class="col-span-1">
                <img src="/src/assets/images/auth1.png" class="w-[80px] h-auto" />
              </div>
              <div class="col-span-7 content1">
                <h2 class="sub-heading mb-2">Sign-in with Phone Number</h2>
                <div class="mb-4"><span class="bg-gray-200 px-2 py-1 rounded font-semibold">Inactive</span></div>
                <p>We'll text you a one-time code whenever you sign-in</p>
              </div>
              <div class="card1-button col-span-4 flex items-center justify-end">
                <button class="btn rounded-full bg-theme-1 text-white">
                  Set-up phone number
                </button>
              </div>
            </div>
          </div>

          <div class="border-b mt-10 mb-6 separator"></div>

          <div class="two-factor">
            <h3 class="py-4 sub-heading">Phone number verification</h3>
            <p>
              <span class="lg:block">
                Add a phone number where we can reach if we detect </span>
              <span class="lg:block">
                unusual activity of if you get locked out of your invoice account</span>
            </p>
          </div>

          <div class="border-b mt-10 mb-6 separator"></div>

          <div class="change-password mb-4">
            <h3 class="py-4 sub-heading">Change Password</h3>
            <p>
              <span class="lg:block">
                Make sure your new password is strong, and uses a combination of letters,  </span>
              <span class="lg:block">
                numbers, and special characters.</span>
            </p>
          </div>

            <form @submit.prevent="updatePassword" class="pt-3">
              <div class="mb-4 md:w-1/2">
                <label for="current-password" class="font-medium text-normal"
                  >Current Password</label
                >
                <div class="relative">
                  <input
                    v-model="user.currentPassword"
                    :type="currentPasswordType"
                    class="form-control"
                    placeholder="Current Password"
                    :class="{ 'border-theme-6': validate.currentPassword.$error }"
                  />
                  <Lucide icon="EyeOff"
                    class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 text-gray-700 cursor-pointer"
                    v-if="currentPasswordType === 'password'"
                    @click="switchVisibility('current-password')"
                  />

                  <Lucide icon="Eye"
                    class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 text-gray-700 cursor-pointer"
                    v-if="currentPasswordType === 'text'"
                    @click="switchVisibility('current-password')"
                  />
                </div>
                <div
                  v-if="
                    validate.currentPassword.required.$invalid &&
                    validate.currentPassword.$dirty
                  "
                  class="text-theme-6 mt-2"
                >
                  Current Password is required
                </div>
              </div>
              <div class="mb-4 md:w-1/2">
                <label for="new-password" class="font-medium text-normal"
                  >New Password</label
                >
                <div class="relative">
                  <input
                    v-model="user.newPassword"
                    :type="newPasswordType"
                    class="form-control yr-form-control"
                    placeholder="New Password"
                    :class="{ 'border-theme-6': validate.newPassword.$error }"
                  />
                  <Lucide icon="EyeOff"
                    class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 cursor-pointer"
                    v-if="newPasswordType === 'password'"
                    @click="switchVisibility('new-password')"
                  />

                  <Lucide icon="Eye"
                    class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 cursor-pointer"
                    v-if="newPasswordType === 'text'"
                    @click="switchVisibility('new-password')"
                  />
                </div>
                <div
                  v-if="validate.newPassword.required.$invalid && validate.newPassword.$dirty"
                  class="text-theme-6 mt-2"
                >
                  New Password is required
                </div>
              </div>

              <div class="mb-4 md:w-1/2">
                <label for="confirm-password" class="font-medium text-normal"
                  >Confirm Password</label
                >
                <div class="relative">
                  <input
                    v-model="user.confirmPassword"
                    :type="confirmPasswordType"
                    class="form-control yr-form-control"
                    placeholder="Confirm Password"
                    :class="{ 'border-theme-6': validate.confirmPassword.$error }"
                  />
                  <Lucide icon="EyeOff"
                    class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 cursor-pointer"
                    v-if="confirmPasswordType === 'password'"
                    @click="switchVisibility('confirm-password')"
                  />

                  <Lucide icon="Eye"
                    class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 cursor-pointer"
                    v-if="confirmPasswordType === 'text'"
                    @click="switchVisibility('confirm-password')"
                  />
                </div>
                <div
                  v-if="validate.confirmPassword.$error && validate.confirmPassword.$dirty"
                  class="text-theme-6 mt-2"
                >
                  Confirm Password is not match
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-primary px-5 mt-5 tracking-wider"
                :class="{ disable: showLoadingIcon }"
                :disabled="showLoadingIcon"
              >
                <span v-if="!showLoadingIcon">Save</span>
                <LoadingIcon
                  icon="oval"
                  color="white"
                  class="w-5 h-5"
                  v-if="showLoadingIcon"
                />
              </button>
            </form>
        </div>
      </div><!-- col 9 -->
    </div>

    
  </SettingLayout>
</template>

<script>
import { reactive, toRefs } from "vue";
import { computed, watchEffect,watch } from "vue";
import { savePassword } from "@/compositions/profile";
import SettingLayout from "../settings/Setting-layout.vue";
import AuthNav from "../auth/AuthNav.vue";
export default {
  name: "SetPassword",
  components: {
    SettingLayout,
    AuthNav
  },
  setup() {
    const {
      user,
      validate,
      updatePassword,
      switchVisibility,
      currentPasswordType,
      newPasswordType,
      confirmPasswordType,
      isSaved,
      error,
      showLoadingIcon,
      alertMessage,
      showNotification,
    } = savePassword();

    watch(isSaved, () => {
      if (isSaved.value) showNotification();
    });
    
    return {
      user,
      validate,
      updatePassword,
      switchVisibility,
      currentPasswordType,
      newPasswordType,
      confirmPasswordType,
      isSaved,
      error,
      showLoadingIcon,
      alertMessage,
    };
  },
};
</script>

<style></style>
