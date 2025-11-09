<template>
  <div class="sm:grid grid-cols-7 gap-5 py-2 border-t">
    <div class="col-span-2">
      <TomSelect
        v-model="item.type"
        :options="{
          search: false,
          classNames: 'w-full',
          placeholder: 'Select Type',
        }"
      >
        <option value="text">Text</option>
        <option value="dropdown">Dropdown</option>
      </TomSelect>
    </div>
    <div class="col-span-4" v-if="item.type == 'text'">
      <input
        v-model="item.name"
        type="text"
        class="form-control yr-form-control"
        placeholder="Field name"
      />
    </div>

    <div class="col-span-4" v-if="item.type == 'dropdown'">
      <input
        v-model="item.name"
        type="text"
        class="form-control yr-form-control mb-2"
        placeholder="Field name"
      />

      <textarea class="form-control yr-form-control" col="8" row="5" v-model="item.option"></textarea>
      <em>One item per line</em>
    </div>
    <div class="text-center pt-3" v-if="item.type != ''">
      <Lucide icon="Trash2"
        class="ml-3 -mt-2 hover:text-theme-6 cursor-pointer"
        @click="deleteField(item.uid)"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useCustomFields } from "@/compositions/settings/payment-types";

export default defineComponent({
  props: {
    item: Object,
  },
  setup(props) {
    const { deleteField } = useCustomFields();

    return {
      item: props.item,
      deleteField,
    };
  },
});
</script>

<style>
tr.item td {
  padding: 0.5em !important;
}
</style>
