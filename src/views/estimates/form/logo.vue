<template>
  <div class="w-52">
    <div
      class="bg-gray-100 border-2 border-dashed border-gray-150 shadow-sm rounded-md p-5"
    >
      <div class="bg-gray-100 h-40 relative image-fit cursor-pointer zoom-in mx-auto">
        <img v-if="setting.logo" class="rounded-md" alt="" :src="setting.logo" />

        <div
          v-if="!setting.logo"
          class="absolute top-0 left-0 right-0 bottom-0 w-full block cursor-pointer flex items-center justify-center"
        >
          <button
            type="button"
            style="background-color: rgba(255, 255, 255, 0.65)"
            class="hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded-lg shadow-sm"
            @click="$refs.fileInput.click()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-camera"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="0" y="0" width="24" height="24" stroke="none"></rect>
              <path
                d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"
              />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </button>
        </div>
      </div>
      <div class="mx-auto cursor-pointer relative mt-5" v-if="permissions.updateLogo">
        <button
          type="button"
          class="btn btn-outline-primary border-dashed hover:bg-theme-5 w-full"
          @click="$refs.fileInput.click()"
        >
          Change Logo
        </button>
        <input
          type="file"
          class="w-full h-full top-0 left-0 absolute opacity-0"
          id="fileInput"
          ref="fileInput"
          name="logo"
          accept="image/*"
          @change="$emit('onFilePicked', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["setting", "permissions"],
  setup(props) {
    return {
      setting: props.setting,
      permissions: props.permissions,
    };
  },
};
</script>
