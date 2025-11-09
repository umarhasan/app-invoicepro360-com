<template>
  <div
    id="share-link-modal"
    class="modal"
    data-backdrop="static"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <form method="POST" @submit.prevent="submit">
        <div class="modal-content">
          <!-- BEGIN: Modal Header -->
          <div class="modal-header">
            <h2 class="font-medium text-base mr-auto">{{ formTitle }}</h2>
            <Lucide icon="X" class="w-8 h-8 cursor-pointer" @click="closeModal" />
          </div>
          <!-- END: Modal Header -->
          <!-- BEGIN: Modal Body -->
          <div class="modal-body p-0 bg-white">
            <div class="py-5 px-20">
              <div class="text-center">
                <p>Your customer can view the estimate at this link:</p>
              </div>
              <div class="text-center my-2">
                <input
                  v-model="link"
                  type="text"
                  class="form-control yr-form-control"
                  placeholder="Share link"
                />
              </div>

              <div class="text-center">
                Copy the link and share it with your customer.
              </div>
            </div>
          </div>
          <!-- END: Modal Body -->

          <!-- BEGIN: Modal Footer -->
          <div class="modal-footer text-right">
            <button type="button" class="btn btn-primary w-28 mr-1" @click="copyLink">
              Copy Link
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary w-20"
              @click="closeModal"
            >
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
import { defineComponent, ref } from "vue";
import cash from "cash-dom"

export default defineComponent({
  props: ["shareUrl"],
  setup(props, { emit }) {
    const formTitle = ref("Get Share Link");
    const link = ref(props.shareUrl);

    const closeModal = () => {
      cash("#share-link-modal").modal("hide");
    };

    const copyLink = () => {
      cash("#share-link-modal").modal("hide");
    };

    return {
      formTitle,
      link,
      closeModal,
      copyLink,
    };
  },
});
</script>
