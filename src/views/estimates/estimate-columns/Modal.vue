<template>
<div id="invoice-column-modal" class="modal" data-backdrop="static" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
    <form method="POST">
        <div class="modal-content">
            <!-- BEGIN: Modal Header -->
            <div class="modal-header">
                <h2 class="font-bold text-base mr-auto text-2xl">Invoice Columns</h2>
                <Lucide icon="X" class="w-8 h-8 cursor-pointer" @click="$emit('closeModal')"/>
            </div>
            <!-- END: Modal Header -->
            <!-- BEGIN: Modal Body -->
            <div class="modal-body">

                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-200 p-4">
                        <ColumnTitle 
                        name="Items" 
                        :columns="columns.items" 
                        :checked-name="setting.invoice_columns.items" />
                    </div>
                    <div class="bg-gray-300 p-4">
                        <ColumnTitle 
                        name="Units" 
                        :columns="columns.units" 
                        :checked-name="setting.invoice_columns.units" />
                    </div>

                    <div class="bg-gray-300 p-4">
                        <ColumnTitle 
                        name="Price" 
                        :columns="columns.price" 
                        :checked-name="setting.invoice_columns.price" />
                    </div>

                    <div class="bg-gray-300 p-4">
                        <ColumnTitle 
                        name="Taxable" 
                        :columns="columns.taxable" 
                        :checked-name="setting.invoice_columns.taxable" />
                    </div>

                    <div class="bg-gray-300 p-4">
                        <ColumnTitle 
                        name="Amount" 
                        :columns="columns.amount" 
                        :checked-name="setting.invoice_columns.amount" />
                    </div>
                </div>

                <div class="border-b border-gray-200"></div>

                <div class="px-5 pt-2 mb-5">
                    <div class="text-gray-700 text-base font-bold">
                        Choose which columns on your invoices to hide:
                    </div>        

                    <div class="mt-4">
                        <div class="mt-2">
                            <Checkbox classes="mb-3 ml-3" v-model:checked="setting.invoice_columns.items.hide" :true-value="true" :false-value="false">
                                Hide Description
                            </Checkbox>

                            <Checkbox classes="mb-3 ml-3" v-model:checked="setting.invoice_columns.units.hide" :true-value="true" :false-value="false">
                                Hide Units
                            </Checkbox>

                            <Checkbox classes="mb-3 ml-3" v-model:checked="setting.invoice_columns.price.hide" :true-value="true" :false-value="false">
                                Hide Price
                            </Checkbox>

                            <Checkbox classes="mb-3 ml-3" v-model:checked="setting.invoice_columns.taxable.hide" :true-value="true" :false-value="false">
                                Hide Taxable
                            </Checkbox>

                            <Checkbox classes="mb-3 ml-3" v-model:checked="setting.invoice_columns.amount.hide" :true-value="true" :false-value="false">
                                Hide Amount
                            </Checkbox>
                        </div>
                    </div>    
                </div>
            </div>
            <!-- END: Modal Body -->
            <!-- BEGIN: Modal Footer -->
            <div class="modal-footer text-left">                
                <button 
                    type="button" 
                    class="btn btn-primary w-20 mr-1"
                    :class="{'disable' : showLoadingIcon.invoice_columns}"
                    :disabled="showLoadingIcon.invoice_columns" 
                    @click="$emit('updateInvoiceColumns')">
                        <span v-if="!showLoadingIcon.invoice_columns">Save</span>
                        <LoadingIcon icon="oval" color="white" class="w-5 h-5" v-if="showLoadingIcon.invoice_columns" />
                </button>
                <button type="button" class="btn btn-outline-secondary w-20"
                    @click="$emit('closeModal')">
                    Cancel
                </button>
            </div>
            <!-- END: Modal Footer -->
        </div>
    </form>

    </div>
</div>

</template>

<script>
import { defineComponent } from "vue"
import ColumnTitle from '@/components/invoice/ColumnTitle.vue'
export default defineComponent({
    props : ['columns','validationErrors','showLoadingIcon','setting'],
    components : {
        ColumnTitle
    },
    setup(props) {

        // watchEffect(() => { if(props.validate.$errors) validationErrors.value = props.validate })
        
        return {
            setting:props.setting,
            columns: props.columns,
            showLoadingIcon: props.showLoadingIcon,
            validationErrors:props.validationErrors,
        }
    }

})
</script>