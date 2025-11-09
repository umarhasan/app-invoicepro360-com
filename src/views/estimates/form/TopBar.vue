<template>
  <div class="col-span-12 px-4 z-10 no-print">
    <div class="flex items-center pt-3 justify-between">
      <div class="w-1/2 flex items-center">
        <h2 class="text-xl font-bold mr-auto" v-if="!isPreview">{{ title }}</h2>
      </div>

      <div class="w-1/2 sm:w-auto flex mt-4 sm:mt-0">
        <button
          type="button"
          @click="$emit('preview')"
          class="export-btn border-slate mx-1"
        >
          <Tippy tag="span" content="Preview" v-if="!isPreview">
            <Lucide icon="Eye" class="w-5 h-5" />
          </Tippy>
          <Tippy tag="span" content="Edit" v-if="isPreview">
            <Lucide icon="Edit2" class="w-5 h-5" />
          </Tippy>
        </button>

        <button
          @click="$emit('submit', 'draft')"
          class="export-btn border-slate mx-1"
        >
          <Tippy tag="span" content="Save as Draft">
            <Lucide icon="Save" class="w-5 h-5" />
          </Tippy>
        </button>

        <button
          @click="$emit('submit', 'send')"
          class="btn border-slate mx-1 btn-primary"
        >
          <Tippy tag="span" content="Send Estimate">
            <Lucide icon="Send" class="w-5 h-5" />
          </Tippy>
        </button>

        <button
          @click="$emit('submit', 'record-payment')"
          class="btn btn-success border-slate mx-1"
        >
          <Tippy tag="span" content="Record Payment">
            <Lucide icon="Plus" class="w-5 h-5" />
          </Tippy>
        </button>

        <button
          @click="$emit('print')"
          class="export-btn border-slate mx-1"
        >
          <Tippy tag="span" content="Print Estimate">
            <Lucide icon="FileText" class="w-5 h-5" />
          </Tippy>
        </button>

        <button
          @click="download(uid)"
          class="export-btn border-slate mx-1"
        >
          <Tippy tag="span" content="Download Estimate">
            <Lucide :icon="showLoadingIcon ? 'Loader' : 'Download'" 
              class="w-5 h-5" 
              :class="showLoadingIcon ? 'animate-spin' : ''"
            />
          </Tippy>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { exportPDF } from "@/compositions/estimates/export-pdf";
const props = defineProps(["title", "isPreview", "uid"]);
const {
  download,
  showLoadingIcon
} = exportPDF();
</script>
