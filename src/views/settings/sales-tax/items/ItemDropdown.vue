<template>
  <div class="tax-agency-list rounded absolute mt-2 border left-0 right-0">
    <div class="relative text-left border-b">
      <div class="px-3 py-2 flex-1 bg-white shadow-sm">
        <input
          type="text"
          :placeholder="placeholder"
          class="form-control w-full"
          v-model="search"
        />
        <Lucide icon="Search" class="w-4 h-4 absolute my-auto inset-y-0 mr-5 right-0" />
      </div>
    </div>
    <div class="max-h-64 overflow-scroll bg-white">
      <div
        class="relative text-left border-b"
        v-for="(agency, key) in filteredTaxAgency"
        :key="key"
      >
        <div
          class="px-3 py-2 flex-1 bg-white shadow-sm hover:bg-gray-200"
          @click="$emit('selectItem', agency, uid)"
        >
          <div class="font-medium capitalize">{{ agency.name }}</div>
        </div>
      </div>
    </div>
    <div class="relative text-center border-t">
      <div class="p-3 flex-1 bg-white text-theme-1 hover:bg-theme-1 hover:text-white">
        <Lucide icon="PlusCircle" class="w-5 h-5 font-bold"/>
        <a
          href="#"
          class="font-bold align-middle text-base"
          @click="$emit('addNewItem', search, uid)"
        >
          <span v-if="!agencyLoadingIcon">
            Create <span v-if="search">"{{ search }}" as </span> a new tax agency
          </span>
          <LoadingIcon
            icon="oval"
            color="white"
            class="w-5 h-5"
            v-if="agencyLoadingIcon"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
export default {
  props: ["placeholder", "uid", "taxAgencyList", "agencyLoadingIcon"],
  setup(props) {
    const search = ref();

    const filteredTaxAgency = computed(() => {
      return props.taxAgencyList.length > 0
        ? props.taxAgencyList.filter((agency) =>
            agency.name.toLowerCase().match(search.value)
          )
        : [];
    });

    return {
      search,
      filteredTaxAgency,
      uid: props.uid,
      placeholder: props.placeholder,
      agencyLoadingIcon: props.agencyLoadingIcon,
    };
  },
};
</script>

<style></style>
