<template>
  <div class="col-span-12 px-4 z-10 no-print ">
    <div class="flex items-center pt-3 justify-between">
      <div class="w-1/2 flex items-center">
        <h2 class="text-xl font-bold mr-auto" v-if="!isPreview">{{ title }} - # {{ invoiceNumber }}</h2>
      </div>

      <div class="w-1/2 sm:w-auto flex mt-4 sm:mt-0">
        
        <a href="/invoices" class="export-btn p-2 border-slate mx-1" v-if="!isPreview">
          <Tippy tag="span" content="Return to Invoices"  >
            <Lucide icon="X" class="w-5 h-5" /> 
          </Tippy>           

        </a> 
        <button
          type="button"
          @click="$emit('preview')"
          class="export-btn border-slate mx-1"
        >
        <Tippy tag="span" content="Preview"  v-if="!isPreview">
          <Lucide icon="Eye" class="w-5 h-5"/>
        </Tippy>

        <Tippy tag="span" content="Edit" v-if="isPreview">
          <Lucide icon="Edit2" class="w-5 h-5" />
        </Tippy>

          <!-- <Lucide icon="Eye" class="w-5 h-5 mr-2" v-if="!isPreview"/> 
          <span v-if="!isPreview">Preview</span>
           <Lucide icon="Edit2" class="w-5 h-5 mr-2" v-if="isPreview" />
          <span v-if="isPreview">Edit Invoice</span> -->
        </button>
        <button v-if="isPublished || !isDrafted"
            @click="$emit('submit', 'draft')"
            class="export-btn border-slate mx-1"
            :disabled="isDisabled">
            <Tippy tag="span" content="Save as Draft">
          <Lucide icon="Save" class="w-5 h-5" />
        </Tippy>
            
        </button>
        <button v-if="isDrafted"
            @click="$emit('submit', 'publish')"
            class="export-btn border-slate mx-1"
            :disabled="isDisabled">
            Publish
        </button>
        
        <button v-if="(isPublished || isDrafted) && isPreview"
          @click="$emit('print')"
          class="export-btn border-slate mx-1"
          :disabled="isDisabled"> 
          <Tippy tag="span" content="Print Invoice">
            <Lucide icon="FileText" class="hidden sm:block w-5 h-5" />  
        </Tippy>

                  
        </button>

        <button v-if="isPublished || isDrafted"
          @click="download(uid)"
          :disabled="isDisabled"
          class="export-btn border-slate mx-1">
          <!-- <LoadingIcon v-if="" icon="oval" color="text-theme-1" class="w-5 h-5" /> -->
          <Tippy tag="span" content="Download Invoice">
            <Lucide :icon="showLoadingIcon ? 'Loader' : 'Download'" class="sm:block w-5 h-5" 
            :class="showLoadingIcon ? 'animate-spin' : ''"
            />
        </Tippy>
        
          <!-- <Lucide icon="File" v-if="!showLoadingIcon" class="hidden sm:block w-5 h-5 mr-2" />    
          <span >Download PDF</span> -->
        </button>          
        <button 
          @click="$emit('submit', 'payment')"
          class="btn btn-success border-slate mx-1"
          :disabled="isDisabled">
          <Tippy tag="span" content="Tender">
            <Lucide icon="Plus" class="w-5 h-5" />
        </Tippy>
          
        </button>

        <button 
          @click="$emit('submit', 'send')"
          class="btn border-slate mx-1 btn-primary"
          :disabled="isDisabled">
          <Tippy tag="span" content="Send Invoice">
            <Lucide icon="Send" class="sm:block w-5 h-5" />
        </Tippy>
        <!-- <Lucide icon="Send" class="sm:block w-5 h-5 mr-2" />
          Send Invoice -->
        </button>  
      </div>
    </div>
  </div>
</template>

<script setup>
import { exportPDF } from "@/compositions/invoices/export-pdf";
  const props =  defineProps(["title", "isPreview",'invoiceNumber','isPublished','isDrafted','uid','isDisabled']);
  const {
      download,
      showLoadingIcon 
    } = exportPDF()

</script>