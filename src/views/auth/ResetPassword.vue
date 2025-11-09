<template>
    
    <div class="container sm:px-10">
        <div class="h-screen flex">
            <div class="m-auto p-8 box w-full sm:w-3/4 lg:w-2/5">
                <a href="" class="-intro-x pb-5 flex justify-center">
                    <img
                        alt="Invoice Pro 360"
                        class="w-6"
                        src="@/assets/images/logo.svg"
                    />
                    <span class="text-theme-1 text-3xl ml-3">
                        Invoice Pro <span class="font-medium">360</span>
                    </span>
                </a>

                <h2 class="intro-x text-2xl text-center text-theme-1">
                    Password Reset
                </h2>
                <form @submit.prevent="submit">

                    <div class="mt-5">
                        <input
                            v-model="formData.username"
                            type="text"
                            class="form-control py-3 px-4 border-gray-300 block"
                            disabled />
                    </div>

                    <div class="mt-5">
                        <div class="relative">
                            <input
                                v-model="formData.password"
                                :type="passwordType"
                                class="form-control py-3 px-4 border-gray-300 block"
                                placeholder="New Password" />
                            <Lucide icon="EyeOff" 
                                class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 text-gray-700 cursor-pointer" 
                                v-if="passwordType === 'password'"
                                @click="switchVisibility()" />

                            <Lucide icon="Eye" 
                                class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 text-gray-700 cursor-pointer" 
                                v-if="passwordType === 'text'"
                                @click="switchVisibility()" />                                
                        </div>
 
                    </div>

                    <div class="mt-4 text-center">
                        <button class="btn btn-primary-auth" 
                        :class="{'disable' : showLoadingIcon}"
                        :disabled='showLoadingIcon'>
                            <span v-if="!showLoadingIcon">Reset Password</span>
                            <LoadingIcon icon="oval" color="white" class="w-7 h-7" v-if="showLoadingIcon" />                            
                        </button>
                    </div>

                    <div v-if="isInvalidToken" class="alert alert-danger-soft show flex items-center mt-3 capitalize">
                        {{invalidTokenMessage}}
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted} from "vue"
import { ResetPassword } from "@/compositions/auth"
import cash from "cash-dom"

export default defineComponent({
    components: {},
    setup() {

        const { 
            formData,
            isInvalidToken,
            invalidTokenMessage,
            passwordType,
            showLoadingIcon,
            submit,
            switchVisibility,
            validate
        } = ResetPassword()

        onMounted(() => {
            cash("body")
                .removeClass("main")
                .removeClass("error-page")
                .addClass("login")
        })

        return {
            formData,
            isInvalidToken,
            invalidTokenMessage,
            passwordType,
            showLoadingIcon,
            submit,
            switchVisibility,            
            validate,
        }
    },
})
</script>
