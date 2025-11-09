<template>
<Dialog size="lg" staticBackdrop :open="isOpen">
    <Dialog.Panel>
        <Dialog.Title>
            <h1 class="text-lg font-bold mr-auto">{{ option.name }} MFA</h1>
        </Dialog.Title>
        <Dialog.Description>
            
            <DangerAlert v-if="error">
                {{ alertMessage }}
                <button type="button" class="btn-close" @click="error = null">
                    <Lucide icon="X" class="w-4 h-4" />
                </button>
            </DangerAlert>

            <div class="font-medium text-base">To get started:</div>

            <div class="text-slate-500 mt-2" v-if="option.type == 'authy'">
                <a href="https://authy.com/download/" target="_blank" class="text-primary"
                    @click="$emit('downloadLink')">Download and install</a> the authy application on your mobile device
            </div>
            <div class="text-slate-500 mt-2" v-if="option.type == 'google-authenticator'">
                <a href="https://support.google.com/accounts/answer/1066447?hl=en" target="_blank" class="text-primary"
                    @click="$emit('downloadLink')">Download and install</a> the application on your mobile device.<br>
                <a href="javascript:void(0);" @click="$emit('showBarcodeModal')" class="text-primary">View your
                    barcode</a> and scan it using the google authenticator application
            </div>

            <div class="my-3" v-if="option.image">
                <img :src="getImageUrl(option.image)" class="w-40" />

            </div>

            <div class="font-medium my-3">
                <h2 class="text-base">Status</h2>
                <Checkbox classes="ml-1" v-model:checked="option.status" :true-value=1 :false-value=0>
                    Enabled
                </Checkbox>
            </div>

            <div class="font-medium my-3">
                <h2 class="text-base">Default Authentication</h2>
                <Checkbox classes="ml-1" v-model:checked="option.default_mfa" :true-value=1 :false-value=0>
                    Yes
                </Checkbox>
            </div>
        </Dialog.Description>
        <Dialog.Footer>
            <button type="button" class="btn btn-outline-secondary w-20 mr-1" @click="$emit('close')">Cancel</button>
            <button type="button" class="btn btn-primary" :class="{ 'disable': showLoadingIcon }"
                :disabled="showLoadingIcon" @click="$emit('save')">
                <span v-if="!showLoadingIcon">Save Changes</span>
                <LoadingIcon icon="oval" color="white" class="w-5 h-5" v-if="showLoadingIcon" />
            </button>
        </Dialog.Footer>
    </Dialog.Panel>
</Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from "@/components/Headless/Dialog";
const props = defineProps(['option', 'alertMessage', 'showLoadingIcon', 'error','isOpen'])
const emits = defineEmits(["save", "downloadLink", "showBarcodeModal",'close'])

const error = ref(props.error);

// ✅ Function to get correct image path dynamically from `src/assets/images/`
const getImageUrl = (imageName: string): string => {
  if (!imageName) return ""; // Agar image empty hai to return empty string

  // ✅ VueJS ke assets folder se dynamically image import karne ka tareeqa
  return new URL(`/src/assets/images/${imageName}`, import.meta.url).href;
};
</script>
