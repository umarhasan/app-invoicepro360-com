<template>
    <div class="col-span-12 lg:col-span-8 xxl:col-span-8 mb-10 ">

        <div class="alert alert-danger-soft show my-2" v-if="validationErrors">
            <ul>
                <li v-for="(err,index) in validationErrors" :key="index">
                    {{err}}
                </li>
            </ul>
            <button type="button" class="absolute right-2 top-2 bg-white px-2 py-1 rounded" 
            @click="validationErrors = null">
                <Lucide icon="X" class="w-4 h-4" />
            </button>
        </div>
        <div class="flex border-b border-gray-200 p-5 bg-white rounded" >
            <h2 class="text-xl text-gray-700 tracking-wider font-medium">
                {{title}}
            </h2>
        </div>            
        <form @submit.prevent="submit()">           
        <div class="p-10 px-7 border-b border-gray-200 bg-white">
            <div class="sm:grid grid-cols-2 gap-5">
                <div>
                    <label for="first-name" class="form-label mb-1 font-medium text-gray-700">
                        First Name <span class="text-red-700">*</span>
                    </label>
                    <input v-model="user.firstName" type="text" 
                        class="form-control yr-form-control" 
                        placeholder="First Name"
                        :class="{'error': validate.firstName.$error}"
                        :readonly="user.status == 'active'">

                    <div v-if="validate.firstName.required.$invalid && validate.firstName.$dirty" class="text-theme-6 mt-2">
                        First Name is required</div>
                </div>

                <div>
                    <label for="last-name" class="form-label mb-1 font-medium text-gray-700">
                        Last Name <span class="text-red-700">*</span>
                    </label>
                    <input v-model="user.lastName" type="text" 
                        class="form-control yr-form-control" 
                        placeholder="Last Name"
                        :class="{'error': validate.lastName.$error}"
                        :readonly="user.status == 'active'">

                    <div v-if="validate.lastName.required.$invalid && validate.lastName.$dirty" class="text-theme-6 mt-2">
                        Last Name is required</div>
                </div>
            </div>

            <div class="mt-5">
                <label for="email" class="form-label mb-1 font-medium text-gray-700">
                    Email <span class="text-red-700">*</span>
                </label>
                <input v-model="user.email" type="text" 
                    class="form-control yr-form-control" 
                    placeholder="user@example.com" 
                    :class="{'error': validate.email.$error}" 
                    :readonly="user.status == 'active'" 
                    @blur="checkEmail">

                    <div v-if="validate.email.required.$invalid && validate.email.$dirty" class="text-theme-6 mt-2">
                        Email address is required
                    </div>

                    <div v-if="validate.email.email.$invalid && validate.email.email.$dirty" class="text-theme-6 mt-2">
                        Invalid Email address
                    </div>

                    <div v-if="!isEmailAvailable" class="text-theme-6 mt-2">
                        {{ emailAvailableMessage }}
                    </div>
            </div>


            <div class="mt-5">
                <label for="user-types" class="form-label mb-1 font-medium text-gray-700">
                    User Role <span class="text-red-700">*</span>
                </label>
                <select class="form-select" v-model="user.userTypeId"
                    :class="{'error': validate.lastName.$error}">
                    <option value="">Select user role</option>
                    <option v-for="(row, index) in userTypes" :key="index" :value="row.name" >
                        {{row.name}}
                        </option>    
                </select>
                <div v-if="validate.userTypeId.required.$invalid && validate.userTypeId.$dirty" class="text-theme-6 mt-2">
                    User Role is required</div>
            </div>    
        </div>

        <div class="p-5 bg-white rounded flex justify-start">
            <button type="submit" class="btn btn-primary px-5 mr-3 tracking-wider"
            :class="{'disable' : showLoadingIcon}"
            :disabled='showLoadingIcon'>                        
            <span v-if="!showLoadingIcon">Save</span>
                <LoadingIcon icon="oval" color="white" class="w-5 h-5" v-if="showLoadingIcon" />
            </button>
            <button type="button" class="btn btn-default px-5 tracking-wider" @click="goBack">
                Cancel
            </button>
        </div>

        </form>
    </div>
    <!-- User Permissions -->
    <TogglePermissions :userTypes="userTypes"></TogglePermissions>
    <!-- User Permissions -->    
</template>

<script>
import { onMounted, ref } from "vue"

import TogglePermissions from "./TogglePermissions.vue"
import { saveUser } from "@/compositions/settings/user"
import SettingLayout from '../Setting-layout.vue'

export default {
    components : {
        TogglePermissions,
        SettingLayout
    },
    setup() {    
        

        const {
            title,
            user, 
            userTypes,            
            submit, 
            validate, 
            isSaved, 
            isDeleted, 
            showLoadingIcon, 
            validationErrors,
            records,
            error,
            status,
            isUsernameAvailable, 
            usernameAvailableMessage,
            isEmailAvailable,
            emailAvailableMessage,   
            checkUsername,
            checkEmail,            
            goBack
        } = saveUser()

        return {
            title,
            validate,
            user,
            userTypes,
            isSaved, 
            isDeleted, 
            showLoadingIcon, 
            validationErrors,
            submit,
            goBack,
            userTypes,
            isUsernameAvailable, 
            usernameAvailableMessage,
            isEmailAvailable,
            emailAvailableMessage,   
            checkUsername,
            checkEmail
        }
    },
}
</script>
