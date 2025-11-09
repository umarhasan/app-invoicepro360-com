<template>
  <div class="">
    <top-bar :title="title" v-if="isLoaded" />

    <div class="" v-if="isLoaded">
      <div class="grid grid-cols-12 x-gap-5 box">
        <div class="col-span-12 lg:col-span-12 xxl:col-span-12 flex m-5">
          <div>
            <div class="mt-0.5 text-slate-500">
              {{ $T.STATUS_TXT }}
              <div class="text-primary text-lg xl:text-xl font-medium">
                {{ estimate.status }}
              </div>
            </div>
          </div>
          <div class="view-invoice-db border-slate-200"></div>
          <div>
            <div class="mt-0.5 text-slate-500">{{ $T.TOTAL_AMOUNT_TXT }}</div>
            <div
              class="text-primary text-lg xl:text-xl font-medium"
              v-html="$h.formatCurrency(estimate.grandTotal)"
            ></div>
          </div>
          <div class="view-invoice-db border-slate-200"></div>
          <div>
            <div class="mt-0.5 text-slate-500">{{ $T.CUSTOMER_TXT }}</div>
            <div class="text-primary text-lg xl:text-xl font-medium">
              {{ customer.customer }}
            </div>
          </div>
          <div class="view-invoice-db border-slate-200"></div>

          <div>
            <div class="mt-0.5 text-slate-500">{{ $T.EST_VALIDITY_DATE_TXT }}</div>
            <div class="text-primary text-lg xl:text-xl font-medium">
              {{ $h.formatDate(estimate.validityDate) }}
            </div>
          </div>
        </div>

        <div
          class="col-span-12 lg:col-span-12 xxl:col-span-12 py-5 border-t border-slate-200/60 mx-5"
        >
          <!-- created -->
          <div class="pb-5 border-b border-slate-200/60">
            <div class="form-inline items-center flex-col xl:flex-row">
              <div class="form-label sm:!mr-10">
                <div class="text-left">
                  <div class="flex items-center">
                    <div class="font-medium text-lg text-slate-500">
                      {{ $T.CREATED_TXT }}
                    </div>
                  </div>
                  <div class="leading-relaxed text-slate-500">
                    <span class="font-bold">{{ $T.CREATED_TXT }}: </span>
                    <span v-if="estimate.publishedDate == ''">just a moment ago</span>
                    <span v-if="estimate.publishedDate != ''">{{
                      $h.formatDate(estimate.publishedDate)
                    }}</span>
                  </div>
                </div>
              </div>
              <div
                class="w-full mt-3 xl:mt-0 flex-1 xl:text-right"
                v-if="estimate.status == 'draft'"
              >
                <button
                  class="btn btn-outline-primary border bg-theme-5 hover:text-white w-auto mr-2"
                  :class="{ disable: approveLoader }"
                  :disabled="approveLoader"
                  @click="approveEstimate"
                >
                  <LoadingIcon
                    icon="oval"
                    color="blue"
                    class="w-4 h-3 mr-1"
                    v-if="approveLoader"
                  />
                  <span>{{ $T.EST_APPROVE_DRAFT_TXT }}</span>
                </button>
                <button
                  class="btn btn-outline-primary border bg-theme-5 hover:text-white w-auto"
                  :class="{ disable: approveLoader }"
                  :disabled="approveLoader"
                  @click="redirecttoEdit"
                >
                  {{ $T.EST_DRAFT_BTN }}
                </button>
              </div>
              <div
                class="w-full mt-3 xl:mt-0 flex-1 xl:text-right"
                v-if="estimate.status != 'draft'"
              >
                <button
                  class="btn btn-outline-primary border bg-theme-5 hover:text-white w-auto"
                  @click="redirecttoEdit"
                >
                  {{ $T.EST_EDIT_BTN }}
                </button>
              </div>
            </div>
          </div>
          <!-- created -->

          <!-- Send -->
          <div class="py-5 border-b border-slate-200/60">
            <div class="form-inline items-center flex-col xl:flex-row">
              <div class="form-label sm:!mr-10">
                <div class="text-left">
                  <div class="flex items-center">
                    <div class="font-medium text-lg text-slate-500">
                      {{ $T.SEND_TXT }}
                    </div>
                  </div>
                  <div class="leading-relaxed text-slate-500">
                    <span class="font-bold">{{ $T.LAST_SEND_TXT }}: </span>
                    <span>{{
                      estimate.lastSendDate == "" ? "Never" : estimate.lastSendDate
                    }}</span>
                  </div>
                </div>
              </div>
              <div
                class="w-full mt-3 xl:mt-0 flex-1 xl:text-right"
                v-if="estimate.status != 'draft'"
              >
                <button
                  class="btn btn-outline-primary border bg-theme-5 hover:text-white w-auto mr-1"
                  @click="showSendEstimateModal"
                >
                  {{ estimate.lastSendDate == "" ? $T.EST_SEND_BTN : $T.EST_RESEND_BTN }}
                </button>
                <button
                  class="btn btn-outline-primary border bg-theme-5 hover:text-white w-auto"
                  @click="showShareLinkModal"
                >
                  {{ $T.SHARE_LINK_BTN }}
                </button>
              </div>
            </div>
          </div>
          <!-- Send -->
        </div>
        <div class="col-span-12 lg:col-span-4 xxl:col-span-4 hidden">
          <div class="font-medium px-5 py-8 box">
            <div class="grid grid-cols-2 gap-4 border-b border-slate-200/60 pb-2 mb-2">
              <div>{{ $T.STATUS_TXT }}</div>
              <div class="text-gray-600 text-right">{{ estimate.status }}</div>
            </div>

            <div class="grid grid-cols-2 gap-4 border-b border-slate-200/60 pb-2 mb-2">
              <div>{{ $T.CUSTOMER_TXT }}</div>
              <div class="text-gray-600 text-right">{{ customer.name }}</div>
            </div>

            <div class="grid grid-cols-2 gap-4 border-b border-slate-200/60 pb-2 mb-2">
              <div>{{ $T.DUE_AMOUNT_TXT }}</div>
              <div
                class="text-gray-600 text-right"
                v-html="$h.formatCurrency(estimate.dueAmount)"
              ></div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>{{ $T.DUE_DATE_TXT }}</div>
              <div class="text-gray-600 text-right">
                {{ $h.formatDate(estimate.validityDate) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SendEstimateModal
        :estimateNumber="estimate.estimateNumber"
        :to="customer.email"
        :estimateId="uuid"
      ></SendEstimateModal>
      <ShareLinkModal :shareUrl="estimate.shareUrl"></ShareLinkModal>

      <view-estimate-temp
        v-if="
          setting.invoice_template == 'professional' || setting.invoice_template == ''
        "
        :estimate="estimate"
        :grandTotal="grandTotal"
        :subTotal="subTotal"
        :salesTax="salesTax"
        :items="estimateItems"
        :setting="setting"
        :key="1"
      />

      <view-estimate-temp
        v-if="setting.invoice_template == 'classic'"
        :estimate="estimate"
        :grandTotal="grandTotal"
        :subTotal="subTotal"
        :salesTax="salesTax"
        :items="estimateItems"
        :setting="setting"
        :key="2"
      />

      <view-estimate-temp
        v-if="setting.invoice_template == 'modern'"
        :estimate="estimate"
        :grandTotal="grandTotal"
        :subTotal="subTotal"
        :salesTax="salesTax"
        :items="estimateItems"
        :setting="setting"
        :key="3"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { ViewEstimate } from "@/compositions/estimates";
import { useEstimateItems } from "@/compositions/estimates/items";
import { useSettings } from "@/compositions/invoices/settings";

import TopBar from "./TopBar.vue";

import ViewEstimateTemp from "../estimate-template/default-layout.vue";
import SendEstimateModal from "./SendEstimateModal.vue";

import ShareLinkModal from "./ShareLinkModal.vue";
import cash from "cash-dom"

export default defineComponent({
  components: {
    TopBar,
    ViewEstimateTemp,
    SendEstimateModal,
    ShareLinkModal,
  },
  setup() {
    const uuid = router.currentRoute.value.params.uid;

    const {
      title,
      estimate,
      subTotal,
      grandTotal,
      isLoaded,
      customer,
      approveLoader,
      approveEstimate,
      redirecttoEdit,
    } = ViewEstimate(uuid);

    const { salesTax, estimateItems } = useEstimateItems();
    const { setting, columns } = useSettings();

    const showSendEstimateModal = () => {
      cash("#send-invoice-modal").modal("show");
    };

    const showShareLinkModal = () => {
      cash("#share-link-modal").modal("show");
    };

    return {
      title,
      uuid,
      isLoaded,
      estimate,
      estimateItems,
      subTotal,
      grandTotal,
      salesTax,
      setting,
      columns,
      customer,
      approveLoader,
      approveEstimate,
      redirecttoEdit,
      showSendEstimateModal,
      showShareLinkModal,
    };
  },
});
</script>
