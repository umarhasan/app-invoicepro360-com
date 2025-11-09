<template>

<div class="flex flex-col gap-2 lg:flex-row mb-5">
    <div class="box flex-1 p-5">
    <div class="text-2xl font-medium text-center">Amount Due</div>
    <div class="flex justify-center">
        <div class="relative text-4xl font-semibold mt-2 mx-auto">
           <span class="absolute text-2xl top-0 left-0 text-gray-600 -ml-4">{{ $h.CurrencySymbol() }}</span>
           <span v-html="$h.formatCurrency(overdueAmount,false)"></span>
        </div>
    </div>
    </div>
    <div
    class="box flex-1 p-5"
    >
    <div class="text-2xl font-medium text-center">Outstanding</div>
    <div class="flex justify-center">
        <div class="relative text-4xl font-semibold mt-2 mx-auto">
          <span class="absolute text-2xl top-0 left-0 text-gray-600 -ml-4">{{ $h.CurrencySymbol() }}</span>
          <span v-html="$h.formatCurrency(outstandingAmount,false)"></span>

        </div>
    </div>
    </div>
    <div class="box flex-1 p-5">
    <div class="text-2xl font-medium text-center">In Draft</div>
    <div class="flex justify-center">
        <div class="relative text-4xl font-semibold mt-2 mx-auto">
          <span class="absolute text-2xl top-0 left-0 text-gray-600 -ml-4">{{ $h.CurrencySymbol() }}</span>
          <span v-html="$h.formatCurrency(indraftAmount,false)"></span>
        </div>
    </div>
    </div>
</div>
<!-- -->
</template>

<script>
export default {
  props : ["isCalculated","outstandingAmount","overdueAmount","indraftAmount"],  
  setup(props) {

    return {
      isCalculated : props.isCalculated,  
      outstandingAmount : props.outstandingAmount,
      overdueAmount : props.overdueAmount,
      indraftAmount : props.indraftAmount,
    };
  }
};
</script>
