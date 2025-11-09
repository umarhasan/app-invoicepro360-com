<template>
  <Tippy
    :tag="tag"
    :options="{
      placement: 'left'
    }"
    ref-key="sideMenuTooltipRef"
  >
    <slot></slot>
  </Tippy>
  
</template>

<script>
import { defineComponent, provide, ref, onMounted, watchEffect } from "vue";
import cash from "cash-dom"
import tippy from 'tippy.js';
export default defineComponent({
  props: {
    tag: {
      type: String,
      default: "span"

    },
    isCollapsed: {
      type: Boolean,
      default: false

    }
  },
  setup(props) {

    console.log(1)
    const tippyRef = ref();
    const isCollapseFirst = ref(false);
    

    provide("bind[sideMenuTooltipRef]", el => {
      tippyRef.value = el;
    });
    
    const toggleTooltip = () => {
      const el = tippyRef.value;
      // if (cash(window).width() <= 1260) {
      if (props.isCollapsed) {
        // this i comment and it worked
        //el._tippy.enable();
      } else {
       // this i comment and it worked
        //el._tippy.disable();
      }
    };

    const initTooltipEvent = () => {
      window.addEventListener("resize", () => {
        toggleTooltip();
      });
    };

    onMounted(() => {
      
      //console.log(props)
      toggleTooltip();
      initTooltipEvent();
    });
    

    watchEffect(() => {
      if(props.isCollapsed){
        toggleTooltip();
        isCollapseFirst.value = true;
      //  console.log(props.isCollapsed, "inside if")
      }
      //console.log(props.isCollapsed, "outside if")

      if(isCollapseFirst.value && !props.isCollapsed){
        toggleTooltip();
      }
      
      // toggleTooltip();
      //console.log(el)
    })

  }
});
</script>
