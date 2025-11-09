<template>
        <!-- <Menu :current-tab="currentTab"></Menu> -->
        <div class="col-span-12 mt-5">
            <slot></slot>            
        </div>
</template>

<script>

import Menu from "./Menu.vue"

export default {
    components : {
        Menu,
    },
    props : ['currentTab']
}
</script>
