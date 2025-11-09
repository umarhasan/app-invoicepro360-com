import { reactive, toRefs, watchEffect } from "vue"
import { useApi } from "@/compositions/api"
import { useAuth } from "@/compositions/auth";

import config from "@/config"

const state = reactive({
    menuItems       : [],
    countries       : [],
    states          : [],
    userTypes       : [],
    currencies      : [],
    permissionList  : [],
    businesses      : [],
    currentBusinessName : '',
    settings         : [],
    chartAccounts : [],
    isPaymentGatewayEnabled : false,
    isSetup         : false,
    isMenuLoaded    : false,
    isCountryLoaded : false, 
    isStatesLoaded  : false, 
    isUserTypesLoaded  : false, 
    isCurrencyLoaded  : false, 
    isPermissionLoaded  : false, 
    isBusinessLoaded : false,
    isSettingLoaded : false,
    isPaymentGatewaysLoaded : false,    
    dateFormat : "YYYY-MMM-DD",
    currency : "USD",
    currencySymbol : "$",
    refreshAssignedBusiness : false,
    isIntuitAccessTokenValid : true,
    intuitSyncSettings : {
        isConnected: false, 
        isPaused: false, 
        isCustomerSyncAllowed: false, 
        isItemSyncAllowed: false, 
        isInvoiceSyncAllowed: false
    },
    isCloverAccessTokenValid : true,
    cloverSettings : {
        isConnected: false, 
        isTipEnabled : false,
        device:'',
        printer: '', 
    },
    isIntuitValidated : false,
    isCloverValidated : false,
    isHideIntuitAlert : false,      
    ischartofAccountLoaded : false,
})

export const businessTypes = [
    {
        label : 'Select Business Type',
        value : ''
    },
    {
        label : "Artists, Photographers & Creative Types",
        value : "atrists_photographers_creative"
    },
    {
        label : "Consultants & Professionals",
        value : "consultants_professionals"
    },
    {
        label : "Financial Services",
        value : "finance_insurance"
    },
    {
        label : "General: I make or sell a PRODUCT",
        value : "product_provider"
    },
    {
        label: "General: I provide a SERVICE",
        value : "service_provider"
    },
    {
        label: "Hair, Spa & Aesthetics",
        value : "hair_spa_aesthetics"
    },
    {
        label: "Medical, Dental, Health",
        value : "medical_dental_health_service"
    },
    {
        label: "Non-profits, Associations & Groups",
        value : "nonprofit_associations_groups"
    },
    {
        label: "Real Estate, Construction & Home Improvement",
        value : "realestate_home"
    },
    {
        label: "Retailers, Resellers & Sales",
        value : "retailers_and_resellers"
    },
    {
        label: "Web, Tech & Media",
        value : "web_media_freelancer"
    },    
]

export const companyTypes = [
    {
        label : 'Select Company Type',
        value : ''
    },
    {
        label : 'Sole Proprietorship',
        value : 'soleproprietorship'
    },
    {
        label : 'Partnership',
        value : 'partnership'
    },
    {
        label : 'Corporation',
        value : 'corporation'
    }
]

export const currencies = [
    {
        label : 'U.S. dollar',
        value : 'USD'
    },
    {
        label : 'Canadian dollar',
        value : 'CAD'
    }
]

export const useUtils = () => {

    const initialize = (invokedFrom = 'dashboard') => {

        // console.log(`Initialize from: ${invokedFrom}`)

        AssignedBusiness(true)
        fetchAcl()        
        fetchCountries()
        fetchStates()
        fetchCurrencies()
        fetchSetting()
        fetchUerTypes()
        isPaymentGatewayEnabled()
        isIntuitTokenValid()
        isCloverTokenValid()
        fetchChartofAccounts()

        watchEffect(() => {

            if(
                state.isMenuLoaded && 
                state.isCountryLoaded && 
                state.isStatesLoaded && 
                state.isUserTypesLoaded && 
                state.isCurrencyLoaded &&
                state.isPermissionLoaded && 
                state.isBusinessLoaded &&
                state.isSettingLoaded &&
                state.isPaymentGatewaysLoaded && 
                state.isIntuitValidated &&
                state.isCloverValidated &&
                state.ischartofAccountLoaded
            ) {
                state.isSetup = true
                // console.log("Menu loaded:"+state.isMenuLoaded) 
                // console.log("Country loaded:"+state.isCountryLoaded) 
                // console.log("States loaded:"+state.isStatesLoaded) 
                // console.log("User types loaded:"+state.isUserTypesLoaded) 
                // console.log("Currency loaded:"+state.isCurrencyLoaded)
                // console.log("Permission loaded:"+state.isPermissionLoaded) 
                // console.log("Business loaded:"+state.isBusinessLoaded)
                // console.log("Setting loaded:"+state.isSettingLoaded)
                // console.log("Setting loaded:"+state.isPaymentGatewaysLoaded)
                // console.log("Setting loaded:"+state.isCloverValidated)
                // console.log("Setting loaded:"+state.isIntuitValidated)
                // console.log("Setting loaded:"+state.ischartofAccountLoaded)

                const { defaultBusinessId } = useAuth();

                let b = state.businesses.find((x) => x.id === defaultBusinessId.value);
                state.currentBusinessName =  b?.companyName;                 
            }   

        })
    }

    const onBoardingInitialize = (invokedFrom = 'onboarding') => {

        AssignedBusiness(true)
        fetchAcl()        
        fetchCountries()
        fetchStates()
        fetchCurrencies()
        fetchUerTypes()

        watchEffect(() => {

            if(
                state.isMenuLoaded && 
                state.isCountryLoaded && 
                state.isStatesLoaded && 
                state.isUserTypesLoaded && 
                state.isCurrencyLoaded &&
                state.isPermissionLoaded && 
                state.isBusinessLoaded 
            ) {
                state.isSetup = true
                console.log(`Initialize from: ${invokedFrom}`)

                const { defaultBusinessId } = useAuth();

                let b = state.businesses.find((x) => x.id === defaultBusinessId.value);
                state.currentBusinessName =  b?.companyName;   

            }   
        })
    }
    const onBoardingRedirect = () => {
        if (window.location.pathname == '/onboarding' &&
            state.businesses.length > 0 ) router.push({name : 'dashboard'})

        if (window.location.pathname != '/onboarding' &&
            state.businesses.length == 0 ) router.push({name : 'onboarding'})            
    }

    const fetchCountries = () => {
        const { data, get,status } = useApi(config.FETCH_COUNTRIES_URL)

        get().then( () => {
            if(status.value != 404) state.countries = data.value.data            
            state.isCountryLoaded = true
        })

    }

    const fetchStates = () => {
        const { data, get,status } = useApi(config.FETCH_STATES_URL)
        
        get().then( () => {            
            if(status.value != 404 && status.value != 400){
                state.states = data.value.data ?? []
            }
        })
        state.isStatesLoaded = true

    }

    const AssignedBusiness = (validateonBoardingRedirect = true) => {
        const {get, data, error,status} = useApi(config.ASSIGNED_BUSINESS_URL)
    
        get().then( () => {            
            if(status.value === 404 || status.value === 400){   
                state.isBusinessLoaded = true
                state.businesses = []
            }else{
                state.isBusinessLoaded = true
                if(data.value.data) state.businesses = data.value.data                
            }
            // After assigned business api set to false and default would be false            
            state.refreshAssignedBusiness = false
            // Only check redirection on login/register
            if(validateonBoardingRedirect) onBoardingRedirect()            
        })
    }

    const fetchCurrencies = () => {
        const { data, get, status } = useApi(config.FETCH_CURRENCIES_URL)

        get().then( () => {
            if(status.value != 404) state.currencies = data.value.data
            state.isCurrencyLoaded = true
        })        
    }

    const fetchUerTypes = () => {
        const { data, get } = useApi(config.FETCH_USER_TYPES_URL)
        state.isUserTypesLoaded = true
    }

    const fetchAcl = () => {
        const { data, get,status } = useApi(config.FETCH_ACL_URL)    

        get().then( () => {
            if(status.value != 404) {
                state.menuItems = data.value.data.menu
                state.permissionList = data.value.data.permissions
            }         
            state.isMenuLoaded = true
            state.isPermissionLoaded = true
        })
    }    

    const fetchSetting = () => {
        const { data, get, status,error } = useApi(config.SETTING_URL)
    
        get().then( () => {
            if(status.value === 404 || status.value === 400){
                state.error = error.value.message            
                state.isSettingLoaded = true
            }else{
                state.settings = data.value.data
                state.dateFormat = state.settings.date_format
                state.currency = state.settings.currency
                state.currencySymbol = state.settings.currency_symbol
                state.isSettingLoaded = true
            }
            
        })
    }

    ///is-token-valid
    const isPaymentGatewayEnabled = () => {
        const { data, get, error,status,isConnectionFail }  = useApi(config.PAYMENT_GATEWAYS_URL)
        state.isPaymentGatewayEnabled = false
        
        get().then( () => {
            if(isConnectionFail.value)
            {
                state.isPaymentGatewayEnabled = false
            }else if(status.value != 404)
            {
                state.isPaymentGatewayEnabled = data.value.data.isEnabled
            }
            state.isPaymentGatewaysLoaded = true
        })
    }

    const isIntuitTokenValid = () => {

        const { data, get, error,status,isConnectionFail }  = useApi(config.INTUIT_ACCESS_TOKEN_VALIDATE_URL)
        state.isIntuitAccessTokenValid = false
        
        get().then( () => {

            if(isConnectionFail.value)
            {
                state.isIntuitAccessTokenValid = true
                state.isIntuitValidated = true
            }else
            {
                let resp = data.value.data 
                state.isIntuitAccessTokenValid = resp?.isTokenValid
                state.intuitSyncSettings = resp?.intuitSyncSettings
                state.isIntuitValidated = true
            }
        })
    }

    const isCloverTokenValid = () => {

        const { data, get, error,status,isConnectionFail }  = useApi(config.CLOVER_ACCESS_TOKEN_VALIDATE_URL)

        get().then( () => {

            if(isConnectionFail.value)
            {
                state.isCloverAccessTokenValid = true
                state.isCloverValidated = true

            }
            
            if(status.value != 404 && status.value != 400){

                let resp = data.value.data 

                state.cloverSettings.isConnected = resp.cloverSettings.isConnected 
                state.cloverSettings.isTipEnabled = resp.cloverSettings.isTipEnabled
                state.cloverSettings.device = resp.cloverSettings.device
                state.cloverSettings.printer = resp.cloverSettings.printer

                state.isCloverAccessTokenValid = resp?.isTokenValid
                state.isCloverValidated = true

            }

        })    
    }

    const fetchChartofAccounts = () => {
        
        const {get, data, errorMessage, status,isConnectionFail} = useApi(config.CHART_ACCOUNT_URL)
    
        get().then( () => {            
            if(status.value != 404){
                state.chartAccounts = data.value.data ?? []
            }
        })
        state.ischartofAccountLoaded = true
    }

    const hideIntuitAlert = () => {
        return (state.isHideIntuitAlert) ? state.isHideIntuitAlert = false : state.isHideIntuitAlert = true
    }

    const toggleDarkMode= () => {
        if (document.body.classList.contains('dark')) {
            document.body.classList.remove('dark')
        } else {
            document.body.classList.add('dark')
        }
    }

    watchEffect(()=>{
        if(state.refreshAssignedBusiness){
            AssignedBusiness(false)
        }
    })


    return {
        ...toRefs(state),
        fetchCountries,
        fetchStates,
        fetchUerTypes,
        fetchAcl,
        fetchChartofAccounts,
        isIntuitTokenValid,
        isCloverTokenValid,
        hideIntuitAlert,
        initialize,
        onBoardingInitialize,
        toggleDarkMode
    }
    
}

export const resetUtils = () => {

    state.menuItems = []
    state.countries = []
    state.states    = [] 
    state.userTypes = []
    state.currencies= []
    state.businesses= []
    state.permissionList = []

    state.isSetup          = false   
    state.isMenuLoaded     = false
    state.isCountryLoaded  = false 
    state.isStatesLoaded   = false 
    state.isUserTypesLoaded= false 
    state.isCurrencyLoaded = false 
    state.isBusinessLoaded = false
    state.isPermissionLoaded  = false 
    state.isPaymentGatewayEnabled = false
    state.isPaymentGatewaysLoaded = false


}




