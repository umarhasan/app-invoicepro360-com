<template>
  <div class="mb-3 box accordion" v-if="payments &&  payments.length">
    <div class="accordion-title" @click="isAccordionOpen = !isAccordionOpen">
      <label class="form-label">Payments</label>
      <div>
        <Lucide :icon="isAccordionOpen ? 'ChevronUp' : 'ChevronDown'" class="w-4 h-4" />
      </div>
    </div>

    <transition name="accordion">
      <div v-show="isAccordionOpen" class="p-3 accordion-content invoice-send-history">
        <div v-for="(payment, index) in payments" :key="index"
          class="flex justify-between items-center px-2 py-3 bg-gray-100 dark:bg-dark-2 border border-dashed dark:border-dark-3 border-gray-150 rounded mb-2 hover:bg-theme-5">
          <div class="flex items-center gap-2">
            <button @click="voidPayment(payment)" v-if="payment.paymentMethod != 'clover-pos' && payment.status != 'voided'"
              class="btn btn-sm btn-outline-primary border bg-theme-5 hover:text-white" >Void</button>
            <span class="text-primary font-bold hidden"> {{ $T.SEND_RECEIPT_BTN }}</span>
              <i class="text-danger font-italic text-sm pr-1" v-if="payment.status != 'paid'">
                {{ payment.status }}
              </i>
            <div>              
              <span class="font-medium text-lg capitalize">{{ payment.paymentMethod }}</span>
              <span class="text-xs block"> {{ $h.formatDate(payment.paymentDate) }}</span>
            </div>
          </div>
          <div class="text-success font-bold text-lg" v-html="$h.formatCurrency(payment.amount)"></div>
        </div>
        <!--<div class="mr-auto">
     <span>
      <button
        v-if="payment.paymentMethod != 'clover-pos'"
        class="btn btn-sm btn-outline-primary border bg-theme-5 hover:text-white"
      >Void</button>
      
       <span class="text-primary font-bold hidden">
        {{ $T.SEND_RECEIPT_BTN }}</span> 
    </span>
  </div>-->
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { usePayment } from "@/compositions/payment/index";

const props = defineProps(['invoiceId'])
const invoiceId = ref(props.invoiceId)
const isAccordionOpen = ref(false)
const {
  payments,
  payment,
  fetchPayments,
  voidPayment
} = usePayment();

onMounted(() => {
  console.log(payments.length)
  if (invoiceId.value) {
    payment.value.invoiceId = invoiceId.value
    fetchPayments()
    invoiceId.value = ''
  } else {
    payments.value = []
  }
})

</script>