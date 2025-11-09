<template>
<div class="col-span-12 lg:col-span-3 xxl:col-span-3 flex lg:block flex-col-reverse border-r border-gray-200 h-screen">
    <div class="py-14">
        <h2 class="text-2xl font-bold truncate content-heading">Profile</h2>
        <router-link
            :to="{ name: 'user-profile' }"
            class="yr-form-tabs my-5"
            :class="{
                'active' : activeTab == 'profile'
            }"
        >Personal Information</router-link>

        <router-link
            :to="{ name: 'user-password' }"
            class="yr-form-tabs my-5"
            :class="{
                'active' : activeTab == 'password'
            }"
        >Password</router-link>

        <router-link
            :to="{ name: 'businesses' }"
            class="yr-form-tabs my-5"
            :class="{
                'active' : activeTab == 'businesses'
            }"
        >Businesses</router-link>
        
    </div>
</div>
</template>

<script>

export default {
    name: "ProfileMenu",
    props : ['currentTab'],
    setup(props) {
        const activeTab = props.currentTab
        return {
            activeTab,
        }
    },
}
</script>

<style></style>
