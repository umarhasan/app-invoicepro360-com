<template>
<Dialog size="lg" staticBackdrop :open="isOpen">
  <Dialog.Panel>
    <form method="POST" @submit.prevent="submit">
          <!-- BEGIN: Modal Header -->
          <Dialog.Title>
            <h2 class="font-medium text-base mr-auto">{{ formTitle }}</h2>
            
            <Lucide icon="X" class="w-8 h-8 cursor-pointer" @click="$emit('close')" /> 
          </Dialog.Title>
          <!-- END: Modal Header -->
          <!-- BEGIN: Modal Body -->
          <Dialog.Description class="p-0 bg-white">          
            <div class="alert alert-danger-soft show my-2" v-if="validationErrors">
              <ul>
                <li v-for="(err, index) in validationErrors" :key="index">{{ err }}</li>
              </ul>
              <button
                type="button"
                class="absolute right-2 top-2 bg-white px-2 py-1 rounded"
                @click="validationErrors = null"
              >
                <Lucide icon="X" class="w-4 h-4" />
              </button>
            </div>
            <div class="py-5 px-10">
              <div class="md:flex md:items-center mb-2">
                <div class="md:w-1/4">
                  <label
                    for="tax-name"
                    class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-right"
                  >
                    From <span class="text-theme-6">*</span>
                  </label>
                </div>

                <div class="md:w-3/4">
                  <input
                    v-model="mail.from"
                    type="text"
                    class="form-control yr-form-control"
                    :class="{
                      'border-theme-6 focus:border-theme-6': validate.from.$error,
                    }"
                    readonly
                  />
                </div>
              </div>
              <div class="md:flex md:items-center mb-2">
                <div class="md:w-1/4">
                  <label
                    for="to"
                    class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-right"
                  >
                    To <span class="text-theme-6">*</span>
                  </label>
                </div>
                <div class="md:w-3/4">
                  <input
                    v-model="mail.to"
                    type="text"
                    class="form-control yr-form-control"
                    placeholder="To."
                    :class="{ 'border-theme-6 focus:border-theme-6': validate.to.$error }"
                  />
                  <div
                    v-if="validate.to.required.$invalid && validate.to.$dirty"
                    class="text-theme-6 text-xs"
                  >
                    Customer mail is required
                  </div>
                </div>
              </div>

              <div class="md:flex md:items-center mb-2">
                <div class="md:w-1/4"></div>
                <div class="md:w-3/4">
                  <div v-if="mail.cc.length > 0">
                    <div v-for="(recipient, index) in mail.cc" :key="index" class="mb-2">
                      <input
                        :value="recipient"
                        type="text"
                        class="form-control yr-form-control w-11/12 cc"
                        placeholder=""
                      />
                      <Lucide icon="Trash2" class="-mt-2 hover:text-theme-6 cursor-pointer w-1/12 h-6" @click="deleteRecipient(index)" />
                      
                    </div>
                  </div>

                  <div v-if="displayRecipientField">
                    <div>
                      <input
                        v-model="mail.recipient"
                        type="text"
                        class="form-control yr-form-control w-11/12"
                        placeholder=""
                        :class="{
                          'border-theme-6 focus:border-theme-6':
                            recipientValidate.recipient.$error,
                        }"
                      />
                      <Lucide icon="Trash2" class="-mt-2 hover:text-theme-6 cursor-pointer w-1/12 h-6" @click="hideRecipientField()" />

                    </div>

                    <div
                      v-if="
                        (recipientValidate.recipient.required.$invalid ||
                          recipientValidate.recipient.email.$invalid) &&
                        recipientValidate.recipient.$dirty
                      "
                      class="text-theme-6 text-xs"
                    >
                      Enter valid email
                    </div>
                  </div>

                  <div class="flex">
                    <a
                      href="javascript:void(0);"
                      class="text-primary font-bold mt-2"
                      @click="addRecipient"
                    >
                      <Lucide icon="PlusCircle" class="w-5 h-5 font-bold" />
                      Add recipient
                    </a>
                  </div>
                </div>
              </div>

              <div class="md:flex md:items-center mb-2">
                <div class="md:w-1/4">
                  <label
                    for="subject"
                    class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-right"
                  >
                    Subject
                  </label>
                </div>
                <div class="md:w-3/4">
                  <input
                    v-model="mail.subject"
                    type="text"
                    class="form-control yr-form-control"
                    placeholder="Subject"
                  />
                </div>
              </div>

              <div class="md:flex md:items-center mb-2">
                <div class="md:w-1/4">
                  <label
                    for="message"
                    class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-right"
                    >Message
                  </label>
                </div>
                <div class="md:w-3/4">
                  <textarea
                    v-model="mail.message"
                    name="message"
                    cols="25"
                    rows="3"
                    class="form-control yr-form-control"
                    placeholder="Message"
                  ></textarea>
                </div>
              </div>

              <div class="md:flex md:items-center">
                <div class="md:w-1/4"></div>
                <div class="md:w-3/4">
                  <Checkbox
                    classes="mb-3"
                    v-model:checked="mail.isAttachPDF"
                    :true-value="true"
                    :false-value="false"
                  >
                    Attach the invoice as a PDF
                  </Checkbox>

                  <Checkbox
                    classes="mb-3"
                    v-model:checked="mail.isSendOwn"
                    :true-value="true"
                    :false-value="false"
                  >
                    Send a copy to myself at {{ mail.from }}
                  </Checkbox>
                </div>
              </div>
            </div>
          </Dialog.Description>
          <!-- END: Modal Body -->

          <!-- BEGIN: Modal Footer -->
          <Dialog.Footer>
            <div class="text-right">
              <button
                type="button"
                class="btn btn-primary w-20 mr-1"
                :class="{ disable: showLoadingIcon }"
                :disabled="showLoadingIcon"
                @click="submit"
              >
                <span v-if="!showLoadingIcon">Send</span>
                <LoadingIcon
                  icon="oval"
                  color="white"
                  class="w-5 h-5"
                  v-if="showLoadingIcon"
                />
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary w-20"
                @click="$emit('close')"
              >
                Cancel
              </button>
            </div>
          </Dialog.Footer>  
          <!-- END: Modal Footer -->      
      </form>
  </Dialog.Panel>
</Dialog>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, watch } from "vue";
import { sendInvoice, Recipient } from "@/compositions/invoices/send-invoice";
import  Dialog  from "@/components/Headless//Dialog";
  const props = defineProps(["to", "invoiceNumber", "invoiceId","companyName",'isOpen']);  
  const formTitle = ref("Send Invoice");
  const isOpen = ref(props.isOpen)
  const {
    mail,
    submit,
    resetForm,
    validate,
    isMailSend,
    showLoadingIcon,
    validationErrors,
    error,
    status,
  } = sendInvoice();

  const {
    addRecipient,
    deleteRecipient,
    recipientValidate,
    hideRecipientField,
    displayRecipientField,
  } = Recipient();

  watchEffect(() => {
    if (isMailSend.value) {
      resetForm();
      isOpen.value = false
      mail.value.subject = `invoice ${props.invoiceNumber} from ${props.companyName}`;
    }
  });

  watch([props],() =>{
    mail.value.invoiceId = props.invoiceId;
    mail.value.to = props.to;
    mail.value.subject = `invoice ${props.invoiceNumber} from ${props.companyName}`;
    isOpen.value = props.isOpen
  })

  onMounted(async () => {
    mail.value.cc = [];    
    mail.value.message = '';
    error.value = null;
    status.value = null;
  });

</script>
