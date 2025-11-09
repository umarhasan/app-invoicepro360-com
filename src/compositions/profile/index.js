import { reactive, toRefs } from "vue"
import {useUtils} from "@/compositions/utils"
import { helper as $h } from '@/utils/helper'
import { required, sameAs } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core"
import { useApi } from "../api"
import { useAuth, AUTH_KEY } from "../auth"
import config from "../../config"


export const saveProfile = () => {

    const { user,setUser } = useAuth()
    const { countries,states,permissionList } = useUtils()


    const state = reactive({
        user: {
            username : user.value.username,
            email : user.value.email,
            firstName: user.value.firstName,
            lastName: user.value.lastName,
            country: user.value.country,
            state: user.value.state,
            city: user.value.city,
            zipCode: user.value.zipCode,
            phoneNumber : user.value.phoneNumber,
            mobileNumber : user.value.mobileNumber,
            mobileCountryCode : user.value.mobileCountryCode,
            phoneCountryCode : user.value.phoneCountryCode,
        },
        countries: countries,
        states: states,
        error : false,
        alertMessage: "",
        validationErrors : null,
        showLoadingIcon   : false,
        isSaved : false,
        isMobileNumberValid : true,
        isPhoneNumberValid : true,
    })


    const validationRules = {
        username: { required },
        email: { required },
        firstName: { required },
        lastName: { required },
        country: { required },
        mobileNumber: {required},
        phoneNumber: {required},
    }

    //validation object
    const validate = useVuelidate(validationRules, state.user)

    const updateProfile = async () => {

        //validate
        validate.value.$touch()
        if (validate.value.$invalid) return

        if(!state.isMobileNumberValid || !state.isPhoneNumberValid) return

        const { data, post,status } = useApi(config.USER_PROFILE_URL)

        state.showLoadingIcon = true

        //send post request
        await post(state.user)

        if(status.value == 400 || status.value == 404){
            state.alertMessage = 'Unable to update profile'
            state.error  = true

            if(data.value.validation_errors) {
                state.alertMessage = 'Validation Failed'
                state.validationErrors = data.value.validation_errors
            }

        }else{
            state.isSaved = true
            state.alertMessage = 'Profile has been updated'

            const obj = JSON.parse(window.localStorage.getItem(AUTH_KEY))

            obj.user.email      = state.user.email
            obj.user.username   = state.user.username
            obj.user.firstName  = state.user.firstName
            obj.user.lastName   = state.user.lastName
            obj.user.mobileCountryCode = state.user.mobileCountryCode
            obj.user.mobileNumber = state.user.mobileNumber
            obj.user.phoneCountryCode = state.user.phoneCountryCode
            obj.user.phoneNumber = state.user.phoneNumber
            obj.user.city        = state.user.city
            obj.user.state       = state.user.state
            obj.user.country     = state.user.country

            setUser(obj)
        }

        state.showLoadingIcon = false
    }

    const mobileNumberUpdate = (formatedNumber,data) => {
        
        state.user.mobileNumber = formatedNumber
        state.user.mobileCountryCode = (state.user.mobileCountryCode)? state.user.mobileCountryCode : data.countryCallingCode

        // state.isMobileNumberValid = true

        // if (!data.valid) {
        //     state.isMobileNumberValid = false
        // }
    }    

    const phoneNumberUpdate = (formatedNumber,data) => {

        state.user.phoneNumber = formatedNumber
        state.user.phoneCountryCode = (state.user.phoneCountryCode)? state.user.phoneCountryCode : data.countryCallingCode
        // state.isPhoneNumberValid = true

        // if (!data.valid) {
        //     state.isPhoneNumberValid = false
        // }

    }

    const showNotification = () => {
        $h.notification(state.error,state.alertMessage,state.validationErrors)
        state.isSaved = false
        state.error = false
        state.alertMessage = null
        state.validationErrors = null
    }
    return {
        ...toRefs(state),
        updateProfile,
        mobileNumberUpdate,
        phoneNumberUpdate,
        validate,
        showNotification,
    }
}

export const savePassword = () => {

    const state = reactive({
        user: {
            currentPassword: null,
            newPassword: null,
            confirmPassword: null,
        },
        isSaved : false,
        error   : false,
        showLoadingIcon : false,
        alertMessage    : "",
        currentPasswordType : 'password',
        newPasswordType     : 'password',
        confirmPasswordType : 'password',
    })


    const switchVisibility = (type) => {

        if(type === 'current-password'){
            state.currentPasswordType = (state.currentPasswordType === "password") ? "text" : "password"
        }

        if(type === 'new-password'){
            state.newPasswordType = (state.newPasswordType === "password") ? "text" : "password"
        }

        if(type === 'confirm-password'){
            state.confirmPasswordType = (state.confirmPasswordType === "password") ? "text" : "password"
        }
    }
    
    const validationRules = {
        currentPassword: { required },
        newPassword: { required },
        confirmPassword: {
            required,
            // sameAs: sameAs(state.user.newPassword)
        },
    }

    //validation object
    const validate = useVuelidate(validationRules, state.user)

    const updatePassword = async () => {    

        //validate
        validate.value.$touch()
        if (validate.value.$invalid) return

        const { data, post,status } = useApi(config.UPDATE_PASSWORD_URL)

        const payload = {
            current_password : state.user.currentPassword,
            new_password    : state.user.newPassword
        }

        state.showLoadingIcon = true

        await post(payload)

        if(status.value == 400 || status.value == 404){
            state.alertMessage = data.value.error
            state.isSaved = false
            state.error  = true

        }else{
            state.alertMessage = 'Password has been updated'
            state.isSaved = true
            state.error  = false
            // state.user.currentPassword = null
            // state.user.newPassword = null
            // state.user.confirmPassword = null
        }

        state.showLoadingIcon = false
    }
    const showNotification = () => {
        $h.notification(state.error,state.alertMessage,state.validationErrors)
        state.isSaved = false
        state.error = false
        state.alertMessage = null
        state.validationErrors = null
    }
    return {
        ...toRefs(state),
        updatePassword,
        switchVisibility,
        validate,
        showNotification,
        
    }
}