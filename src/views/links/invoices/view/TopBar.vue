<template>
<div class="col-span-12">
    <div class="flex flex-col sm:flex-row items-center my-5 mx-auto justify-between">
    <div>
        <h2 class="text-2xl font-bold mx-auto text-white">{{title}}</h2>
    </div>
    
    </div>
</div>

</template>    

<script>
export default {
    props : ['title'],
    setup(props){
        return {
            title: props.title,
        }
    }
}
</script>