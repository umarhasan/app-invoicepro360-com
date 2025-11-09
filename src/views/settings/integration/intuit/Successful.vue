<template>
    <div class="">      
  
      <div class="w-5/6 mx-auto box p-5 mt-5">
        <p>Intuit oauth response fetched successfully</p> 
        <br>
        <a href='javascript:void(0)' @click='refreshParent()' class="btn btn-primary">Close </a>
      </div>
        
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";

export default defineComponent({

    setup() {



        const refreshParent = () => {
        
            window.opener.location.reload();

            window.close();
        }
    


        return {
            refreshParent
        }
    },
});
</script>
  