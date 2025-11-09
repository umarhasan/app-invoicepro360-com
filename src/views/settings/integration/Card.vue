<template>
  <div class="grid grid-cols-12 gap-5">
    <div
      class="col-span-6 intro-y sm:col-span-6 2xl:col-span-4"
      v-for="(row, index) in option"
      :key="index"
    >
      <div class="box">
        <div class="p-5">
          <div
            class="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10"
          >
            <img :src="row.image" class="rounded-md" />
          </div>
        </div>
        <div
          class="flex items-center justify-center p-3 border-t lg:justify-end border-slate-200/60"
        >
          <button v-if="1 == 2" class="btn btn-sm border-theme-11 rounded-full mr-2">
            <Lucide icon="Star" class="w-4 h-4 text-theme-11" />
            <span class="pl-1 text-theme-11">Default Payment Gateway</span>
          </button>

          <button
            class="btn btn-sm text-theme-9 border-theme-9 rounded-full w-16"
            @click="redirectTo(row.routeName)"
          >
            <Lucide icon="Edit3" class="w-4 h-4 text-theme-9" v-if="1 == 1" />
            <Lucide icon="LifeBuoy" class="w-4 h-4 text-theme-9" v-if="1 == 0" />
            <span class="pl-1 text-theme-9">{{ 1 == 1 ? "Edit" : "Setup" }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useIntegration } from "@/compositions/intuit/integrations";

export default defineComponent({
  setup() {
    const { option } = useIntegration();

    const redirectTo = (name) => {
      router.push({ name: name });
    };

    return {
      option,
      redirectTo,
    };
  },
});
</script>
