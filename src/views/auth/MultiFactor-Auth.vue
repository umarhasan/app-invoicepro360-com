<template>

<div class="grid grid-cols-12 gap-4 box">
    <div class="col-span-3">
        <AuthNav />
    </div>

    <div class="col-span-9">

    </div>
</div>
<div class="container sm:px-10">
        <!-- BEGIN: Login Form -->
        <div class="h-screen flex">
            <div class="m-auto box p-8 w-full sm:w-3/4 lg:w-2/5 ">

                <a href="" class="pb-5 flex justify-center">
                    <img
                        alt="Invoice Pro 360"
                        class="w-6"
                        :src="`@/assets/images/logo.svg`"
                    />
                    <span class="text-theme-1 text-3xl ml-3">
                        Invoice Pro <span class="font-medium">360</span>
                    </span>
                </a>

                <h2 class="text-2xl text-center text-theme-1">
                    Multi-Factor Authentication
                </h2>

                <div class="mt-2 text-gray-500 text-center">
                    Please complete multi-factor authentication on your mobile device.
                </div>

                <div class="mt-2 text-gray-500 text-center">
                    No notification? Enter a one-time passcode from your authenticator app.
                </div>

                <form @submit.prevent="submit">

                    <div class="mt-5">
                        <input
                            v-model="formData.passcode"
                            type="text"
                            class="login__input form-control py-3 px-4 border-gray-300 block"
                            placeholder="passcode"
                            :class="{
                                'border-theme-6': validate.passcode.$error,
                            }" />
                        <div
                            v-if="validate.passcode.required.$invalid && validate.passcode.$dirty"
                            class="text-theme-6 mt-2">
                            {{validate.passcode.required.$message}}
                        </div>
                    </div>

                    <div class="mt-4 text-center">
                        <button class="btn btn-primary-auth" 
                        :class="{'disable' : showLoadingIcon || !isOptionsLoaded}"
                        :disabled='showLoadingIcon || !isOptionsLoaded'>
                            <span v-if="!showLoadingIcon">Authenticate</span>
                            
                            <LoadingIcon icon="oval" color="white" class="w-7 h-7" 
                            v-if="showLoadingIcon" />
                        </button>
                    </div>

                    <div class="additional-options rounded border mt-2 shadow bg-gray-200 w-full h-10 py-1" v-if="!isOptionsLoaded">
                        <LoadingIcon icon="oval" color="white" class="w-7 h-7" />
                    </div>
                    <div class="additional-options rounded border mt-2 shadow bg-gray-200" v-if="isOptionsLoaded">

                        <div class="text-center font-medium text-base inline-block w-full py-2 cursor-pointer"
                        @click="toggleAdditionalOption = !toggleAdditionalOption" >            
                            Additional Multi-factor Options
                                <span class="w-5 h-5 font-medium font-bold">
                                    <Lucide icon="ChevronDown" class="w-5 h-5" v-show="!toggleAdditionalOption"/>
                                    <Lucide icon="ChevronUp" class="w-5 h-5" v-show="toggleAdditionalOption"/>
                                </span>
                        </div>

                        <ul class="additional-option-list" v-show="toggleAdditionalOption">
                            <li v-for="(option,index) in additionalOptions" :key="index">
                                <a href="javascript:void(0);" @click="setAsDefault(option.type)" 
                                    class="font-medium block p-2 transition duration-300 ease-in-out border-b border-t">
                                    <img :src="'@/assets/images/'+option.image" class="w-24" v-if="option.image"/>
                                    <span v-if="!option.image">{{option.name}}</span>
                                </a>  
                            </li>
                        </ul>                    
                    </div>
                    
                    <div v-if="isOptionsLoaded">
                        <div class="default-option mt-3" v-for="(option,index) in defaultOption" :key="index">
                            <span class="border rounded bg-gray-100 font-medium block p-2 transition duration-300 ease-in-out"
                                    v-if="!option.image">{{option.name}}
                            </span>
                            <span v-if="option.image">
                                <img :src="'@/assets/images/'+option.image" class="w-24"/>
                            </span>                              
                        </div>
                    </div>


                    <div v-if="isInvalidCode" class="alert alert-danger-soft show flex items-center mt-3 capitalize">
                        {{invalidCodeMessage}}
                    </div>
                </form>
            </div>

        </div>
        <!-- END: Login Form -->
    </div>
</template>

<script setup>
import { onMounted, watch, ref, computed } from "vue"
import { MultiFactorAuthentication } from "@/compositions/auth"
import AuthNav from "./AuthNav.vue"

    onMounted(() => {
        document.body.classList.remove("main",'error-page')
        document.body.classList.add('login')
    })

    const {
        formData,
        submit,
        validate,
        isInvalidCode,
        invalidCodeMessage,            
        showLoadingIcon,
        isOptionsLoaded,
        options,
        setAsDefault,
    } = MultiFactorAuthentication()

    const toggleAdditionalOption = ref(false)
    const additionalOptions = computed(() => {
        return options.value.filter( option => option.default_mfa == 0)
    });

    const defaultOption = computed(() => {
        return options.value.filter( option => option.default_mfa == 1)
    });        

    watch([isOptionsLoaded.value], additionalOptions)
    watch([isOptionsLoaded.value], defaultOption)
    watch([isInvalidCode], () => {
        setTimeout(() => {
            isInvalidCode.value = false
        }, 4000)
    })

</script>
