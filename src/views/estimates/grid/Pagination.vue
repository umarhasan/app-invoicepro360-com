<template>
  <div class="pagination mr-auto">
    <span>
        Page size
        <select class="page-size" v-model="meta.size">
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="35">35</option>
        <option value="50">50</option>
        </select>
    </span>
    
    <nav class="w-full sm:w-auto sm:ml-auto">
        <ul class="pagination" v-if="pages >  1">

        <!--navigate to first page -->
          <li>
            <a class="pagination__link disabled" href="javascript:void(0);" v-if="meta.current == 1">
                <Lucide icon="ChevronsLeft" class="w-4 h-4" />
            </a>          
            <a class="pagination__link" href="" 
                @click.prevent="firstPageClick()" v-if="meta.current > 1">
                <Lucide icon="ChevronsLeft" class="w-4 h-4" />
            </a>
          </li>
        <!--navigate to first page -->
        <!--navigate to previous page -->
          <li>
            <a class="pagination__link" href="javascript:void(0);" v-if="meta.current == 1">
                <Lucide icon="ChevronLeft" class="w-4 h-4" />
            </a>
            <a class="pagination__link" href="" 
                @click.prevent="previousPageClick()" v-if="meta.current > 1">
                <Lucide icon="ChevronLeft" class="w-4 h-4" />
            </a>
          </li>
        <!--navigate to previous page -->

          <li v-if="meta.current > 2">
            <a class="pagination__link" href="javascript:void(0);" >...</a>
          </li>

          <li v-for="page in pagination" :key="page">
            
            <a class="pagination__link pagination__link--active" 
                href="javascript:void(0);"                                
                v-if="meta.current == page">{{page}}</a>

            <a class="pagination__link" href=""
                @click.prevent="paginate(page)"
                v-if="meta.current != page">{{page}}</a>    

          </li>
          
          <li v-if="meta.current < pages - 2 ">
            <a class="pagination__link" href="javascript:void(0);" >...</a>
          </li>

          <!-- navigate to next page -->
          <li>
            <a class="pagination__link disabled" href="javascript:void(0);" 
                v-if="meta.current == pages">
                <Lucide icon="ChevronRight" class="w-4 h-4" />
            </a>
            <a class="pagination__link" href="#" @click.prevent="nextPageClick()"
                v-if="meta.current < pages">
                  <Lucide icon="ChevronRight" class="w-4 h-4" />
            </a>
          </li>
          <!-- navigate to next page -->
          <!-- navigate to last page -->
          <li>
            <a class="pagination__link disabled" href="javascript:void(0);"
                 v-if="meta.current == pages">
              <Lucide icon="ChevronsRight" class="w-4 h-4" />
            </a>

            <a class="pagination__link" href="" @click.prevent="lastPageClick()"
                v-if="meta.current < pages">
              <Lucide icon="ChevronsRight" class="w-4 h-4" />
            </a>
          </li>
          <!-- navigate to last page -->  
        </ul>
    </nav>
  </div>
</template>

<script>
import { defineComponent,ref,computed } from 'vue';

export default defineComponent({
  props : ['meta'],  
  setup(props) {
    
    const meta        = ref(props.meta)  
    const currentPage = ref(meta.value.current)
    const itemPerPage = ref(meta.value.size)
    const pages       = ref(meta.value.total_pages)
    const results     = ref(meta.value.total_results)
     
    const firstPageClick = () =>  meta.value.current = 1 

    const lastPageClick  = () =>  meta.value.current = pages.value 
    
    const nextPageClick  = () =>  meta.value.current = meta.value.current + 1 
    
    const previousPageClick = () =>  meta.value.current = meta.value.current - 1 
    
    const paginate = page =>  meta.value.current = page 

    const pagination = computed(() => {

      let page = []
      let startNum = 0
      let endNum   = 0
      let currentVal = meta.value.current
      let totalPages = meta.value.total_pages

      if(currentVal == 1 && totalPages > 4){
        startNum  = 1
        endNum    =  4
      }else if(currentVal == 1 && totalPages  < 4){
        startNum  = 1
        endNum    = totalPages

      } else if( currentVal > 1  && currentVal < totalPages - 1 && totalPages > 4 ){
        startNum  = ((currentVal - 1) >= 1) ? currentVal - 1 : 1
        endNum    = currentVal + 2;

      }else if( currentVal > 1  && currentVal == totalPages  && totalPages > 4 ){
        startNum  = totalPages - 3;
        endNum    = totalPages;
      
      }else{
        startNum  = ((currentVal - 2) >= 1)? currentVal - 2 : 1
        endNum    = ((currentVal + 1) <= totalPages) ? currentVal + 1 : totalPages            
      }

      for(var i = startNum; i <= endNum; i++){
        page.push(i)
      }

      return page
    })

    return {
      meta,
      currentPage,
      itemPerPage,
      pages,
      results,
      firstPageClick,
      lastPageClick,
      nextPageClick,
      previousPageClick,
      paginate,
      pagination,
    }
    
  }

})
</script>
