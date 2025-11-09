<template>
<div>
    <Tippy v-if="defaultId == businessId" tag="div" content="Default business">
        <Lucide icon="Star"  class=" text-theme-11 default-business-star"  />
    </Tippy>

    <Tippy v-if="defaultId != businessId" tag="div" content="Click to set default business">
        <Lucide icon="Star"  class=" text-theme-11 cursor-pointer" @click="$emit('set',businessId)" />
    </Tippy>  
</div>
</template>

<script>
import { defineComponent,ref, watchEffect } from "vue"

export default defineComponent({
    props : ['defaultId','id'],
    emits: ["set"],
    setup(props){

        const defaultId     = ref(props.defaultId)
        const businessId    = props.id

        watchEffect(() => {
            defaultId.value  = props.defaultId
        })

        return {
            businessId,
            defaultId,
        }

    }

})
</script>
