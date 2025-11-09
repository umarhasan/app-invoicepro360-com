import { reactive, toRefs, watch, computed } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { useApi } from "@/compositions/api"
import VALIDATE from "@/compositions/validate"
import { useUtils, resetUtils } from "@/compositions/utils"
import config from "@/config"
import cash from "cash-dom"

export const AUTH_KEY = "invoicepro_token"
export const AUTH_TOKEN = "access_token"

const state = reactive({
    isLoggedin: false,
    user: undefined,
    err: undefined,
    businesses: [],
    isBusinessLoaded: false,
    defaultBusinessId: 0,
    refreshToken : {
        expiredAt : 0,
        //refresh between 2min = 120000 to (10min = 600000, 55min = 3300000)
        refreshAt : 3300000,
        refreshEnd : 120000,

    }
})

export const retriveToken = () => {

    const obj = JSON.parse(window.localStorage.getItem(AUTH_KEY))

    if (obj) {

        return (obj.hasOwnProperty('access_token')) ? `Bearer ${obj.access_token}` : undefined

    } else {
        return ''
    }

}

export const refreshToken = async () => {

    const obj = JSON.parse(window.localStorage.getItem(AUTH_KEY))

    if (obj) {

        const { data, error, post } = useApi(config.REFRESH_TOKEN_URL)

        let currentTime = new Date(new Date().getTime());
        let remainingTime =  state.refreshToken.expiredAt - currentTime.getTime()

        //remaining time between 2 to 10min then refresh token
        //remaining time minus means visitor was inactive or not using web app  

        // if(remainingTime < state.refreshToken.refreshAt && remainingTime > state.refreshToken.refreshAt ){            
        //     await post({ access_token: obj.access_token})            
        // }

        if(remainingTime < state.refreshToken.refreshAt  ){            

            // console.log("Refresh token remaining time:" + remainingTime)

            await post({ access_token: obj.access_token})    
            
            if (data.value.status === 200) {
 
                // save in localstorage
                let obj = JSON.parse(window.localStorage.getItem(AUTH_KEY))
    
                obj.access_token = data.value.data.access_token
                obj.expiresAt = data.value.data.expiresAt
                window.localStorage.setItem(AUTH_KEY, JSON.stringify(obj))

                state.refreshToken.expiredAt = obj.expiresAt  * 1000
            }
        }
        // else if(remainingTime < 0 ){

        //     // due to inactive visitor refresh token api wasn't call before token expire
        //     // hit refresh token api for 401 error 
        //     // useApi() will catch 401 and logout the session.
        //     await post({ access_token: obj.access_token})
        // }

    }    
}

export const useAuth = () => {

    const logout = (isRedirect = true) => {
        window.localStorage.removeItem(AUTH_KEY)
        state.user = undefined
        state.err = undefined
        state.isLoggedin = false

        resetUtils()

        //don't redirect if page is login or user invitation login
        if ( isRedirect && 
            ( router.currentRoute.value.name != 'invite-user-login' &&
                router.currentRoute.value.name != 'login')
        ) {
            cash(".dropdown-menu").remove()

            return router.push({ name: "login" })
        }
    }

    const setUser = async payload => {

        window.localStorage.setItem(AUTH_KEY, JSON.stringify(payload))
        state.user = payload.user
        state.refreshToken.expiredAt = payload.expiresAt * 1000
        state.defaultBusinessId = payload.user.default_business_id
        state.err = undefined
        state.isLoggedin = true

    }

    const setDefaultBusiness = (businessId) => {

        const { data, post } = useApi(config.SET_DEFAULT_BUSINESS_URL)
        const payload = {
            id: businessId,
        }

        post(payload).then(() => {

            if (data.value.status === 200) {
                let obj = JSON.parse(window.localStorage.getItem(AUTH_KEY))

                obj.access_token = data.value.data.access_token
                obj.user.default_business_id = businessId

                window.localStorage.setItem(AUTH_KEY, JSON.stringify(obj))
                window.location.reload()
            } else {
                cash("#set-business-modal").modal('show')
            }
        })
    }

    const useUser = async (isOnboarding = false) => {
        // Read access token from local storage?
        const _token = retriveToken()

        if (_token) {
            const { data, error, post } = useApi(config.VALIDATE_AUTH_URL)
            const { onBoardingInitialize, initialize, isSetup } = useUtils()
            const payload = {
                access_token: _token.replace("Bearer ", ""),
            }

            await post(payload)

            if (data.value.status == 401 || error.value) {
                state.user = null
                state.isLoggedin = false
                window.localStorage.removeItem(AUTH_KEY)

                cash(".dropdown-menu").remove()

            } else {
                let obj = JSON.parse(window.localStorage.getItem(AUTH_KEY))
                state.user = obj.user
                state.refreshToken.expiredAt = obj.expiresAt * 1000
                state.isLoggedin = true
                state.defaultBusinessId = obj.user.default_business_id
                state.user.isValidMfa = data.value.data.isValidMfa
            }

            if (state.isLoggedin && state.user.isValidMfa &&
                (window.location.pathname != '/multifactor-authentication' &&
                    window.location.pathname != '/dashboard'    
                )
            ) {
                console.log("isLoggedin",state.isLoggedin);
                console.log("window.location.pathname",window.location.pathname);
                console.log("isSetup.value",isSetup.value);
                console.log("isOnboarding",isOnboarding);
                
                if(!isSetup.value){
                    if(isOnboarding){
                        onBoardingInitialize('onboarding initialize')
                    }else{
                        initialize('full initialize')
                    }
                }
            }
        }
    }

    return {
        ...toRefs(state),
        setUser,
        logout,
        refreshToken,
        useUser,
        setDefaultBusiness,
    }
}

export const createAccount = (token = '') => {

    const state = reactive({
        formData: {
            first_name: "",
            last_name: "",
            username: "",
            email_address: "",
            password: "",
        },
        alreadyRegisterMessage: null,
        usernameAvailableMessage: null,
        emailAvailableMessage: null,
        isAlreadyRegister: false,
        isUsernameAvailable: true,
        isEmailAvailable: true,
        passwordType: "password",
        showLoadingIcon: false,
        passwordValidationMessages: {
            uppercase: "It should contain one UPPERCASE letter",
            lowercase: "It should contain one lowercase letter",
            length: "At least 8 characters",
            number: "It should contain one number digit",
            special: "It should contain at least one special character"
        }
    })

    const passwordValidation = computed(() => {
        if (state.formData.password) {
            const validations = getValidations(state.formData.password);
            return {
                valid: Object.values(validations).every((v) => v), // All validations must pass
                validations,
            };
        }
        return {
            valid: false,
            validations: {
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false,
            },
        };
    });

    function getValidations(password) {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>-]/.test(password),
        };
    } 

    //validation 
    let validate = useVuelidate(VALIDATE.Register, state.formData)

    if (token) {
        validate = useVuelidate(VALIDATE.RegisterInvitation, state.formData)
        // checkEmail()
    }

    const submit = () => {

        validate.value.$touch()

        if (validate.value.$invalid) return

        if (!state.isUsernameAvailable) return

        if (!state.isEmailAvailable) return

        state.showLoadingIcon = true

        let REGISTER_URL = config.USER_REGISTER_URL
        let payload = {
            first_name: state.formData.first_name,
            last_name: state.formData.last_name,
            username: state.formData.username,
            email: state.formData.email_address,
            password: state.formData.password,
        }

        if (token) {
            REGISTER_URL = config.INVITATION_REGISTER_URL
            payload = {
                username: state.formData.username,
                password: state.formData.password,
                token: token,
            }
        }

        const { data, post, errorMessage } = useApi(REGISTER_URL)
        const { setUser } = useAuth()

        post(payload).then(() => {

            if (errorMessage.value == "Unauthorized") {
                state.isAlreadyRegister = true
                state.alreadyRegisterMessage = data.value.message
            } else {
                setUser(data.value.data)
                sendVerificationEmail(state.formData.email_address, data.value.data.token)

                if (token) {
                    router.push({ name: "dashboard" })
                } else {
                    router.push({ name: "onboarding" })
                }
            }
            state.showLoadingIcon = false
        })
    }
    const createAccountFromSocialite = (socialiteData) => {
        return {
            first_name: socialiteData.first_name || "User",
            last_name: socialiteData.last_name || "Socialite",
            username: socialiteData.username || socialiteData.email.split("@")[0],
            email: socialiteData.email,
            password: socialiteData.is_existing_user ? null : Math.random().toString(36).slice(-10),
        };
    };
 
    const SocailDataFetch = async (newUserData) => {
        state.showLoadingIcon = true; // Loader start
    
        let token = newUserData.token || null;
        let REGISTER_URL = config.USER_REGISTER_URL;
        let payload = {
            first_name: newUserData.first_name,
            last_name: newUserData.last_name,
            username: newUserData.username,
            email: newUserData.email,
            password: newUserData.password,
        };
    
        if (token) {
            REGISTER_URL = config.INVITATION_REGISTER_URL;
            payload = {
                username: newUserData.username,
                password: newUserData.password || Math.random().toString(36).slice(-10),
                token: token,
            };
        }
    
        const { data, post, errorMessage } = useApi(REGISTER_URL);
        const { setUser } = useAuth();
    
        try {
            await post(payload);
    
            if (errorMessage.value === "Unauthorized") {
                state.isAlreadyRegister = true;
                state.alreadyRegisterMessage = data.value.message;
            } else {
                setUser(data.value.data);
    
                // Save token only if it is not already stored
                let storedToken = localStorage.getItem('invoicepro_token');
                if (!storedToken) {
                    localStorage.setItem(
                        'invoicepro_token',
                        JSON.stringify({ auth_token: data.value.auth_token })
                    );
                }
    
                // Redirect based on user status
                if (data.value.is_existing_user) {
                    router.push({ name: "dashboard" }); // Existing user -> Dashboard
                } else {
                    router.push({ name: "onboarding" }); // New user -> Onboarding
                }
            }
        } catch (error) {
            console.error("Registration error:", error);
        } finally {
            state.showLoadingIcon = false;
        }
    };
    const switchVisibility = () => state.passwordType = state.passwordType === "password" ? "text" : "password"

    const checkUsername = () => {

        const payload = {
            username: state.formData.username
        }

        const { data, post } = useApi(config.USERNAME_CHECK_URL)

        post(payload).then(() => {
            if (data.value.status === 404) {
                state.isUsernameAvailable = false
                state.usernameAvailableMessage = data.value.message
            } else {
                state.isUsernameAvailable = true
                state.usernameAvailableMessage = data.value.message
            }
        })
    }

    const checkEmail = () => {

        const payload = {
            email: state.formData.email_address
        }

        const { data, post } = useApi(config.EMAIL_CHECK_URL)

        post(payload).then(() => {
            if (data.value.status === 404) {
                state.isEmailAvailable = false
                state.emailAvailableMessage = data.value.message
            } else {
                state.isEmailAvailable = true
                state.emailAvailableMessage = data.value.message
            }
        })
    }

    const sendVerificationEmail = (email, token) => {

        const payload = {
            email: email,
            token: token
        }

        const { data, post } = useApi(config.EMAIL_VERIFICATION_URL)

        post(payload).then(() => {
            if (data.value.status === 404) {
                state.isEmailAvailable = false
                state.emailAvailableMessage = data.value.message
            } else {
                state.isEmailAvailable = true
                state.emailAvailableMessage = data.value.message
            }
        })
    }

    return {
        ...toRefs(state),
        switchVisibility,
        submit,
        SocailDataFetch,
        createAccountFromSocialite,
        checkEmail,
        checkUsername,
        validate,
        passwordValidation,
    }

}
// =============================================================================


export const login = (token = '') => {

    const state = reactive({
        formData: {
            username: null,
            password: null,
        },
        invalidUserMessage: null,
        isInvalidUser: false,
        passwordType: "password",
        showLoadingIcon: false,
    })

    //validation object
    const validate = useVuelidate(VALIDATE.Login, state.formData)

    const submit = () => {

        validate.value.$touch()

        if (validate.value.$invalid) return

        state.showLoadingIcon = true

        let LOGIN_URL = config.USER_LOGIN_URL
        let payload = {
            username: state.formData.username,
            password: state.formData.password,
        }

        if (token) {
            LOGIN_URL = config.INVITATION_LOGIN_URL
            payload = {
                username: state.formData.username,
                password: state.formData.password,
                token: token,
            }
        }

        const { loading, data, post, errorMessage, isConnectionFail } = useApi(LOGIN_URL)
        const { setUser } = useAuth()

        post(payload).then(() => {
            if(isConnectionFail.value || errorMessage.value){
                state.isInvalidUser = true
                state.invalidUserMessage = (errorMessage.value == 'Unauthorized') 
                                            ? data.value.error 
                                            : errorMessage.value
                
            } else {
                setUser(data.value.data)
                if (!data.value.data.user.isValidMfa) {

                    router.push({ name: 'multifactor-authentication' })
                } else {
                    router.push({ name: 'dashboard' })
                }

            }

            state.showLoadingIcon = false
        })

    }

    const switchVisibility = () => state.passwordType = state.passwordType === "password" ? "text" : "password"

    return {
        ...toRefs(state),
        submit,
        validate,
        switchVisibility,
    }
}

export const validateInvitationToken = (token) => {

    const state = reactive({
        isTokenValid: true,
        isTokenValidate: false,
        BusinessName: '',
        Email: '',
    })

    const { data, post } = useApi(config.USER_INVITATION_BUSINESS_NAME_URL)

    post({ token: token }).then(() => {

        state.BusinessName = data.value.data.businessName
        state.Email = data.value.data.email
        state.isTokenValid = true
        state.isTokenValidate = true

        if (!state.BusinessName) state.isTokenValid = false

    })

    return {
        ...toRefs(state)
    }

}

export const ForgotPassword = () => {

    const state = reactive({
        formData: {
            username: null,
        },
        invalidUserMessage: null,
        isInvalidUser: false,
        isEmailValid: false,
        passwordType: "password",
        showLoadingIcon: false,
    })


    //validation object
    const validate = useVuelidate(VALIDATE.ForgotPassword, state.formData)

    const submit = () => {
        validate.value.$touch()

        if (validate.value.$invalid) return

        state.showLoadingIcon = true

        const { data, post } = useApi(config.FORGOT_PASSWORD_URL)

        const payload = {
            email: state.formData.username,
        }

        post(payload).then(() => {

            if (data.value.status === 400) {
                state.isInvalidUser = true
                state.invalidUserMessage = data.value.error
            } else {
                state.isEmailValid = true

                sendResetPasswordEmail({
                    email: payload.email,
                    token: data.value.data.token,
                    username: data.value.data.username
                })
            }
            state.showLoadingIcon = false
        })
    }

    const sendResetPasswordEmail = (payload) => {

        const { data, post } = useApi(config.EMAIL_RESET_PASSWORD_URL)

        post(payload).then(() => {
            if (data.value.status === 404) {
                state.isEmailAvailable = false
                state.emailAvailableMessage = data.value.message
            } else {
                state.isEmailAvailable = true
                state.emailAvailableMessage = data.value.message
            }
        })
    }

    const switchVisibility = () => state.passwordType = state.passwordType === "password" ? "text" : "password"

    return {
        ...toRefs(state),
        submit,
        validate,
        switchVisibility,
    }
}

export const MultiFactorAuthentication = () => {

    const state = reactive({
        formData: {
            passcode: null,
            mfa_type: null,
            step: null,
        },
        options: [],
        invalidCodeMessage: null,
        isInvalidCode: false,
        showLoadingIcon: false,
        isOptionsLoaded: false,
        status: null,
    })

    const fetchOptions = () => {

        const { data, post, error, status } = useApi(config.AUTHY_VERIFY_CODE_URL)

        state.formData.step = 'options'

        post(state.formData).then(() => {

            state.status = status.value

            if (status.value != 404) {
                state.options = data.value.data.options
                state.isOptionsLoaded = true
            }
        })
    }

    fetchOptions()

    //validation object
    const validate = useVuelidate(VALIDATE.MultiFactorVerify, state.formData)

    const submit = async () => {

        validate.value.$touch()

        if (validate.value.$invalid) return

        state.showLoadingIcon = true

        state.formData.step = 'verify-code'
        state.formData.mfa_type = null

        const { data, post } = useApi(config.AUTHY_VERIFY_CODE_URL)
        const { useUser } = useAuth()

        await post(state.formData)

        if (data.value.status === 400) {
            state.isInvalidCode = true
            state.invalidCodeMessage = data.value.error
            state.showLoadingIcon = false

        } else {
            // save in localstorage
            let obj = JSON.parse(window.localStorage.getItem(AUTH_KEY))

            obj.access_token = data.value.data.access_token
            obj.expiresAt = data.value.data.expiresAt

            window.localStorage.setItem(AUTH_KEY, JSON.stringify(obj))            

            //update access_token and user obj            
            await useUser()

            state.showLoadingIcon = false

            router.push({ name: "dashboard" })
        }

    }

    const setAsDefault = (type) => {
        state.options.forEach(option => {
            if (option.type === type) {
                option.default_mfa = 1
            } else {
                option.default_mfa = 0
            }
        })

        if (type === 'sms') {
            const { data, post } = useApi(config.AUTHY_VERIFY_CODE_URL)

            state.formData.mfa_type = type
            state.formData.passcode = null
            state.formData.step = type

            post(state.formData).then(() => {
                if (data.value.status === 400) {
                    state.isInvalidCode = true
                    state.invalidCodeMessage = data.value.error
                }
            })
        }
    }

    return {
        ...toRefs(state),
        setAsDefault,
        submit,
        validate,
    }
}

export const ResetPassword = () => {

    const state = reactive({
        formData: {
            username: router.currentRoute.value.params.username,
            token: router.currentRoute.value.params.token,
            password: null,
        },
        isInvalidToken: false,
        invalidTokenMessage: null,
        passwordType: "password",
        showLoadingIcon: false,
    })

    const validate = useVuelidate(VALIDATE.ResetPassword, state.formData)

    const submit = () => {
        validate.value.$touch()

        if (validate.value.$invalid) return

        state.showLoadingIcon = true

        const { data, post } = useApi(config.RESET_PASSWORD_URL)

        const payload = {
            username: state.formData.username,
            new_password: state.formData.password,
            current_password: state.formData.password,
            hash_token: state.formData.token
        }

        post(payload).then(() => {

            if (data.value.status === 400) {
                state.isInvalidToken = true
                state.invalidTokenMessage = data.value.error
            } else {
                router.push({ name: "login" })
            }

            state.showLoadingIcon = false

        })
    }

    const switchVisibility = () => state.passwordType = state.passwordType === "password" ? "text" : "password"

    return {
        ...toRefs(state),
        validate,
        submit,
        switchVisibility,
    }
}
