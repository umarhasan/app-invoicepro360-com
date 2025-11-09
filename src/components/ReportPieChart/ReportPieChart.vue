<script setup lang="ts">
import { computed } from "vue";
import { type ChartData, type ChartOptions } from "chart.js/auto";
import { useColorSchemeStore } from "@/stores/color-scheme";
import { useDarkModeStore } from "@/stores/dark-mode";
import { getColor } from "@/utils/colors";

const props = defineProps<{
  width?: number;
  height?: number;
}>();

const colorScheme = computed(() => useColorSchemeStore().colorScheme);
const darkMode = computed(() => useDarkModeStore().darkMode);

const chartData = [50, 10, 40];
const chartColors = () => [
  "#ffd72e",
  "#86a1cb",
  "#97d95c",
];
const data = computed<ChartData>(() => {
  return {
    labels: ["Sales", "Collections","Dues"],
    datasets: [
      {
        data: chartData,
        backgroundColor: colorScheme.value ? chartColors() : "",
        hoverBackgroundColor: colorScheme.value ? chartColors() : "",
        borderWidth: 5,
        borderColor: darkMode.value
          ? getColor("darkmode.700")
          : getColor("white"),
      },
    ],
  };
});

const options = computed<ChartOptions>(() => {
  return {
    maintainAspectRatio: false,
    plugins: {
      legend: {
      display: true,
      position: 'bottom', // 'top', 'left', 'bottom', 'right'
      labels: {
        color: '#333', // legend label color
        font: {
          size: 16,
        },
        padding: 20,
      },
    },
    },
    tooltip: {
      enabled: false,
      title: {
        size: 20, // Title font size
      },
      bodyFont: {
        size: 25, // Body (main text) font size
      },
      footerFont: {
        size: 30, // Footer font size (if used)
      },
    },
  };
});
</script>

<template>
  <Chart
    type="pie"
    :width="props.width"
    :height="props.height"
    :data="data"
    :options="options"
  />
</template>
