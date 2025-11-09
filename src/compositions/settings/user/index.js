import { reactive, toRefs } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { useApi } from "@/compositions/api"
import VALIDATE from "@/compositions/validate"
import { useUtils } from '@/compositions/utils'
import config from "@/config"
import cash from "cash-dom"
import { helper as $h } from '@/utils/helper'

const userTypes = [
    {
        id : 1,
        name : "Admin",
        permissions : [
            {
                module      : "Customers",
                accessLevel : "Allowed",
            },
            {
                module      : "Sales",
                accessLevel : "Allowed",
            },
            {
                module      : "Invoices",
                accessLevel : "Allowed",
            },
            {
                module      : "Product & Services",
                accessLevel : "Allowed",
            }
        ]
    },
    {
        id : 2,
        name : "Manager",
        permissions : [
            {
                module      : "Customers",
                accessLevel : "Allowed",
            },
            {
                module      : "Sales",
                accessLevel : "Allowed",
            },
            {
                module      : "Invoices",
                accessLevel : "Allowed",
            },
            {
                module      : "Product & Services",
                accessLevel : "Allowed",
            }
        ]                
    },
    {
        id : 3,
        name : "Viewer",
        permissions : [
            {
                module      : "Customers",
                accessLevel : "Allowed",
            },
            {
                module      : "Sales",
                accessLevel : "View Only",
            },
            {
                module      : "Invoices",
                accessLevel : "View Only",
            },
            {
                module      : "Product & Services",
                accessLevel : "Allowed",
            }
        ]                
    },            
]

const state = reactive({    
    title : '',
    viewGrid : true,
    viewForm : false,
    formType : null,
    showLoadingIcon : false,
    validationErrors : null,
    user : {
        id           : '',
        firstName    : '',
        lastName     : '',
        email        : '',
        userTypeId   : '',
        role         : '',
        status       : '',   
    },
    lastEmail : null,
    status : null,
    records : null,
    error : null,
    isSaved: false,
    isDeleted: false,    
    usernameAvailableMessage : null,
    emailAvailableMessage : null,
    isUsernameAvailable : true,
    isEmailAvailable    : true,
    permissions : [],
    userTypes : userTypes
})

export const showForm = () => {

    resetForm()

    state.viewGrid = false
    state.viewForm = true
    state.formType = "create"
    state.user.status = "invite"

}

export const fetchUsers = () => {

    const { data, get, error,status }  = useApi(config.USER_URL)
    const { permissionList } = useUtils()
    
    state.status = null
    state.viewGrid = true
    state.viewForm = false
    state.formType = null
    state.permissions = permissionList.value['user']

    if(!state.permissions.view){
        router.push({ 
                name: "dashboard",
                params: {
                    showPermissionAlert: true,
                    alertMessage: "You don't have permission to view user list.", 
                } 
            })   
    }

    get().then( () => {
        state.status = status.value

        if(status.value === 404){
            state.error = error.value
        }else{
            state.records = data.value?.data
        }        
    })

    return  {
        ...toRefs(state)
    }    
}

export const saveUser = () => {

    //reset form
    resetForm()

    //check permission 
    checkPermission('user')

    //validation object
    const validate = useVuelidate(VALIDATE.InviteUser, state.user)

    const submit = async () => {

        //validate
        validate.value.$touch()
        if (validate.value.$invalid) return

        if(!state.isUsernameAvailable) return

        if(!state.isEmailAvailable) return

        state.showLoadingIcon = true

        const { data, post, update, error } = useApi(
            config.USER_URL +  `${state.user.id ? state.user.id : "create"}`
        )

        let payload = {
            firstName    : state.user.firstName,
            lastName     : state.user.lastName,
            email        : state.user.email,
            userTypeId   : state.user.userTypeId,
            status       : state.user.status
        }
        
        if (state.user.id == null) {
            await post(payload)
        }else{
            await update(payload)
        }

        if(data.value.validation_errors){
            state.showLoadingIcon = false
            state.validationErrors = data.value.validation_errors
            return
        }

        if(!state.user.id){
            sendUserInvitatonEmail(data.value.data)
        }    
        state.alertMessage = state.user.id
        ? "User updated successfully."
        : "User created successfully.";
        // reset if no error
        state.showLoadingIcon = false
        state.isSaved         = true    
        state.validationErrors = null

        fetchUsers()


    }

    const checkUsername = () => {

        if(state.lastUsername === state.user.username) {
            state.isUsernameAvailable = true            
            return
        }

        const payload = {
            username : state.user.username
        }
        
        const { data, post } = useApi(config.USERNAME_CHECK_URL)

        post(payload).then( () => {
            if(data.value.status === 404){
                state.isUsernameAvailable = false
                state.usernameAvailableMessage = data.value.message
            }else{
                state.isUsernameAvailable = true
                state.usernameAvailableMessage = data.value.message                    
            }
        })
    }

    const checkEmail = () => {

        if(state.lastEmail === state.user.email) {
            state.isEmailAvailable = true
            return
        }

        const payload = {
            email : state.user.email
        }
        
        const { data, post } = useApi(config.EMAIL_CHECK_URL)

        post(payload).then( () => {
            if(data.value.status === 404){
                state.isEmailAvailable = false
                state.emailAvailableMessage = data.value.message
            }else{
                state.isEmailAvailable = true
                state.emailAvailableMessage = data.value.message                    
            }
        })
    }

    const goBack = () => {
        state.viewGrid = true
        state.viewForm = false
        state.formType = null
    }

    const sendUserInvitatonEmail = (token) => {
        
        const { post } = useApi(config.USER_INVITATION_EMAIL_URL)

        post({ token : token }).then()
    }


    return {
        validate,
        ...toRefs(state),
        submit,
        checkUsername,
        checkEmail,
        goBack
    }
}

export const readUser = (user) => {

    state.isSaved   = false
    state.isDeleted = false
    state.viewGrid  = false
    state.viewForm  = true
    state.formType = "edit"
    state.title = "Edit User"

    state.user.id          = user.id
    state.user.firstName   = user.firstName
    state.user.lastName    = user.lastName
    state.user.email       = user.email
    state.user.userTypeId  = user.userTypeId
    state.user.role        = user.role
    state.lastEmail        = user.email
    state.user.status      = user.status
}

export const showDeleteModal = (row) => {

    state.user.id = row.id

    cash("#delete-modal").modal("show")
}

export const confirmDelete = () => {

    let index = state.records.findIndex(item => item.id == state.user.id)

    useApi(config.USER_URL+ '/delete')
        .post({
            id : state.user.id
        })
        .then(() => {
            state.records.splice(index,1)
            state.isDeleted = true
        })
        .catch(() => {
            cash(".yr-danger").removeClass("hide").addClass("show")
        })
}

export const resetForm = () => {

    state.title = "Invite New User"
    state.user.id          = null
    state.user.firstName   = null
    state.user.lastName    = null
    state.user.email       = null
    state.user.username    = null
    state.user.userTypeId  = null
    state.records   = null
    state.error     = null
    state.status    = null   

}


const checkPermission = (modName) => {

    const { permissionList } = useUtils()

    state.permissions = permissionList.value[modName]

    if( 
        (state.formType == 'edit' && !state.permissions.edit)
        ||
        (state.formType =='create' && !state.permissions.create)
    ){
        router.push({ 
            name: "dashboard",
            params: {
                showPermissionAlert: true,
                alertMessage: "You don't have permission to add or edit user.", 
            }
        })
    }

}

export const showNotification = () => {
            $h.notification(state.error,state.alertMessage,state.validationErrors)
            state.isSaved = false
            state.error = false
            state.alertMessage = null
            state.validationErrors = null
}