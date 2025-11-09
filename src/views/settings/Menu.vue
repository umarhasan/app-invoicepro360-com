<template>
  <div class="col-span-12 lg:col-span-3 2xl:col-span-3 flex lg:block flex-col-reverse">
    <div class="box">
      <div class="relative flex items-center px-5 py-3 font-medium text-lg">Settings</div>
      <div class="p-5 border-t border-slate-200/60">
        <router-link
          class="flex items-center gap-1"
          :to="{ name: 'user-profile' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'profile' }"
        >
        <Lucide icon="User" class="w-4 h-4" />
        Personal Information
        </router-link>

        <router-link
          class="flex items-center gap-1 mt-5"
          :to="{ name: 'user-password' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'password' }"
        >
        <Lucide icon="RefreshCw" class="w-4 h-4" /> Change Password
        </router-link>

        <router-link
          class="flex items-center gap-1 mt-5"
          :to="{ name: 'multifactor-auth' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'multifactor-auth' }"
        >
        <Lucide icon="KeySquare" class="w-4 h-4" /> Multi-factor Auth
        </router-link>
      </div>
      <div class="p-5 border-t border-slate-200/60">
        <router-link
          class="flex items-center gap-1"
          :to="{ name: 'invoice-customization' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'invoice-customization' }"
        >
        <Lucide icon="ScrollText" class="w-4 h-4" /> Invoice Customization
        </router-link>

        <router-link
          class="flex items-center gap-1 mt-5"
          :to="{ name: 'invoice-columns' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'invoice-columns' }"
        >
        <Lucide icon="Library" class="w-4 h-4" /> Invoice Columns
        </router-link>

        <router-link
          class="flex items-center gap-1 mt-5"
          :to="{ name: 'invoice-reminders' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'invoice-reminders' }"
        >
        <Lucide icon="Voicemail" class="w-4 h-4" /> Invoice Reminder
        </router-link>

        <router-link
          class="flex items-center gap-1 mt-5"
          :to="{ name: 'date-currency' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'date-currency' }"
        >
        <Lucide icon="Banknote" class="w-4 h-4" />  Date & Currency
        </router-link>

        <router-link
          class="flex items-center gap-1 mt-5"
          :to="{ name: 'sales-tax' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'sales-tax' }"
        >
        <Lucide icon="Landmark" class="w-4 h-4" /> Sales Tax
        </router-link>
      </div>

      <div class="p-5 border-t border-slate-200/60">
        <router-link
          class="flex items-center gap-1"
          :to="{ name: 'user-management' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'user-management' }"
        >
        <Lucide icon="UserRoundCog" class="w-4 h-4" /> User management
        </router-link>

        <router-link
          class="flex items-center gap-1 mt-5"
          :to="{ name: 'businesses' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'businesses' }"
        >
        <Lucide icon="Briefcase" class="w-4 h-4" />  Businesses
        </router-link>

        <router-link
          class="flex items-center gap-1 mt-5"
          :to="{ name: 'credit-card' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'credit-card' }"
        >
        <Lucide icon="Wallet" class="w-4 h-4" /> Payment Gateway
        </router-link>

        <router-link
          class="flex items-center gap-1 mt-5"
          :to="{ name: 'payment-types' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'payment-types' }"
        >
        <Lucide icon="TrelloIcon" class="w-4 h-4" /> Payment Types
        </router-link>
        <router-link
          class="flex items-center gap-1 mt-5"
          :to="{ name: 'pos-setting' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'pos-setting' }"
        >
        <Lucide icon="Diamond" class="w-4 h-4" /> POS Setting
        </router-link>

        <router-link
          class="flex items-center gap-1 mt-5"
          :to="{ name: 'intuit-integration' }"
          :class="{ 'text-theme-1 font-medium': activeTab == 'intuit-integration' }"
        >
        <Lucide icon="BoomBox" class="w-4 h-4" />  Quickbook Integrations
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Lucide from '@/global-components/Lucide/Lucide.vue';

export default {
  name: "Menu",
  props: ["currentTab"],
  setup(props) {
    const activeTab = props.currentTab;
    return {
      activeTab,
    };
  },
};
</script>
