    <!-- https://dashmosagency.github.io/aio-admin-dashboard/src/app-invoice-create.html# -->
       <template>
    <div class="content md:h-screen md:p-0 md:overflow-hidden">
        <!-- BEGIN: Login Form -->
        <div class="fixed top-2 md:right-3 z-10 right-2 drop-shadow-sm w-10 h-10 shadow text-center transition flex items-center justify-center bg-white dark:bg-dark-2 dark:text-white cursor-pointer hover:bg-black hover:text-white" @click="toggleDarkMode()" ><Lucide icon="SunMoon" ></Lucide></div>
        <div class="md:h-screen flex">
            <div class="m-auto box p-8 w-full sm:w-3/4 lg:w-2/5">
                     <a href="/" class="pb-5 flex justify-center">
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
                        Sign In
                    </h2>
                    <div class="mt-2 text-gray-500 text-center">
                        A few more clicks to sign in to your account.
                    </div>
                <form @submit.prevent="submit">
                   
                    <div class="mt-5">
                        <input
                            v-model="formData.username"
                            type="text"
                            class="form-control py-3 px-4 border-gray-300 block dark:text-white"
                            placeholder="Username"
                            :class="{
                                'border-theme-6': validate.username.$error,
                            }"
                        />
                        <div v-if="validate.username.required.$invalid && validate.username.$dirty"
                            class="text-theme-6 mt-2">
                            {{validate.username.required.$message}}
                        </div>

                        <div v-if="isInvalidUser" class="text-theme-6 mt-2">
                            {{ invalidUserMessage }}
                        </div>
                        <div class="relative">
                            <input
                                v-model="formData.password"
                                :type="passwordType"
                                class="form-control py-3 px-4 border-gray-300 block mt-4"
                                placeholder="Password" />
                            <Lucide icon="EyeOff" 
                                class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 text-gray-700 cursor-pointer" 
                                v-if="passwordType === 'password'"
                                @click="switchVisibility()" />

                            <Lucide icon="Eye" 
                                class="w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0 z-10 text-gray-700 cursor-pointer" 
                                v-if="passwordType === 'text'"
                                @click="switchVisibility()" />
                        </div>

                        <div
                            v-if="validate.password.required.$invalid && validate.password.$dirty"
                            class="text-theme-6 mt-2">
                            
                            {{validate.password.required.$message}}
                        </div>
                    </div>
                    <div class="mt-4 text-center">
                        <button class="btn btn-primary-auth" 
                        :class="{'disable' : showLoadingIcon}"
                        :disabled='showLoadingIcon'>                        
                            <span v-if="!showLoadingIcon">Login</span>
                            <LoadingIcon icon="oval" color="white" class="w-7 h-7" v-if="showLoadingIcon" />
                        </button>

                        <div class="border-gray-1 bg-gray-300 h-px leading-px my-5 flex justify-center">
                            <div class="bg-white text-black-500 px-5 -mt-2 dark:bg-dark-2">
                                OR
                            </div>
                        </div>
                        <div class="mt-3 flex justify-center">
                            <SocialAuthButtons />
                        </div>
                        <router-link
                            class="block my-3 text-md text-theme-3"
                            :to="{ name: 'forgot-password' }"
                            tag="button">Forgot Password?</router-link>
                    </div>
                    <div class="mt-3 text-gray-500 text-center flex gap-1 justify-center">
                        Don't have an account?
                        <router-link
                            class="text-theme-1"
                            :to="{ name: 'register' }"
                            tag="button">Sign up</router-link>
                    </div>
                </form>
            </div>
        </div>
        <!-- END: Login Form -->
    </div>
</template>

<script setup>
import SocialAuthButtons from "@/components/buttons/SocialAuthButtons.vue";
import { onMounted, watch } from "vue"
import { login } from "@/compositions/auth"

    const {
        formData,
        passwordType,
        showLoadingIcon,
        submit,
        switchVisibility,
        validate,
        isInvalidUser,
        invalidUserMessage,
    } = login()

    onMounted(() => {
        document.body.classList.remove("main",'error-page')
        document.body.classList.add('login')
    })

    const toggleDarkMode = () => {
    if (document.body.classList.contains('dark')) {
        document.body.classList.remove('dark')
    } else {
        document.body.classList.add('dark')
    }
}

    watch([isInvalidUser], () => {
        setTimeout(() => {
            isInvalidUser.value = false
        }, 4000)
    })

</script>