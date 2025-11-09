<template>
    <Line
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
      :height="300"
    />
  </template>
  
  <script>
  import { Line } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,      // ✅ Use LineElement for line charts
    PointElement,     // ✅ Required for line charts
    CategoryScale,
    LinearScale
  } from 'chart.js'
  
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
  )
  
  export default {
    name: 'LineChart',
    components: { Line },
    data() {

      return {
        chartData: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'],
          datasets: [
            {
              label: 'Monthly Data',
              data: [40, 20, 12, 10, 20, 15, 25, 30, 40, 60],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              fill: false,
              tension: 0.4
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
              display: false,
              text: 'Line Chart Example'
            }
          }
        }
      }
    }
  }
  </script>
  