<template>
<div class="skeleton">
  <div class="container px-10">

  <div class="w-full mx-auto">
      <a href="" class="pt-5 flex justify-center">
          <img
              alt="Invoice Pro 360"
              class="w-6"
              src="@/assets/images/logo.svg" />
          <span class="text-theme-1 text-3xl ml-3">
              Invoice Pro <span class="font-medium">360</span>
          </span>
      </a>
  </div>
    <!-- BEGIN: Login Form -->

    <div class="flex">            
        <div class="mx-auto my-10 box p-8 w-full sm:w-3/4 lg:w-3/5 ">

            <h2 class="text-2xl text-center text-theme-1 heading "></h2>
            <div class="mt-2 text-gray-500 text-center subheading " ></div>

            <div class="mt-10 mb-20" style="height: 200px;"><LoadingIcon icon="oval" color="grey" class="w-4 h-4" /></div>
        </div>
    </div>
    <!-- END: Form -->
</div>
  
</div>
</template>


<style scoped>

.skeleton .heading{
    height:30px;
    width:100%;
    animation: pulse-bg 1s infinite;
}

.skeleton .subheading{
    height:20px;
    width:80%;
    margin-left:10%;
    animation: pulse-bg 1s infinite;
}
.skeleton .full-rounded{
    height:20px;
    width:20px;
    animation: pulse-bg 1s infinite;
}

.skeleton .report-box .full-rounded,
.skeleton .report-box .ml-auto{
    height:15px;
    width:25px;
  	animation: pulse-bg 1s infinite;    
}

.skeleton  .amount,
.skeleton .item-name{
    width:100px;
    height:16px;
    animation: pulse-bg 1s infinite;
}

@keyframes pulse-bg {
	0% {
		background-color: #eee;
	}
	50% {
		background-color: #eaeaea;
	}
	100% {
		background-color: #eee;
	}
}
</style>