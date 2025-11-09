<template>
    <div class="container sm:px-10">
        <!-- BEGIN: Login Form -->
        <div class="h-screen flex">
            <div class="m-auto box p-8 w-full sm:w-3/4 lg:w-2/5 ">

                <a href="" class="pb-5 flex justify-center">
                    <img
                        alt="Invoice Pro 360"
                        class="w-6"
                        src="@/assets/images/logo.svg"
                    />
                    <span class="text-theme-1 text-3xl ml-3">
                        Invoice Pro <span class="font-medium">360</span>
                    </span>
                </a>

                <h2 class="text-2xl text-center text-theme-1">
                    Forgot your password?
                </h2>
                <div class="mt-2 text-gray-500 text-center" v-if="!isEmailValid">
                    We'll send you an email with instructions to reset it.
                </div>

                <div class="my-10 text-center alert alert-success show" v-if="isEmailValid">
                    Reset Password Instruction has been sent to: 
                    <span class="font-bold">{{ formData.username }}</span>
                </div>

                <form @submit.prevent="submit" v-if="!isEmailValid">

                    <div class="mt-5">
                        <input
                            v-model="formData.username"
                            type="text"
                            class="login__input form-control py-3 px-4 border-gray-300 block"
                            placeholder="Email"
                            :class="{
                                'border-theme-6': validate.username.$error,
                            }" />
                        <div
                            v-if="validate.username.required.$invalid && validate.username.$dirty"
                            class="text-theme-6 mt-2">
                            {{validate.username.required.$message}}
                        </div>
                        <div
                            v-if="validate.username.email.$invalid && validate.username.$dirty"
                            class="text-theme-6 mt-2">                            
                            {{validate.username.email.$message}}
                        </div>
                    </div>

                    <div class="mt-4 text-center">
                        <button class="btn btn-primary-auth" 
                        :class="{'disable' : showLoadingIcon}"
                        :disabled='showLoadingIcon'>
                            <span v-if="!showLoadingIcon">Forgot Password</span>
                            
                            <LoadingIcon icon="oval" color="white" class="w-7 h-7" 
                            v-if="showLoadingIcon" />
                        </button>
                    </div>

                    <div class="mt-3 text-gray-700 text-center">
                        Already have an account?
                        <router-link
                            class="text-theme-1"
                            :to="{ name: 'login' }"
                            tag="button">
                            Sign in
                        </router-link>
                    </div>

                    <div v-if="isInvalidUser" class="alert alert-danger-soft show flex items-center mt-3 capitalize">
                        {{invalidUserMessage}}
                    </div>
                </form>
            </div>
        </div>
        <!-- END: Login Form -->
    </div>
</template>

<script setup>
import { onMounted, watch } from "vue"
import { ForgotPassword } from "@/compositions/auth"
    onMounted(() => {
        document.body.classList.remove("main",'error-page')
        document.body.classList.add('login')
    })

    const {
        formData,
        submit,
        validate,
        isInvalidUser,
        invalidUserMessage,
        isEmailValid,
        showLoadingIcon
    } = ForgotPassword()

    watch([isInvalidUser], () => {
        setTimeout(() => {
            isInvalidUser.value = false
        }, 4000)
    })

</script>
