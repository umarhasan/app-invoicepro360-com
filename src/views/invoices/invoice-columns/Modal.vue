<template>
    <Dialog size="lg" :open="isOpen" class="relative z-50">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" ></div>

    <!-- Full-screen scrollable container -->
    <div class="fixed inset-0 w-screen overflow-y-auto">
      <!-- Container to center the panel -->
      <div class="flex min-h-full items-center justify-center p-4 dialog-scrolable">
       <Dialog.Panel class="modal-panel">
           <Dialog.Title class="flex justify-between items-center">
               <h2 class="font-medium text-base mr-auto">Invoice Columns</h2>
               <Lucide icon="X" class="w-8 h-8 cursor-pointer" @click="$emit('close')" />
           </Dialog.Title>
   
           <Dialog.Description class="overflow-y-auto">
               <!-- Scrollable content container -->

               <div class="grid grid-cols-3 gap-4">
                    <div class="bg-gray-200">
                        <ColumnTitle 
                        name="Items" 
                        :columns="columns.items" 
                        :checked-name="setting.invoice_columns.items" />
                    </div>
                    <div class="bg-gray-200">
                        <ColumnTitle 
                        name="Units" 
                        :columns="columns.units" 
                        :checked-name="setting.invoice_columns.units" />
                    </div>

                    <div class="bg-gray-200">
                        <ColumnTitle 
                       name="Price" 
                       :columns="columns.price" 
                       :checked-name="setting.invoice_columns.price" />
                    </div>

                    <div class="bg-gray-200">
                        <ColumnTitle 
                       name="Taxable" 
                       :columns="columns.taxable" 
                       :checked-name="setting.invoice_columns.taxable" /> 
                    </div>

                    <div class="bg-gray-200">
                        <ColumnTitle 
                       name="Amount" 
                       :columns="columns.amount" 
                       :checked-name="setting.invoice_columns.amount" />
                    </div>
                </div>

   
               <div class="mb-5 bg-gray-200 mt-4">
                   <div class="text-gray-700 text-sm font-medium mb-2 border-b p-2">
                       Choose which columns on your invoices to hide:
                   </div>
                    <div class="mt-2 grid grid-cols-2 p-2">
                        <Checkbox classes="mb-3 ml-2" v-model:checked="setting.invoice_columns.items.hide" :true-value="true" :false-value="false">
                            Hide Description
                        </Checkbox>
                        <Checkbox classes="mb-3 ml-2" v-model:checked="setting.invoice_columns.units.hide" :true-value="true" :false-value="false">
                            Hide Units
                        </Checkbox>
                        <Checkbox classes="mb-3 ml-2" v-model:checked="setting.invoice_columns.price.hide" :true-value="true" :false-value="false">
                            Hide Price
                        </Checkbox>
                        <Checkbox classes="mb-3 ml-2" v-model:checked="setting.invoice_columns.taxable.hide" :true-value="true" :false-value="false">
                            Hide Taxable
                        </Checkbox>
                        <Checkbox classes="mb-3 ml-2" v-model:checked="setting.invoice_columns.amount.hide" :true-value="true" :false-value="false">
                            Hide Amount
                        </Checkbox>
                    </div>
               </div>
           </Dialog.Description>
   
           <Dialog.Footer class="text-left border-none">
               <button type="button" class="btn btn-primary w-20 mr-1"
                   :class="{'disable' : showLoadingIcon.invoice_columns}"
                   :disabled="showLoadingIcon.invoice_columns" 
                   @click="$emit('updateInvoiceColumns')">
                       <span v-if="!showLoadingIcon.invoice_columns">Save</span>
                       <LoadingIcon icon="oval" color="white" class="w-5 h-5" v-if="showLoadingIcon.invoice_columns" />
               </button>
               <button type="button" class="btn btn-outline-secondary w-20" @click="$emit('close')">
                   Cancel
               </button>
           </Dialog.Footer>
       </Dialog.Panel>
       </div>
       </div>
   </Dialog>
   </template>
   
   <script setup lang="ts">
   import Dialog from "@/components/Headless/Dialog";
   import ColumnTitle from '@/components/invoice/ColumnTitle.vue'
   const props = defineProps(['columns', 'validationErrors', 'showLoadingIcon', 'setting', 'isOpen']);
   const emits = defineEmits(['close', 'updateInvoiceColumns']);
   </script>
   