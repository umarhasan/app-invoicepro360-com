<template>
<div class="mx-auto">
    <div class="box border rounded">
        <form method="POST" @submit.prevent="savePayment">

            <div class="alert alert-danger-soft show my-2" v-if="validationErrors">
                <ul><li v-for="(err,index) in validationErrors" :key="index">{{err}}</li></ul>
                <button type="button" class="absolute right-2 top-2 bg-white px-2 py-1 rounded" 
                @click="validationErrors = null"><Lucide icon="X" class="w-4 h-4" /></button>
            </div>
            <h2 class="font-medium text-lg mr-auto pb-3 mb-3 text-primary uppercase border-b p-5">{{formTitle}}</h2>
            <div class="px-5">
                
                <div class="mb-2">
                    <div>
                        <label for="owner-name" class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-left">
                            Card Holder Name <span class="text-theme-6">*</span>
                        </label>
                    </div>

                    <div>
                        <input v-model="payment.name"
                            type="text" class="form-control yr-form-control"
                            :class="{'border-theme-6 focus:border-theme-6': validateCreditCard.name.$error}"
                            />                                                    
                    </div>
                </div>
                <div class="mb-2">
                        <div>
                            <label for="card-number" class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-left">
                                Card Number <span class="text-theme-6">*</span>
                            </label>
                        </div>

                        <div>
                            <input v-model="payment.cardNumber"
                                type="text" class="form-control yr-form-control"
                                :class="{'border-theme-6 focus:border-theme-6': validateCreditCard.cardNumber.$error}"
                                
                                />                                                    
                        </div>
                </div>    

                <div class="flex items-center">
                           

                    <div class="mb-2 md:w-2/4 mr-2">
                        <div>
                            <label for="card-expiry" class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-left">
                                Card Expiry <span class="text-theme-6">*</span>
                            </label>
                        </div>

                        <div class="">
                            <input 
                                v-model="payment.cardExpiry" 
                                @keypress="cardExpiryInput"
                                type="text" class="form-control yr-form-control"
                                placeholder="MM/YY"
                                maxlength="5"
                                :class="{'border-theme-6 focus:border-theme-6': validateCreditCard.cardExpiry.$error}"
                                />                                                    
                        </div>
                    </div>  

                    <div class="mb-2 md:w-2/4">
                    <div>
                        <label for="card-cvv" class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-left">
                            CVV <span class="text-theme-6">*</span>
                        </label>
                    </div>

                    <div class="">
                        <input v-model="payment.cardCvv"
                            type="text" class="form-control yr-form-control"
                            placeholder="CVV"
                            :class="{'border-theme-6 focus:border-theme-6': validateCreditCard.cardCvv.$error}"
                            />                                                    
                    </div>
                </div>

                </div>
                                                                    

                <div class="mb-2">
                    <div>
                        <label for="amount" class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-left">
                            Amount <span class="text-theme-6">*</span>
                        </label>
                    </div>
                    <div class="">
                        <input
                            type="text" class="form-control yr-form-control" 
                            readonly v-html="displayAmount" />    
                        
                    </div>
                </div>
            </div>
                <div class="text-right border-t p-5">
                <button 
                    type="button" 
                    class="btn btn-primary w-full mr-1"
                    :class="{'disable' : showLoadingIcon}"
                    :disabled="showLoadingIcon" 
                    @click="savePayment">
                    <span class="uppercase text-lg" v-if="!showLoadingIcon" v-html="displayAmount + ' checkout' "> </span>
                    <LoadingIcon icon="oval" color="white" class="w-5 h-5" v-if="showLoadingIcon" />
                </button>            

            </div>

        </form>
    </div>
</div>

</template>

<script>
import { defineComponent, ref, watchEffect,computed, onMounted } from "vue"
import { usePayment } from "@/compositions/payment/index"
import { helper as $h } from "@/utils/helper"

export default defineComponent({
    props : ['invoiceId','amount'],
    setup(props,{emit}) {

        const formTitle = ref("Invoice Checkout")
        const displayAmount = ref(0.00)

        const {
            payment,
            savePayment, 
            closeModal,
            validateCreditCard, 
            isSaved, 
            showLoadingIcon, 
            validationErrors,
            error,
            status
            } = usePayment('credit')

        watchEffect(() => { 
            if(isSaved.value) {
                closeModal()
            } 
        })

        const cardExpiryInput = (event) =>{
            let input = event.target.value;

            // Remove any non-digit characters
            input = input.replace(/\D/g, '');

            // Add slash after the first two characters if necessary
            if (input.length > 2) {
                console.log(input)
                input = input.slice(0, 2) + '/' + input.slice(2);
            }

            // Update the input field value
            payment.cardExpiry = input;
        }


        onMounted(  () => {

            displayAmount.value = $h.formatCurrency(props.amount)
            payment.value.invoiceId      = props.invoiceId            
            payment.value.amount         = "0"
            payment.value.paymentDate    = $h.formatDate(new Date(),'YYYY-MM-DD')
            payment.value.paymentMethod  = 'credit'
            payment.value.memo           = ''
            payment.value.name = null
            payment.value.cardNumber = null
            payment.value.cardCvv = null
            payment.value.cardExpiry = null
            
            error.value        = null
            status.value       = null

        })
        
        return {
            formTitle,
            displayAmount,
            payment, 
            cardExpiryInput,
            savePayment, 
            validateCreditCard, 
            isSaved, 
            showLoadingIcon, 
            validationErrors,
            error,
            status,
            closeModal,

        }
    }

})
</script>