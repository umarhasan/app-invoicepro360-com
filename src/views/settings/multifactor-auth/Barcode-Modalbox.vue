<template>
<Dialog :staticBackdrop="false" :open="isOpen">
    <Dialog.Panel>
        <Dialog.Title>
            <h1 class="font-medium text-base mr-auto">Barcode</h1>
            <button type="button" class="btn-close" @click="$emit('close')">
                    <Lucide icon="X" class="w-4 h-4" />
            </button>
        </Dialog.Title>
        <Dialog.Description>
            <DangerAlert v-if="error">
                {{alertMessage}}
                <button type="button" class="btn-close" @click="error = null">
                    <Lucide icon="X" class="w-4 h-4" />
                </button>
            </DangerAlert>
                
            <div v-if="!isBarcodeGenerated" class="flex flex-col items-center py-10">
                <LoadingIcon icon="grid" class="w-20" />
                <div class="text-center text-xl mt-2">Loading...</div>
            </div>

            <div v-if="isBarcodeGenerated"> 
                <img :src="barcodeImage">
            </div>
        </Dialog.Description>
    </Dialog.Panel>
</Dialog>
    
</template>

<script setup>
    import Dialog from "@/components/Headless/Dialog";
    const props = defineProps(['alertMessage','error','barcodeImage','isBarcodeGenerated','isOpen']);
    const emits = defineEmits(['close'])
</script>
