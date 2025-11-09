<template>
    <table class="table box">
        <thead>
            <tr>
                <td>Multi-factor option</td>
                <td>Status</td>
                <td></td>
            </tr>
        </thead>
        <tbody>
        <tr v-for="(row, index) in records" :key="index" class="py-5 border-b" :row="row">              
            <td class="text-normal text-gray-700 capitalize">
                <img :src="getImageUrl(row.image)" class="w-40"/>
            </td>
            <td>
            <span class="py-1 px-2 rounded text-xs font-medium capitalize"
                :class="{
                'bg-theme-9 dark:text-dark-7 text-white' : row.status == 1,
                'bg-theme-8 dark:text-dark-7' : row.status == 0,
                }">{{(row.status == 1) ? 'Enabled' : 'Disabled' }}</span>
            
            </td>
            <td class="table-report__action">
                <div class="flex ">
                    <div class="ml-auto">
                        <a href="javascript:void(0);"
                        class="btn btn-sm btn-outline-primary px-4 py-1 flex gap-1 hover:text-white rounded-full"
                        @click="$emit('showSettingModal',row)">
                        <Lucide icon="Pencil" class="w-3 h-3" /> Edit</a>
                    </div>

                </div>
            </td>
        </tr>
        </tbody>
    </table> 
</template>

<script setup>
    const props = defineProps(['records'])
    const emits = defineEmits(["showSettingModal"])
    const getImageUrl = (imageName) => {
        return new URL(`/src/assets/images/${imageName}`, import.meta.url).href;
    };
</script>   