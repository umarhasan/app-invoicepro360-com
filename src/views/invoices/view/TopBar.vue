<template>
  <div class="col-span-12 no-print">
    <div class="flex flex-col sm:flex-row items-center my-5 justify-between">
      <div>
        <h2 class="mr-auto hidden content-heading">{{ title }}</h2>
      </div>
      <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
        <slot></slot>

        <button @click="$emit('print')" class="btn box flex items-center text-primary">
          <Lucide icon="FileText" class="hidden sm:block w-4 h-4 mr-2" />
          Print
        </button>
        <button
          @click="download(uuid)"
          class="ml-1 btn box flex items-center text-primary"
        >
          <LoadingIcon v-if="showLoadingIcon" icon="oval" color="text-primary" class="w-5 h-4 mr-1" />
          <Lucide icon="File" v-if="!showLoadingIcon" class="hidden sm:block w-4 h-4 mr-2" />    
          <span v-if="!showLoadingIcon">Download PDF</span>
        </button>

        <button
          type="button"
          class="btn box text-primary mr-2 flex items-center ml-auto sm:ml-0 py-3 w-full md:w-28 hidden"
        >
          <Lucide icon="Eye" class="w-4 h-4 mr-2" />
          <span>{{ $T.PREVIEW_TXT }}</span>
        </button>
        <div class="flex hidden">
          <button
            class="btn btn-primary py-3 w-auto border-0 border-r border-theme-3 rounded-r-none"
          >
            {{ $T.MORE_ACTION_BTN }}
          </button>

          <div class="dropdown">
            <button
              class="dropdown-toggle btn btn-primary py-3 w-auto rounded-l-none"
              aria-expanded="false"
            >
              <Lucide icon="ChevronDown" class="w-4 h-5 ml-2" />
            </button>

            <div class="dropdown-menu w-52">
              <div class="dropdown-menu__content box p-2">
                <a
                  href="javascript:void(0);"
                  @click="$emit('print')"
                  class="flex items-center block p-2 transition duration-300 ease-in-out bg-white hover:bg-gray-200 rounded-md font-semibold"
                >
                  {{ $T.PRINT_TXT }}</a
                >
                <a
                  href="javascript:void(0);"
                  @click="$emit('download')"
                  class="flex items-center block p-2 transition duration-300 ease-in-out bg-white hover:bg-gray-200 rounded-md"
                >
                  {{ $T.EXPORT_PDF_TXT }}</a
                >

                <a
                  href="javascript:void(0);"
                  @click="$emit('duplicate')"
                  class="flex items-center block p-2 transition duration-300 ease-in-out bg-white hover:bg-gray-200 rounded-md"
                >
                  {{ $T.DUPLICATE_TXT }}</a
                >

                <a
                  href="javascript:void(0);"
                  class="flex items-center block p-2 transition duration-300 ease-in-out bg-white hover:bg-gray-200 rounded-md"
                >
                  {{ $T.DELETE_TXT }}</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import { exportPDF } from "@/compositions/invoices/pdf.js";
import { ref } from "vue";
export default {
  props: ["title",'invoiceId'],
  emits: ["print", "duplicate"],
  setup(props) {
    const uuid = ref(props.invoiceId);
    const { showLoadingIcon, download } = exportPDF();

    return {
      uuid,
      download,
      showLoadingIcon,
      title: props.title,
    };
  },
};
</script>
