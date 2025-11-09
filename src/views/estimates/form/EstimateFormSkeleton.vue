<template>
  <div class="skeleton no-print">
    <div class="col-span-12 ">
      <div class="flex flex-col sm:flex-row items-center my-5 justify-between">
        <div>
          <h2 class="heading full-rounded"></h2>
        </div>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
          <button class="export-btn border-slate-100 mx-1"></button>
          <button class="export-btn border-slate-100 mx-1"></button>
          <button class="export-btn border-slate-100 mx-1"></button>
          <button class="export-btn border-slate-100 mx-1"></button>
          <button class="export-btn  border-slate-100 mx-1"></button>
          <button class="export-btn border-slate-100 mx-1"> </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-5 no-print">
      <div class="col-span-12 lg:col-span-12 xxl:col-span-12 estimate-form">
        <div class="bg-white rounded">
          <div class="text-gray-700 grid grid-cols-12 px-5 pt-5 pb-10">
            <div class="col-span-8">
              <div class="w-52">
                <div class="bg-gray-100 border-2 border-dashed border-gray-150 shadow-sm rounded-md p-5" >
                  <div class="bg-gray-100 h-40 relative image-fit cursor-pointer zoom-in mx-auto logo full-rounded" style="height:150px;"></div>
                  <!--v-if-->
                </div>
              </div>
              <div class="mt-5 w-1/2"><!--v-if-->
                <div><!--v-if--><!--v-if-->
                  <div class="customer-preview p-2 bg-gray-100 border-2 border-dashed border-gray-150 rounded-md"  style="height:150px;">
                    <div class="full-rounded"></div>
                  </div>
                </div>                
              </div>
            </div>
            <div class="col-span-4 ">
              <div class="lg:ml-auto lg:text-right mb-10">
                <div class="text-xl text-theme-1 font-medium heading"></div>
                <div class="mt-1 ml-auto"></div>
                <div class="mt-1 ml-auto"></div>
              </div>
              <div class="sm:grid gap-2 my-2">
                <div class="ml-auto"></div>
                <div class="ml-auto"></div>
              </div>
              <div class="sm:grid grid-cols-1 gap-3 mb-2">
                <div class="ml-auto"></div>
              </div>
              <div class="sm:grid grid-cols-2 gap-3">
                <div class="relative ml-auto"></div>
                <div class="relative ml-auto"></div>
              </div>
            </div>
          </div><!-- Line Item -->
          <div class="pb-5">
            <table class="table">
              <thead>
                <tr class="border-t-2 border-b-2 uppercase">
                  <th class="whitespace-nowrap w-54">
                      <div class="input-s"></div>
                  </th>
                  <th class="text-right whitespace-nowrap w-20">
                      <div class="input-s"></div>
                  </th>
                  <th class="text-left whitespace-nowrap w-20">
                      <div class="input-s"></div>
                  </th>
                  <th class="text-left whitespace-nowrap w-20">
                      <div class="input-s"></div>
                  </th>
                  <th class="text-right whitespace-nowrap w-10">
                      <div class="input-s"></div>
                  </th>
                  <th class="w-10"></th>
                </tr>                
              </thead>
            </table>
          </div>
          <div class="text-gray-700 grid grid-cols-12 px-5 pb-5">
            <div class="col-span-8 pr-5">
              <div class="heading"></div>
              <div class="input-s mt-5"></div>
              <div class="pt-5">
                <div class="heading"></div>
                <div class="input-s mt-5"></div>
              </div>
            </div>
            <div class="col-span-4 pt-5 pl-5">
              <div class="flex justify-between mt-2 mb-4 h-8 ml-auto"></div>
              <div class="flex justify-between mt-2 mb-4 h-8 ml-auto"></div>
              <div class="flex justify-between mt-2 mb-4 h-8 ml-auto"></div>
              <div class="flex justify-between  mt-1 ml-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>

.skeleton .heading{
    height:20px;
    width:100%;
    animation: pulse-bg 1s infinite;
}
.skeleton .full-rounded{
    height:20px;
    width:20px;
    animation: pulse-bg 1s infinite;
}

.skeleton  .full-rounded,
.skeleton .ml-auto{
    height:15px;
    width:50%;
  	animation: pulse-bg 1s infinite;    
}

.skeleton  .amount,
.skeleton .input-s{
    width:100px;
    height:16px;
    animation: pulse-bg 1s infinite;
}

.skeleton .export-btn{
  width: 60px;
  height: 30px;
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