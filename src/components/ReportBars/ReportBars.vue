<template>
    <div class="chart-container">
      <Bar
        id="payments-bar-chart"
        :options="chartOptions"
        :data="chartData"
        :height="400"
      />
    </div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  } from 'chart.js'
  
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  )
  
  export default {
    name: 'ReportBars',
    components: { Bar },
    data() {
    return {
      chartData: {
        labels: [
          'Apple Pay',
          'Google Pay',
          'PayPal',
          'Stripe',
          'Square',
          'Cash App',
          'Venmo',
          'Samsung Pay'
        ],
        datasets: [
          {
            label: 'Monthly Transactions ($)',
            data: [3200, 2900, 4500, 4000, 3100, 2700, 3500, 2300],
            backgroundColor: 'rgb(28, 63, 170)' // Tailwind blue-500
          }
        ]
      },
      chartOptions: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    },
    title: {
      display: true,
      text: 'Transactions by Payment Method'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let value = context.raw || 0
          return `$${value.toLocaleString()}`
        }
      }
    }
  },
  scales: {
    x: {
      // 👇 Shrinks the bar width
      barPercentage: 0.5,         // Lower = narrower bars
      categoryPercentage: 0.6,    // Lower = more spacing between categories
      ticks: {
        autoSkip: false           // Ensures all labels show
      }
    },
    y: {
      ticks: {
        callback: function(value) {
          return `$${value.toLocaleString()}`
        }
      }
    }
  }
}
      }
    }
  }
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
  }
  </style>
  