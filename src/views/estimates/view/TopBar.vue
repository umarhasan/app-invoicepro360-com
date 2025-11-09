<template>
<div class="col-span-12">
    <div class="flex flex-col sm:flex-row items-center my-5  justify-between">
    <div>
        <h2 class="text-2xl font-bold mr-auto">{{title}}</h2>
    </div>
    <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
        
        <button type="button" 
        class="btn box text-gray-700 mr-2 flex items-center ml-auto sm:ml-0 py-3 w-full md:w-28 hidden">

            <Lucide icon="Eye" class="w-4 h-4 mr-2"/> 
            <span>{{ $T.PREVIEW_TXT }}</span>
        </button>
        <div class="flex">
            <button class="btn btn-primary py-3 w-auto border-0 border-r border-theme-3 rounded-r-none"> {{ $T.MORE_ACTION_BTN }} </button>
        
            <div class="dropdown">
                <button class="dropdown-toggle btn btn-primary py-3 w-auto rounded-l-none"
                    aria-expanded="false">
                    <Lucide icon="ChevronDown" class="w-4 h-5 ml-2" />
                </button>
                
                <div class="dropdown-menu w-52">
                    <div class="dropdown-menu__content box p-2">                
                        <a  href="javascript:void(0);" 
                            class="flex items-center block p-2 transition duration-300 ease-in-out bg-white hover:bg-gray-200 rounded-md font-semibold">
                            {{ $T.PRINT_TXT }}</a>
                        <a href="javascript:void(0);" class="flex items-center block p-2 transition duration-300 ease-in-out bg-white hover:bg-gray-200 rounded-md">
                            {{ $T.EXPORT_PDF_TXT }}</a>

                        <a href="javascript:void(0);" class="flex items-center block p-2 transition duration-300 ease-in-out bg-white hover:bg-gray-200 rounded-md">
                            {{ $T.DUPLICATE_TXT }}</a>

                        <a href="javascript:void(0);" class="flex items-center block p-2 transition duration-300 ease-in-out bg-white hover:bg-gray-200 rounded-md">
                            {{ $T.DELETE_TXT }}</a>
                    </div>
                </div>
            </div>
        </div>
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