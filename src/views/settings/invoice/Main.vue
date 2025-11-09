<template>
  <SettingLayout current-tab="invoice-customization">
    <h2 class="font-medium text-2xl pb-5 truncate content-heading">Invoice Customization</h2>
    <div class="box">
      <div class="p-5">
        

        <div class="md:flex md:items-center mt-5">
          <div class="md:w-2/6">
            <label for="company-logo" class="block font-medium text-gray-700 mb-1">
              Company Logo
            </label>
          </div>

          <div class="md:w-5/6">
            <div class="w-52">
              <div
                class="border-2 border-dashed shadow-sm border-gray-200 rounded-md p-5"
              >
                <div class="h-40 relative image-fit cursor-pointer zoom-in mx-auto">
                  <div
                    class="absolute top-0 left-0 right-0 bottom-0 w-full block cursor-pointer flex items-center justify-center"
                    @click="$refs.fileInput.click()"
                    v-if="!setting.logo"
                  >
                    <button
                      type="button"
                      style="background-color: rgba(255, 255, 255, 0.65)"
                      class="hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded-lg shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-camera"
                        width="24"
                        height="24"
                        view="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect x="0" y="0" width="24" height="24" stroke="none"></rect>
                        <path
                          d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"
                        />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                    </button>
                  </div>
                  <img
                    class="rounded-md"
                    alt="company logo"
                    :src="setting.logo"
                    v-if="setting.logo"
                  />
                  <Tippy
                    tag="div"
                    content="Remove this company logo?"
                    class="w-5 h-5 flex items-center justify-center absolute rounded-full text-white bg-theme-6 right-0 top-0 -mr-2 -mt-2"
                    v-if="setting.logo"
                  >
                    <Lucide icon="X" class="w-4 h-4" @click="removeFile" />
                  </Tippy>
                </div>
                <div class="mx-auto cursor-pointer relative mt-5">
                  <button
                    type="button"
                    class="btn btn-primary w-full"
                    @click="$refs.fileInput.click()"
                  >
                    <span v-if="!setting.logo">Upload Logo</span>
                    <span v-if="setting.logo">Change Logo</span>
                  </button>

                  <input
                    id="fileInput"
                    ref="fileInput"
                    name="logo"
                    accept="image/*"
                    class="w-full h-full top-0 left-0 absolute opacity-0"
                    type="file"
                    @change="onFilePicked"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="md:flex md:items-center mt-5">
          <div class="md:w-2/6">
            <label for="Invoice-template" class="block font-medium text-gray-700 mb-1">
              Invoice Template
            </label>
          </div>
          <div class="md:w-5/6">
            <div class="grid grid-cols-12 gap-2">
              <div
                v-for="(invoiceTemplate, index) in invoiceTemplates"
                :key="invoiceTemplate.type"
                class="col-span-4 text-center invoice-template"
              >
                <div class="bg-theme-2 p-2 rounded">
                  <img :src="getImageUrl(invoiceTemplate.image)" class="h-48" />
                </div>
                <Radio
                  classes="mt-2 pl-2"
                  v-model:checked="setting.invoice_template"
                  :true-value="invoiceTemplate.type"
                  false-value=""
                >
                  {{ invoiceTemplate.type }}
                </Radio>

                <a
                  href="javascript:void(0)"
                  class="rounded py-1 px-2 text-xs border border-gray bg-white font-medium hidden"
                  @click="previewInvoiceTemplate(index)"
                  >Preview</a
                >
              </div>
            </div>
          </div>
        </div>

        <div class="md:flex md:items-center mt-5">
          <div class="md:w-2/6">
            <label for="accent-color" class="block font-medium text-gray-700 mb-2">
              Accent Color
            </label>
          </div>
          <div class="md:w-5/6 flex items-start">
            <Vue3ColorPicker
              v-model="setting.accent_color"
              mode="solid"
              :show-alpha="false"
              :show-color-list="true"
              :show-eye-drop="true"
              :show-input-set="true"
              :show-input-menu="false"
              :show-picker-mode="false"
              :color-list-count="16"
              type="HEX"
            />
          </div>
        </div>
      </div>

      <div class="p-5 border-t border-gray-200">
        <h2 class="font-medium text-2xl">Invoice Settings</h2>

        <div class="md:flex md:items-center mt-5">
          <div class="md:w-2/6">
            <label for="invoice-title" class="block font-medium text-gray-700 mb-1"
              >Default Title</label
            >
          </div>
          <div class="md:w-5/6">
            <input
              v-model="setting.invoice_title"
              type="text"
              class="form-control yr-form-control"
              placeholder="Invoice Title"
            />
          </div>
        </div>

        <div class="md:flex md:items-center mt-5">
          <div class="md:w-2/6">
            <label for="invoice-subheading" class="block font-medium text-gray-700 mb-1"
              >Default Subheading</label
            >
          </div>
          <div class="md:w-5/6">
            <input
              v-model="setting.invoice_subheading"
              type="text"
              class="form-control yr-form-control"
              placeholder="Invoice Subheading"
            />
          </div>
        </div>

        <div class="md:flex md:items-center mt-5">
          <div class="md:w-2/6">
            <label for="invoice-footer" class="block font-medium text-gray-700 mb-1"
              >Default Footer</label
            >
          </div>
          <div class="md:w-5/6">
            <input
              v-model="setting.invoice_footer_notes"
              type="text"
              class="form-control yr-form-control"
              placeholder="Invoice Footer"
            />
          </div>
        </div>

        <div class="md:flex md:items-center mt-5">
          <div class="md:w-2/6">
            <label for="invoice-terms" class="block font-medium text-gray-700 mb-1"
              >Default Notes & Terms</label
            >
          </div>
          <div class="md:w-5/6">
            <textarea
              id="invoice_terms"
              v-model="setting.invoice_terms"
              name="invoice_terms"
              cols="25"
              rows="2"
              class="form-control yr-form-control"
              placeholder="Invoice Notes"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="p-5 border-t border-gray-200">
        <h2 class="font-medium text-2xl">Estimate Settings</h2>

        <div class="md:flex md:items-center mt-5">
          <div class="md:w-2/6">
            <label for="estimate-title" class="block font-medium text-gray-700"
              >Default Title</label
            >
          </div>
          <div class="md:w-5/6 mx-auto">
            <input
              v-model="setting.estimate_title"
              type="text"
              class="form-control yr-form-control"
              placeholder="Estimate Title"
            />
          </div>
        </div>

        <div class="md:flex md:items-center mt-5">
          <div class="md:w-2/6">
            <label for="estimate-subheading" class="block font-medium text-gray-700 mb-1"
              >Default Subheading</label
            >
          </div>
          <div class="md:w-5/6">
            <input
              v-model="setting.estimate_subheading"
              type="text"
              class="form-control yr-form-control"
              placeholder="Estimate Subheading"
            />
          </div>
        </div>

        <div class="md:flex md:items-center mt-5">
          <div class="md:w-2/6">
            <label for="estimate-footer-notes" class="block font-medium text-gray-700"
              >Default Footer</label
            >
          </div>
          <div class="md:w-5/6">
            <input
              v-model="setting.estimate_footer_notes"
              type="text"
              class="form-control yr-form-control"
              placeholder="Estimate Footer"
            />
          </div>
        </div>

        <div class="md:flex md:items-center mt-5">
          <div class="md:w-2/6">
            <label for="estimate-notes" class="block font-medium text-gray-700 mb-1"
              >Default Notes & Terms</label
            >
          </div>
          <div class="md:w-5/6">
            <textarea
              id="estimate_terms"
              v-model="setting.estimate_terms"
              name="estimate_terms"
              cols="25"
              rows="2"
              class="form-control yr-form-control"
              placeholder="Estimate Notes"
            ></textarea>
          </div>
        </div>

        <div class="md:flex md:items-center mt-5">
          <div class="md:w-6/6">
            <button
              type="submit"
              class="btn btn-primary"
              :class="{ disable: showLoadingIcon.estimate }"
              :disabled="showLoadingIcon.estimate"
              @click="updateSetting('estimate')"
            >
              <span v-if="!showLoadingIcon.estimate">Save Changes</span>
              <LoadingIcon
                icon="oval"
                color="white"
                class="w-5 h-5"
                v-if="showLoadingIcon.estimate"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- BEGIN: Large Modal Content -->
    <div id="large-modal-size-preview" class="modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-body p-10 text-center">
            <img :src="previewTemplate" class="w-full" />
          </div>
        </div>
      </div>
    </div>
    <!-- END: Large Modal Content -->
  </SettingLayout>
</template>

<script setup>
import { watch, ref, onMounted } from "vue";
import { useSettings, showNotification } from "@/compositions/invoices/settings";
import { Vue3ColorPicker } from "@cyhnkckali/vue3-color-picker";
import "@cyhnkckali/vue3-color-picker/dist/style.css";
import SettingLayout from "../Setting-layout.vue";
    const {
      setting,
      swatches,
      invoiceTemplates,
      previewTemplate,
      onFilePicked,
      removeFile,
      previewInvoiceTemplate,
      updateSetting,
      validate,
      showLoadingIcon,
      isSaved,
    } = useSettings();

    onMounted(() => {
      localStorage.setItem("ck-cp-local-color-list", JSON.stringify(swatches.value));
    });

    // Notification for success / error
    watch(
      () => {
        return isSaved.value;
      },
      () => {
        if (isSaved.value) showNotification();
      }
    );

    const getImageUrl = (imageName) => {
        return new URL(`/src/assets/images/${imageName}`, import.meta.url).href;
    };

</script>

<style scoped>
.invoice-template label {
  justify-content: center;
  align-items: center;
}
</style>
