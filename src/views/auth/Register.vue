<template>
    <div class="container sm:px-10 switchable-container">
        <div class="fixed top-2 right-2 drop-shadow-sm w-10 h-10 shadow text-center transition flex items-center justify-center bg-white hover:bg-black hover:text-white" @click="toggleDarkMode()" ><Lucide icon="SunMoon" ></Lucide></div>
        <div class="h-screen flex">
            <!-- BEGIN: Register Form -->
            <div class="m-auto box p-8 w-full sm:w-3/4 lg:w-2/5">
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
                <h2 class="text-theme-1 text-2xl text-center">
                    Sign Up
                </h2>
                <div class="mt-2 text-gray-500  text-center">
                    A few more clicks to sign in to your account.
                </div>

                <form @submit.prevent="submit">

                    <div class="sm:grid grid-cols-2 gap-4 mt-5">
                        <div>
                            <input
                                v-model="formData.first_name"
                                type="text"
                                class="form-control py-3 px-4 border-gray-300"
                                placeholder="First Name"
                                :class="{
                                    'border-theme-6': validate.first_name.$error,
                                }" />

                            <div v-if="validate.first_name.required.$invalid && validate.first_name.$dirty"
                                class="text-theme-6 mt-2">
                                {{validate.first_name.required.$message}}
                            </div>

                        </div>

                        <div>
                            <input v-model="formData.last_name" type="text"
                                class="form-control py-3 px-4 border-gray-300"
                                placeholder="Last Name"
                                :class="{'border-theme-6': validate.last_name.$error }" />
                            <div v-if="validate.last_name.required.$invalid && validate.last_name.$dirty"
                                class="text-theme-6 mt-2">
                                {{validate.last_name.required.$message}}                                
                            </div>
                        </div>
                    </div>
                    <div class="mt-5">
                        <input
                            v-model="formData.username"
                            type="text"
                            class="form-control py-3 px-4 border-gray-300 block"
                            placeholder="Username"
                            :class="{ 'border-theme-6': validate.username.$error }" 
                            @blur="checkUsername" />

                        <div v-if="validate.username.required.$invalid && validate.username.$dirty"
                            class="text-theme-6 mt-2">                            
                            {{validate.username.required.$message}}
                        </div>

                        <div v-if="!isUsernameAvailable" class="text-theme-6 mt-2">
                            {{ usernameAvailableMessage }}
                        </div>

                        <input
                            v-model="formData.email_address"
                            type="text"
                            class="form-control py-3 px-4 border-gray-300 block mt-4"
                            placeholder="Email"
                            :class="{ 'border-theme-6': validate.email_address.$error }" 
                            @blur="checkEmail" />

                        <div v-if="validate.email_address.required.$invalid && validate.email_address.$dirty"
                            class="text-theme-6 mt-2">
                            {{validate.email_address.required.$message}}
                        </div>

                        <div v-if="validate.email_address.email.$invalid && validate.email_address.$dirty"
                            class="text-theme-6 mt-2">
                            {{validate.email_address.email.$message}}
                        </div>

                        <div v-if="!isEmailAvailable" class="text-theme-6 mt-2">
                            {{ emailAvailableMessage }}
                        </div>
                        <div class="relative">
                        <input
                            v-model="formData.password"
                            :type="passwordType"
                            class="form-control py-3 px-4 border-gray-300 block mt-4"
                            placeholder="Password"
                            :class="{ 'border-theme-6': validate.password.$error, }"/>
                            <Lucide icon="EyeOff" 
                                class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 text-gray-700 cursor-pointer" 
                                v-if="passwordType === 'password'"
                                @click="switchVisibility()" />

                            <Lucide icon="Eye" 
                                class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 text-gray-700 cursor-pointer" 
                                v-if="passwordType === 'text'"
                                @click="switchVisibility()"
                            />
                        </div>
                        <div id="password-validation" class="text-gray-500 mt-2">
                            <div v-for="(rule, key) in passwordValidation.validations" 
                                :key="key" style="display: flex; align-items: center;">
                                <svg v-if="rule" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    fill="currentColor" 
                                    class="bi bi-check-lg text-success" 
                                    viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                                </svg>
                                <svg v-else 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    fill="currentColor" 
                                    class="bi bi-x text-danger" 
                                    viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                                <span class="ml-3" :class="[rule ? 'text-success' : 'text-danger']">{{ passwordValidationMessages[key] }}</span>
                            </div>
                        </div>

                        <!-- <div id="password-validation" class="text-gray-500 mt-2">
                            <div style="display: flex; align-items: center;">
                                <svg v-if="passwordValidation.validations.uppercase" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg text-success" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x text-danger" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                                <span class="ml-3" :class="[passwordValidation.validations.uppercase ? 'text-success' : 'text-danger']">
                                    It should contain one UPPERCASE letter
                                </span>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <svg v-if="passwordValidation.validations.lowercase" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg text-success" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x text-danger" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                                <span class="ml-3" :class="[passwordValidation.validations.lowercase ? 'text-success' : 'text-danger']">It should contain one lowercase letter</span>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <svg v-if="passwordValidation.validations.length" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg text-success" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x text-danger" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                                <span class="ml-3" :class="[passwordValidation.validations.length ? 'text-success' : 'text-danger']">At least 8 characters</span>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <svg v-if="passwordValidation.validations.number" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg text-success" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x text-danger" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                                <span class="ml-3" :class="[passwordValidation.validations.number ? 'text-success' : 'text-danger']">It should contain one number digit</span>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <svg v-if="passwordValidation.validations.special" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg text-success" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x text-danger" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                                <span class="ml-3" :class="[passwordValidation.validations.special ? 'text-success' : 'text-danger']">It should contain at least one special character</span>
                            </div>

                        </div> -->
                        <div
                            v-if="validate.password.required.$invalid && validate.password.$dirty"
                            class="text-theme-6 mt-2">
                            {{validate.password.required.$message}}
                        </div>

                    </div>

                    <div class="mt-4 text-center">
                        <button class="btn btn-primary-auth" 
                        :class="{'disable' : showLoadingIcon || !passwordValidation.valid}"    
                        :disabled='showLoadingIcon || !passwordValidation.valid'>       
                            <span v-if="!showLoadingIcon">Create an account</span>
                            <LoadingIcon icon="oval" color="white" class="w-7 h-7" 
                            v-if="showLoadingIcon" />
                        </button>

                        <div class="border-gray-1 bg-gray-300 h-px leading-px my-5 flex justify-center">
                            <div class="bg-white text-gray-500 px-5 -mt-2">
                                OR
                            </div>
                        </div>
                        <div class="mt-3 flex justify-center">
                            <SocialAuthButtons />
                        </div>
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
                </form>
            </div>
            <!-- END: Register Form -->
        </div>
    </div>
</template>

<script>
import SocialAuthButtons from "@/components/buttons/SocialAuthButtons.vue"
import { defineComponent, onMounted, watch } from "vue"
import { createAccount } from "@/compositions/auth"
import cash from "cash-dom"


export default defineComponent({
    components: {
    SocialAuthButtons, // ✅ Component properly registered
  },
    setup() {

        onMounted(() => {
            cash("body").removeClass("main").removeClass("error-page").addClass("login")
        })

        const {
            formData,
            alreadyRegisterMessage,
            isAlreadyRegister,
            isUsernameAvailable, 
            usernameAvailableMessage,
            isEmailAvailable,
            emailAvailableMessage,
            passwordType,
            showLoadingIcon,
            passwordValidationMessages,
            submit,
            switchVisibility,
            validate,
            checkUsername,
            checkEmail,
            passwordValidation           
        } = createAccount()

        console.log(formData.password)

        return {
            formData,
            alreadyRegisterMessage,
            isAlreadyRegister,
            isUsernameAvailable, 
            usernameAvailableMessage,
            isEmailAvailable,
            emailAvailableMessage,
            passwordType,
            showLoadingIcon,
            passwordValidationMessages,
            submit,
            switchVisibility,
            validate,
            checkUsername,
            checkEmail,
            passwordValidation            
        }
    },
})
</script>
