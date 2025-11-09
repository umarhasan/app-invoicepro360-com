<template>
  <div class="col-span-12 lg:col-span-4 xxl:col-span-4 my-0 lg:mb-10">
    <div class="my-2 max-w-2xl mx-auto space-y-4 lg:space-y-6">
      <div v-for="(userType, index) in userTypes" :key="index" class="item bg-white shadow-md rounded-md p-3">
        <div class="flex items-center cursor-pointer justify-between" @click="togglePermissions(index)">
          <div class="ml-3 lg:ml-4 md:text-lg text-blue-600">
            <span>{{ userType.name }} Permissions</span>
          </div>

          <div class="bg-blue-100 text-blue-400 w-8 h-8 md:w-10 md:h-10 rounded-md flex items-center justify-center font-bold text-lg font-display">                             
            <Lucide :icon="openSections[index] ? 'ChevronDown' : 'ChevronUp'" />
          </div>
        </div>

        <div
          class="relative overflow-hidden transition-all max-h-0 duration-700"
          :style="openSections[index] ? `max-height: ${$el.scrollHeight}px` : 'max-height: 0;'"
        >
          <div class="text-gray-700 my-6 mx-4 pb-0 border-b">
            <p
              v-for="(permission, ind) in userType.permissions"
              :key="ind"
              class="py-2 border-t flex justify-between"
            >
              <span class="text-sm">{{ permission.module }}</span>
              <span class="text-xs font-bold leading-normal ">{{ permission.accessLevel }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: ['userTypes'],

  setup(props) {
    const openSections = ref(new Array(props.userTypes.length).fill(false));

    const togglePermissions = (index) => {
      openSections.value[index] = !openSections.value[index];
    };

    return {
      openSections,
      togglePermissions,
      userTypes: props.userTypes,
    };
  },
};
</script>
