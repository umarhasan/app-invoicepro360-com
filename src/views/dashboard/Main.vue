<template>
  <div>
    <dashboard-skeleton v-if="!isSetup"></dashboard-skeleton>
  </div>

  <!-- <div class="heading">
    <h2 class="text-3xl font-semibold my-4">Dashboard</h2>
  </div> -->
 
  <div class="grid grid-cols-12 mt-2 mb-4">
    <div class="col-span-12">

      <div class="welcome-div p-6 py-14 rounded">
        <div class="flex gap-4 items-center">
          
          <div class="home-org-logo d-inline-flex bg-white p-4 shadow bg-gray-200 rounded border flex items-center justify-center">
            <Lucide icon="Home" class="w-8 h-8 text-primary dark:text-dark-3 icon icon-lg fill-primary align-center"></Lucide>
          </div>

          <div class="welcome-content">
            <h2 class="main-heading"> Hello ProPatel2,</h2>
            <p>Patel Corporation</p>
          </div>
          
        </div>
      </div>

    </div>
  </div>

  <div class="w-full block">
    <Line
        :chart-id="'dashboard-line-chart'"
        :chart-data="chartData"
        :chart-options="chartOptions"
        :width="600"
        :height="400"
      />
  </div>

  <div class="grid grid-cols-12 gap-6" v-if="isSetup">
    <div class="col-span-6 quick-view">
      <div class="box py-5">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-6 p-5 border-r-2 border-dashed border-gray-300">

            <Lucide icon="ShoppingBag" class="w-10 h-10 text-theme-1 block" />
            <div class="py-4"></div>

              <div class="total-heading main-heading flex font-semibold">
                <span>$</span>
                <span>54.154</span>
              </div>

              <div class="py-2"></div>

              <div class="block"><span class="text-red-600"><Lucide icon="ArrowDown" class="w-4 h-4" />2.34%</span><span> vs. last week</span></div>

              <div class="py-5"></div>

              <p>Sales earnings this month after associated author fees, & before taxes.</p>

              <div class="py-5"></div>

              <button href="#" class="border border-gray-300 rounded-full relative btn btn-lg btn-secondary pe-14 py-2">
                Download Reports
                <span class="w-10 h-10 rounded-full p-1 bg-theme-1 absolute right-1 flex justify-center items-center">
                  <Lucide icon="Download" class="w-5 h-5 text-white" />
                </span>
              </button>
          </div>

          <div class="col-span-6 p-5">

            <div class="total-transaction">
              <div class="small-heading mb-2 tracking-tight">
                TOTAL TRANSACTION
              </div>
              <div class="flex gap-3">
                <span class="font-semibold">4.501</span>
                <span class="text-danger text-sm">2% <Lucide icon="ArrowDown" class="w-4 h-4" /></span>
              </div>
            </div>

            <div class="py-4"></div>

            <div class="cancelled-transaction">
              <div class="small-heading mb-2 tracking-tight">
                CANCELLED RANSACTION
              </div>
              <div class="flex gap-3">
                <span class="font-semibold">25</span>
                <span class="text-danger text-sm">0.1% <Lucide icon="ArrowDown" class="w-4 h-4" /></span>
              </div>
            </div>

            <div class="py-4"></div>

            <div class="gross-rental">
              <div class="small-heading mb-2 tracking-tight">
                GROSS RENTAL VALUE
              </div>
              <div class="flex gap-3">
                <span class="font-semibold">$72.00 </span>
                <span class="text-success text-sm">49% <Lucide icon="ArrowUp" class="w-4 h-4" /></span>
              </div>
            </div>

            <div class="py-4"></div>

            <div class="gross-rental-profit">
              <div class="small-heading mb-2 tracking-tight">
                GROSS RENTAL PROFIT
              </div>
              <div class="flex gap-3">
                <span class="font-semibold">$54.00 </span>
                <span class="text-success text-sm">52% <Lucide icon="ArrowUp" class="w-4 h-4" /></span>
              </div>
            </div>

          </div>

        </div>
      </div><!-- box-->
    </div>

    <div class="col-span-6">
      <div class="grid grid-cols-12 items-center box py-5 bg-theme-1 text-white text-left">
        <div class="col-span-6 p-5">
          <div class="inner">
            <Lucide icon="Coins" class="w-12 h-12 block text-white" />
            <div class="py-4"></div>
            <h2 class="pb-4 font-semibold text-3xl tracking-wide leading-tight">Transact Safely with Invoice360</h2>
            <h3 class="text-xl pb-4">Choose your Payment Gateway</h3>
            <p class="pb-8 text-theme-5 text-opacity-3">Apply now, quick registration.</p>

            
            <button href="#" class="border border-gray-300 rounded-full relative btn btn-lg btn-secondary pe-14 py-2">
                Start Creating
                <span class="w-10 h-10 rounded-full p-1 bg-theme-1 absolute right-1 flex justify-center items-center">
                  <Lucide icon="Download" class="w-5 h-5 text-white" />
                </span>
              </button>

          </div>
        </div>

        <div class="col-span-6">
          <img src="/src/assets/images/woman-illustration.svg" class="w-full h-64" />
        </div>
      </div>
    </div>

  </div>

<div class="py-4"></div>

<div class="grid grid-cols-12 gap-6">

    <div class="col-span-8 widget">
      <div class="p-4 box w-full">
        <div class="widget-title mb-4 border-b border-dashed pb-2">
         <h2 class="sub-heading">Sales Report</h2>
        </div>
        <div class="flex flex-col md:flex-row md:items-center">
          <div class="flex">
            <div>
              <div class="text-lg text-primary dark:text-slate-300 xl:text-xl">  $15,000 </div>
              <div class="mt-0.5 text-slate-500">Total Revenue</div>
            </div>
            <div
              class="w-px h-12 mx-4 border border-r border-dashed border-slate-200 dark:border-darkmode-300 xl:mx-5"
            ></div>
            <div>
              <div class="text-lg text-primary dark:text-slate-300 xl:text-xl"> $10,000 </div>
              <div class="mt-0.5 text-slate-500">Due Revenue</div>
            </div>
          </div>
          <Menu class="mt-5 md:ml-auto md:mt-0">
            <Menu.Button
              :as="Button"
              variant="outline-secondary"
              class="font-normal"
            >
              Filter by Month
              <Lucide icon="ChevronDown" class="w-4 h-4 ml-2" />
            </Menu.Button>
            <Menu.Items class="w-40 h-32 overflow-y-auto">
              <Menu.Item>January</Menu.Item>
              <Menu.Item>Feburary</Menu.Item>
              <Menu.Item>March</Menu.Item>
              <Menu.Item>April</Menu.Item>
              <Menu.Item>May</Menu.Item>
              <Menu.Item>June</Menu.Item>
              <Menu.Item>July</Menu.Item>
              <Menu.Item>August</Menu.Item>
              <Menu.Item>September</Menu.Item>
              <Menu.Item>October</Menu.Item>
              <Menu.Item>November</Menu.Item>
              <Menu.Item>December</Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
        <div
          :class="[
            'relative',
            'before:content-[\'\'] before:block before:absolute before:w-16 before:left-0 before:top-0 before:bottom-0 before:ml-10 before:mb-7 before:bg-gradient-to-r before:from-white before:via-white/80 before:to-transparent before:dark:from-darkmode-600',
            'after:content-[\'\'] after:block after:absolute after:w-16 after:right-0 after:top-0 after:bottom-0 after:mb-7 after:bg-gradient-to-l after:from-white after:via-white/80 after:to-transparent after:dark:from-darkmode-600',
          ]"
        >
         <ReportLines /><!-- <ReportBarChart :height="275" class="mt-6 -mb-6" /> -->
        </div>
      </div>
    </div>

    <div class="col-span-4">
      <div class="widget box py-3 px-3">
        <div class="widget-title mb-1 border-b border-dashed pb-2 flex justify-between items-center">
          <h2 class="sub-heading">Recently Paid</h2>
          <button class="btn btn-secondary flex items-center gap-1"><Lucide icon="Eye" class="w-4 h-4"/><span>view all</span></button>
        </div><!-- title-->

        <div
          v-for="(faker, fakerKey) in _.take(fakerData, 5)"
          :key="fakerKey"
          class="intro-x"
        >
          <div class="flex px-2 py-4 border-b border-dashed">
            <div
              class="flex-none"
            >
            {{ fakerKey +1 }}.
            </div>
            <div class="ml-1 mr-auto">
              <div class="font-medium">{{ faker.users[0].name }}</div>
              <div class="text-slate-500 text-xs mt-0.5">
                {{ faker.dates[0] }}
              </div>
            </div>
            <div
              :class="{
                'text-success': faker.trueFalse[0],
                'text-danger': !faker.trueFalse[0],
              }"
            >
              {{ faker.trueFalse[0] ? "+" : "-" }}${{ faker.totals[0] }}
            </div>
          </div>
        </div>
      </div> 
    </div>
</div>

  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-4 mt-6 widget box py-3 px-3">
      <div class="widget-title mb-1 border-b border-dashed pb-2 flex justify-between items-center">
        <h2 class="sub-heading">Payment Accounts</h2>
        <button class="btn btn-secondary flex items-center gap-1"><Lucide icon="Eye" class="w-4 h-4"/><span>view all</span></button>
      </div>

    </div>
    <div class="col-span-8 mt-6 widget box py-3 px-3">
      <div class="widget-title mb-1 border-b border-dashed pb-2 flex justify-between items-center">
        <h2 class="sub-heading">Receiveables</h2>
      </div>
      <ReportBars />
    </div>
  </div>

  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-8 mt-6 widget box py-3 px-3">
      <div class="widget-title mb-1 border-b border-dashed pb-2 flex justify-between items-center">
        <h2 class="sub-heading">Recent Invoices</h2>
        <button class="btn btn-secondary flex items-center gap-1"><Lucide icon="Eye" class="w-4 h-4"/><span>view all</span></button>
      </div>
      <div class="overflow-auto lg:overflow-visible sm:mt-0">
        <Table class="border-spacing-y-[10px] border-separate dashboard-invoices">
          <Table.Thead class="bg-gray-200">
            <Table.Tr>
              <Table.Th class="border-b-0 whitespace-nowrap font-semibold">
                Status
              </Table.Th>
              <Table.Th class="border-b-0 whitespace-nowrap font-semibold">
                Invoice Detail
              </Table.Th>
              <Table.Th class="text-center border-b-0 whitespace-nowrap font-semibold">
                Amount
              </Table.Th>
              
              <Table.Th class="text-right border-b-0 whitespace-nowrap font-semibold">
                Actions
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr
              v-for="(faker, fakerKey) in _.take(fakerData, 4)"
              :key="fakerKey"
              class=""
            >
            <Table.Td>
                <div
                  :class="[
                    '',
                    { 'text-success': faker.trueFalse[0] },
                    { 'text-danger': !faker.trueFalse[0] },
                  ]"
                >
                  <Lucide icon="CheckSquare" class="w-4 h-4" />
                  {{ faker.trueFalse[0] ? "Active" : "Inactive" }}
                </div>
              </Table.Td>
              <Table.Td>
                <a href="" class="font-medium whitespace-nowrap">
                  {{ faker.products[0].name }}
                </a>
                <div
                  class="text-slate-500 text-xs whitespace-nowrap mt-0.5"
                >
                  {{ faker.products[0].category }}
                </div>
              </Table.Td>
              <Table.Td class="text-center">
                ${{ faker.stocks[0] }}
              </Table.Td>
              
              <Table.Td class="text-right">
                <div class="flex justify-end">
                  <a class="flex items-center mr-3" href="">
                    <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" />
                    Edit
                  </a>
                  <a class="flex items-center text-danger" href="">
                    <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                    Delete
                  </a>
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
      <!-- <div
        class="flex flex-wrap items-center mt-3 intro-y sm:flex-row sm:flex-nowrap"
      >
        <Pagination class="w-full sm:w-auto sm:mr-auto">
          <Pagination.Link>
            <Lucide icon="ChevronsLeft" class="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link>
            <Lucide icon="ChevronLeft" class="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link>...</Pagination.Link>
          <Pagination.Link>1</Pagination.Link>
          <Pagination.Link active>2</Pagination.Link>
          <Pagination.Link>3</Pagination.Link>
          <Pagination.Link>...</Pagination.Link>
          <Pagination.Link>
            <Lucide icon="ChevronRight" class="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link>
            <Lucide icon="ChevronsRight" class="w-4 h-4" />
          </Pagination.Link>
        </Pagination>
        <FormSelect class="w-20 mt-3 !box sm:mt-0">
          <option>10</option>
          <option>25</option>
          <option>35</option>
          <option>50</option>
        </FormSelect>
      </div> -->
    </div>

    <div class="col-span-4 mt-6 widget box py-3 px-3">
      <div class="">
        <div class="widget-title mb-1 border-b border-dashed pb-2 flex justify-between items-center">
        <h2 class="sub-heading">Invoice Results</h2>
        <button class="btn btn-secondary flex items-center gap-1"><Lucide icon="Eye" class="w-4 h-4"/><span>view all</span></button>
      </div>
        <ReportPieChart :height="350" />
      </div>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-6" v-if="isSetup">
    <div class="col-span-12 2xl:col-span-9">

      <div class="grid grid-cols-12 gap-6">
        <!-- BEGIN: General Report -->
        <div class="col-span-12 mt-8">
          <!-- <div class="flex items-center h-10 intro-y">
            <h2 class="mr-5 text-lg font-medium truncate">General Report</h2>
            <a href="" class="flex items-center ml-auto text-primary">
              <Lucide icon="RefreshCcw" class="w-4 h-4 mr-3" /> Reload Data
            </a>
          </div> -->

          <div class="grid grid-cols-12 gap-6 mt-5">

            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-900 h-full">
                <div class="p-5 sm:p-6">
                    <h6 class="font-heading text-base -tracking-snug leading-tighter text-slate-700 dark:text-white">Total Invoices</h6>
                    <div class="text-2xl font-medium text-slate-700 dark:text-white my-3">1,945</div>
                    <div class="text-sm"><span class="text-green-600"><Lucide icon="ArrowUp" class="w-4 h-4" /> 4.63%</span><span> vs. last week</span></div>
                </div>
              </div>
            </div><!-- box ends-->

            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-900 h-full">
                <div class="p-5 sm:p-6">
                    <h6 class="font-heading text-base -tracking-snug leading-tighter text-slate-700 dark:text-white">Due Invoices</h6>
                    <div class="text-2xl font-medium text-slate-700 dark:text-white my-3">$2,338</div>
                    <div class="text-sm"><span class="text-red-600"><Lucide icon="ArrowDown" class="w-4 h-4" />2.34%</span><span> vs. last week</span></div>
                </div>
              </div>
            </div><!-- box ends-->

            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-900 h-full">
                <div class="p-5 sm:p-6">
                    <h6 class="font-heading text-base -tracking-snug leading-tighter text-slate-700 dark:text-white">Paid Invoices</h6>
                    <div class="text-2xl font-medium text-slate-700 dark:text-white my-3">$69,700</div>
                    <div class="text-sm"><span class="text-green-600"><Lucide icon="ArrowUp" class="w-4 h-4" />4.63%</span><span> vs. last week</span></div>
                </div>
              </div>
            </div><!-- box ends-->

            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-900 h-full">
                <div class="p-5 sm:p-6">
                    <h6 class="font-heading text-base -tracking-snug leading-tighter text-slate-700 dark:text-white">Today's Invoices</h6>
                    <div class="text-2xl font-medium text-slate-700 dark:text-white my-3">$2,338</div>
                    <div class="text-sm"><span class="text-red-600"><Lucide icon="ArrowDown" class="w-4 h-4" />2.34%</span><span> vs. last week</span></div>
                </div>
              </div>
            </div><!-- box ends-->

            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-900 h-full">
                <div class="p-5 sm:p-6">
                    <h6 class="font-heading text-base -tracking-snug leading-tighter text-slate-700 dark:text-white">Total Revenue</h6>
                    <div class="text-2xl font-medium text-slate-700 dark:text-white my-3">$2,338</div>
                    <div class="text-sm"><span class="text-red-600"><Lucide icon="ArrowDown" class="w-4 h-4" />2.34%</span><span> vs. last week</span></div>
                </div>
              </div>
            </div><!-- box ends-->

            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-900 h-full">
                <div class="p-5 sm:p-6">
                    <h6 class="font-heading text-base -tracking-snug leading-tighter text-slate-700 dark:text-white">Today's Revenue</h6>
                    <div class="text-2xl font-medium text-slate-700 dark:text-white my-3">$2,338</div>
                    <div class="text-sm"><span class="text-green-600"><Lucide icon="ArrowUp" class="w-4 h-4" />4.63%</span><span> vs. last week</span></div>
                </div>
              </div>
            </div><!-- box ends-->

            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-900 h-full">
                <div class="p-5 sm:p-6">
                    <h6 class="font-heading text-base -tracking-snug leading-tighter text-slate-700 dark:text-white">Pending Revenue</h6>
                    <div class="text-2xl font-medium text-slate-700 dark:text-white my-3">$2,338</div>
                    <div class="text-sm"><span class="text-red-600"><Lucide icon="ArrowDown" class="w-4 h-4" />2.34%</span><span> vs. last week</span></div>
                </div>
              </div>
            </div><!-- box ends-->

            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-900 h-full">
                <div class="p-5 sm:p-6">
                    <h6 class="font-heading text-base -tracking-snug leading-tighter text-slate-700 dark:text-white">Expenses</h6>
                    <div class="text-2xl font-medium text-slate-700 dark:text-white my-3">$2,338</div>
                    <div class="text-sm"><span class="text-red-600"><Lucide icon="ArrowDown" class="w-4 h-4" />2.34%</span><span> vs. last week</span></div>
                </div>
              </div>
            </div><!-- box ends-->

          </div>


        </div>
        <!-- END: General Report -->
       
      </div>
    </div>
           
      <div class="grid grid-cols-12 col-span-12 gap-6 mt-8 its temp">
        <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
          <div class="p-5 box zoom-in">
            <div class="flex items-center">
              <div class="flex-none w-2/4">
                <div class="text-lg font-medium truncate">Target Sales</div>
                <div class="mt-1 text-slate-500">300 Sales</div>
              </div>
              <div class="relative flex-none ml-auto">
                <ReportDonutChart1 :width="90" :height="90" />
                <div
                  class="absolute top-0 left-0 flex items-center justify-center w-full h-full font-medium"
                >
                  20%
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
          <div class="p-5 box zoom-in">
            <div class="flex items-center">
              <div class="flex-none w-2/4">
                <div class="text-lg font-medium truncate">New Products</div>
                <div class="mt-1 text-slate-500">1450 Products</div>
              </div>
              <div class="relative flex-none ml-auto">
                <ReportDonutChart1 :width="90" :height="90" />
                <div
                  class="absolute top-0 left-0 flex items-center justify-center w-full h-full font-medium"
                >
                  45%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import _ from "lodash";
import { ref, onMounted } from "vue";
import { useUtils } from "@/compositions/utils";
import ReportDonutChart from "@/components/ReportDonutChart/ReportDonutChart.vue";
import ReportPieChart from "@/components/ReportPieChart/ReportPieChart.vue";
import ReportDonutChart1 from "@/components/ReportDonutChart1/ReportDonutChart1.vue";
import ReportBars from "@/components/ReportBars/ReportBars.vue";
import ReportLines from "@/components/ReportLines/ReportLines.vue";


import fakerData from "@/utils/faker";
import Button from "@/components/Button";
// import { FormInput, FormSelect } from "@/components/Form";
import { Menu } from "@/components/Headless";
import Table from "@/components/Table";
import DashboardSkeleton from "./DashboardSkeleton.vue";
import Lucide from "@/global-components/Lucide/Lucide.vue";


  const props = defineProps(["showPermissionAlert", "alertMessage"]);
  const salesReportFilter = ref(" ");
  const { initialize, isSetup } = useUtils();
  const PermissionAlert = ref(props.showPermissionAlert);
  const AlertMessage = ref(props.alertMessage);

  onMounted(() => {
      // cash("body").removeClass("bg-white").removeClass("error-page").addClass("bg-main");
    if (!isSetup.value) initialize();
    

    // console.log("Dashboard business count " + businesses.value.length)
    // if(businesses.value.length === 0) router.push({name : 'onboarding'})
  });

</script>

<style scoped>
.dashboard-invoices td{
padding:0.5rem
}
.dashboard-invoices th{
padding:1rem 0.5rem
}

.welcome-div{
  @apply bg-white dark:bg-dark-1;
  background-image: url('/src/assets/images/dashboard.svg');
  background-size:35%;
}
.dark .welcome-div{
  background-image:none;
}

</style>
