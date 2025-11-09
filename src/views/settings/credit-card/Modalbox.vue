<template>
<Dialog size="lg" staticBackdrop :open="isOpen">
    <Dialog.Panel>
        <Dialog.Title>
          <h1 class="font-medium text-base mr-auto">{{ type }} Settings</h1>
        </Dialog.Title>
        <Dialog.Description>
          <DangerAlert v-if="error">
            <ul>
              <li v-for="(err, index) in validationErrors" :key="index">
                {{ err }}
              </li>
            </ul>
            <button type="button" class="btn-close" @click="error = null">
              <Lucide icon="X" class="w-4 h-4" />
            </button>
          </DangerAlert>

          <div class="px-5" v-if="type == 'Payeezy'">
            <div class="md:flex md:items-center mb-5">
              <div class="md:w-2/6">
                <label
                  for="tax-name"
                  class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-right"
                >
                  Payeezy Api Key <span class="text-theme-6">*</span>
                </label>
              </div>

              <div class="md:w-4/6">
                <input
                  v-model="option.payeezy.ApiKey"
                  type="text"
                  class="form-control yr-form-control"
                  :class="{ 'border-theme-6': validatePayeezy.ApiKey.$error }"
                />
                <div
                  class="text-theme-6 text-xs"
                  v-if="
                    validatePayeezy.ApiKey.required.$invalid &&
                    validatePayeezy.ApiKey.$dirty
                  "
                >
                  {{ validatePayeezy.ApiKey.required.$message }}
                </div>
              </div>
            </div>

            <div class="md:flex md:items-center mb-5">
              <div class="md:w-2/6">
                <label
                  for="payeezy-api-secret"
                  class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-right"
                >
                  Payeezy Api Secret <span class="text-theme-6">*</span>
                </label>
              </div>

              <div class="md:w-4/6">
                <input
                  v-model="option.payeezy.ApiSecret"
                  type="text"
                  class="form-control yr-form-control"
                  :class="{ 'border-theme-6': validatePayeezy.ApiSecret.$error }"
                />
                <div
                  class="text-theme-6 text-xs"
                  v-if="
                    validatePayeezy.ApiSecret.required.$invalid &&
                    validatePayeezy.ApiSecret.$dirty
                  "
                >
                  {{ validatePayeezy.ApiSecret.required.$message }}
                </div>
              </div>
            </div>

            <div class="md:flex md:items-center mb-5">
              <div class="md:w-2/6">
                <label
                  for="payeezy-api-token"
                  class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-right"
                >
                  Payeezy Api Token <span class="text-theme-6">*</span>
                </label>
              </div>

              <div class="md:w-4/6">
                <input
                  v-model="option.payeezy.ApiToken"
                  type="text"
                  class="form-control yr-form-control"
                  :class="{ 'border-theme-6': validatePayeezy.ApiToken.$error }"
                />
                <div
                  class="text-theme-6 text-xs"
                  v-if="
                    validatePayeezy.ApiToken.required.$invalid &&
                    validatePayeezy.ApiToken.$dirty
                  "
                >
                  {{ validatePayeezy.ApiToken.required.$message }}
                </div>
              </div>
            </div>

            <div class="md:flex md:items-center">
              <div class="md:w-2/6"></div>

              <div class="md:w-4/6">
                <div class="font-medium my-3">
                  <Checkbox
                    classes="ml-1"
                    v-model:checked="option.payeezy.isDefault"
                    true-value="1"
                    false-value="0"
                  >
                    Set as default payment gateway
                  </Checkbox>
                </div>
              </div>
            </div>
          </div>
          <!--Payeezy-->
          <!--Clover-->
          <div class="px-5" v-if="type == 'Clover'">
            <div class="md:flex md:items-center mb-5">
              <div class="md:w-2/6">
                <label
                  for="tax-name"
                  class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-right"
                >
                  Clover Ecommerce Private Token <span class="text-theme-6">*</span>
                </label>
              </div>

              <div class="md:w-4/6">
                <input
                  v-model="option.clover.ApiToken"
                  type="text"
                  class="form-control yr-form-control"
                  :class="{ 'border-theme-6': validateClover.ApiToken.$error }"
                />
                <div
                  class="text-theme-6 text-xs"
                  v-if="
                    validateClover.ApiToken.required.$invalid &&
                    validateClover.ApiToken.$dirty
                  "
                >
                  {{ validateClover.ApiToken.required.$message }}
                </div>
              </div>
            </div>

            <div class="md:flex md:items-center">
              <div class="md:w-2/6"></div>

              <div class="md:w-4/6">
                <div class="font-medium my-3">
                  <Checkbox
                    classes="ml-1"
                    v-model:checked="option.clover.isDefault"
                    true-value="1"
                    false-value="0"
                  >
                    Set as default payment gateway
                  </Checkbox>
                </div>
              </div>
            </div>
          </div>
          <!--Clover -->
          <!--Paypal -->
          <div class="px-5" v-if="type == 'Paypal'">
            <div class="md:flex md:items-center mb-5">
              <div class="md:w-2/6">
                <label
                  for="paypal-api-key"
                  class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-right"
                >
                  Paypal Api Key <span class="text-theme-6">*</span>
                </label>
              </div>

              <div class="md:w-4/6">
                <input
                  v-model="option.paypal.ApiKey"
                  type="text"
                  class="form-control yr-form-control"
                  :class="{ 'border-theme-6': validatePaypal.ApiKey.$error }"
                />
                <div
                  class="text-theme-6 text-xs"
                  v-if="
                    validatePaypal.ApiKey.required.$invalid &&
                    validatePaypal.ApiKey.$dirty
                  "
                >
                  {{ validatePaypal.ApiKey.required.$message }}
                </div>
              </div>
            </div>

            <div class="md:flex md:items-center mb-5">
              <div class="md:w-2/6">
                <label
                  for="paypal-api-secret"
                  class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-right"
                >
                  Paypal Api Secret <span class="text-theme-6">*</span>
                </label>
              </div>

              <div class="md:w-4/6">
                <input
                  v-model="option.paypal.ApiSecret"
                  type="text"
                  class="form-control yr-form-control"
                  :class="{ 'border-theme-6': validatePaypal.ApiSecret.$error }"
                />
                <div
                  class="text-theme-6 text-xs"
                  v-if="
                    validatePaypal.ApiSecret.required.$invalid &&
                    validatePaypal.ApiSecret.$dirty
                  "
                >
                  {{ validatePaypal.ApiSecret.required.$message }}
                </div>
              </div>
            </div>

            <div class="md:flex md:items-center">
              <div class="md:w-2/6"></div>

              <div class="md:w-4/6">
                <div class="font-medium my-3">
                  <Checkbox
                    classes="ml-1"
                    v-model:checked="option.paypal.isDefault"
                    true-value="1"
                    false-value="0"
                  >
                    Set as default payment gateway
                  </Checkbox>
                </div>
              </div>
            </div>
          </div>
          <!-- Paypal-->
          <!-- Stripe-->
          <div class="px-5" v-if="type == 'Stripe'">
            <div class="md:flex md:items-center mb-5">
              <div class="md:w-2/6">
                <label
                  for="strip-api-key"
                  class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-right"
                >
                  Stripe Api Key <span class="text-theme-6">*</span>
                </label>
              </div>

              <div class="md:w-4/6">
                <input
                  v-model="option.stripe.ApiKey"
                  type="text"
                  class="form-control yr-form-control"
                  :class="{ 'border-theme-6': validateStripe.ApiKey.$error }"
                />
                <div
                  class="text-theme-6 text-xs"
                  v-if="
                    validateStripe.ApiKey.required.$invalid &&
                    validateStripe.ApiKey.$dirty
                  "
                >
                  {{ validateStripe.ApiKey.required.$message }}
                </div>
              </div>
            </div>

            <div class="md:flex md:items-center mb-5">
              <div class="md:w-2/6">
                <label
                  for="stripe-api-secret"
                  class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-right"
                >
                  Stripe Api Secret <span class="text-theme-6">*</span>
                </label>
              </div>

              <div class="md:w-4/6">
                <input
                  v-model="option.stripe.ApiSecret"
                  type="text"
                  class="form-control yr-form-control"
                  :class="{ 'border-theme-6': validateStripe.ApiSecret.$error }"
                />
                <div
                  class="text-theme-6 text-xs"
                  v-if="
                    validateStripe.ApiSecret.required.$invalid &&
                    validateStripe.ApiSecret.$dirty
                  "
                >
                  {{ validateStripe.ApiSecret.required.$message }}
                </div>
              </div>
            </div>

            <div class="md:flex md:items-center mb-5">
              <div class="md:w-2/6">
                <label
                  for="stripe-api-token"
                  class="block font-bold text-gray-600 mb-1 md:mb-0 pr-4 text-right"
                >
                  Stripe Api Token <span class="text-theme-6">*</span>
                </label>
              </div>

              <div class="md:w-4/6">
                <input
                  v-model="option.stripe.ApiToken"
                  type="text"
                  class="form-control yr-form-control"
                  :class="{ 'border-theme-6': validateStripe.ApiToken.$error }"
                />
                <div
                  class="text-theme-6 text-xs"
                  v-if="
                    validateStripe.ApiToken.required.$invalid &&
                    validateStripe.ApiToken.$dirty
                  "
                >
                  {{ validateStripe.ApiToken.required.$message }}
                </div>
              </div>
            </div>

            <div class="md:flex md:items-center">
              <div class="md:w-2/6"></div>

              <div class="md:w-4/6">
                <div class="font-medium my-3">
                  <Checkbox
                    classes="ml-1"
                    v-model:checked="option.stripe.isDefault"
                    true-value="1"
                    false-value="0"
                  >
                    Set as default payment gateway
                  </Checkbox>
                </div>
              </div>
            </div>
          </div>
          <!-- Stripe-->
                  
        </Dialog.Description>
        <Dialog.Footer>
          <button
            type="button"
            class="btn btn-outline-secondary w-20 mr-1"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :class="{ disable: showLoadingIcon }"
            :disabled="showLoadingIcon"
            @click="save()"
          >
            <span v-if="!showLoadingIcon">Save Changes</span>
            <LoadingIcon
              icon="oval"
              color="white"
              class="w-5 h-5"
              v-if="showLoadingIcon"
            />
          </button>          
        </Dialog.Footer>
    </Dialog.Panel>
</Dialog>
</template>

<script setup lang="ts">
import Dialog from "@/components/Headless/Dialog";
import { usePaymentGateway } from "@/compositions/settings/payment-gateways";
	const props = defineProps(['isOpen'])
	const emits = defineEmits(['close'])
	const {
		option,
		showLoadingIcon,
		save,
		validatePayeezy,
		validatePaypal,
		validateClover,
		validateStripe,
		type,
		error,
		validationErrors
	} = usePaymentGateway();
</script>
