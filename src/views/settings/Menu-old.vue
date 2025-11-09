<template>
<div class="col-span-12 lg:col-span-3 xxl:col-span-3 flex lg:block h-full-screen px-5 border-r bg-white">
    <div class="py-14 setting-menu">

        <h3 class="text-2xl font-bold">Account</h3>
        <div class="pb-5">
            <router-link :to="{ name: 'user-profile' }" :class="{'active' : activeTab == 'profile'}">
                Personal Information
            </router-link>

            <router-link :to="{ name: 'user-password' }" :class="{'active' : activeTab == 'password'}">
                Password
            </router-link>

            <router-link :to="{ name: 'businesses' }" :class="{'active' : activeTab == 'businesses'}">
                Businesses
            </router-link>
        </div>

        <h3>Sales</h3>
        <div class="pb-5">
            <router-link :to="{ name: 'invoice-customization' }"
                :class="{ 'active' : activeTab == 'invoice-customization'}">
                Invoice Customization
            </router-link>
            
            <router-link :to="{ name: 'invoice-columns' }" :class="{ 'active' : activeTab == 'invoice-columns'}">
                Invoice Columns
            </router-link>

            <router-link :to="{ name: 'invoice-reminders' }" :class="{ 'active' : activeTab == 'invoice-reminders'}">
                Reminder Settings
            </router-link>
            <router-link :to="{ name: 'invoice-reminders' }" :class="{ 'active' : activeTab == 'invoice-reminders'}">
                Date & Currency
            </router-link>

            <router-link :to="{ name: 'sales-tax' }"
                :class="{'active' : activeTab == 'sales-tax'}">
                Sales Tax
            </router-link>            
        </div>

        <h3>User Management</h3>

        <div class="pb-5">
            <router-link :to="{ name: 'user-management' }"
                :class="{'active' : activeTab == 'user-management'}">
                Users
            </router-link>
        </div>


        
    </div>
</div>
</template>

<script>
import { useUtils } from '@/compositions/utils'

export default {
    name: "Menu",
    props : ['currentTab'],
    setup(props) {
        const activeTab = props.currentTab
        const {permissionList} = useUtils()

        return {
            activeTab,
            permissionList
        }
    },
}
</script>