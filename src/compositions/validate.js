import { 
    required, 
    email, 
    minLength,
    maxLength,
    helpers 
} from "@vuelidate/validators"

const Login = {
    username: { 
        required: helpers.withMessage('Username is required',required)
    },
    password: { 
        required: helpers.withMessage('Password is required',required) 
    },
}

const Register = {
    first_name: { 
        required: helpers.withMessage('First name is required',required)
    },
    last_name: { 
        required: helpers.withMessage('Last name is required',required) 
    },
    username: { 
        required : helpers.withMessage('Username is required',required) 
    },
    email_address: { 
        required : helpers.withMessage('Email is required',required), 
        email : helpers.withMessage('Invalid Email address',email)
    },
    password: {
        required : helpers.withMessage('Password is required',required)
    },
}

const RegisterInvitation = {

    username: { 
        required : helpers.withMessage('Username is required',required) 
    },
    password: {
        required : helpers.withMessage('Password is required',required)
    },
}

const ForgotPassword = {
    username: { 
        required : helpers.withMessage('Email address is required',required), 
        email : helpers.withMessage('Invalid email address',email)
    },
}

const ResetPassword = {    
    username: { 
        required : helpers.withMessage('Email address is required',required)
    },
    password: { 
        required : helpers.withMessage('Password is required',required)
    },
}

const MultiFactorVerify = {
    passcode: { 
        required : helpers.withMessage('Enter valid passcode',required),
    },
}

const Customer = {
    contact: {
        customer: { required },
        // mobileNumber: { required },
        // email: { required, email },
    },
    billing: {
        // addressLine1: { required },
        // city: { required },
        // state: { required },
        // zipCode: { required },
        // country: { required },
    },
    shipping: {
        // addressLine1: { required },
        // city: { required },
        // state: { required },
        // zipCode: { required },
        // country: { required },
    },
   
}

const Product = {
    name: { required },
    price: { required },
    description : { 
        maxLength : maxLength(60),
    },
}

const SalesTax = {
    taxName: { required },
    taxAbbreviation: { required },
    taxRate: { required },
}

const Business = {
    companyName: { 
        required : helpers.withMessage('Company name is required', required)
    },
    companyType: { 
        required : helpers.withMessage('Company type is required', required)
    },
    businessType: { 
        required : helpers.withMessage('Business type is required', required)
    },
    addressLine1: { 
        required : helpers.withMessage('Address is required', required)
    },
    country: { 
        required : helpers.withMessage('Country is required', required) 
    },
    state: { 
        required : helpers.withMessage('State is required', required)
    },    
    city: { 
        required : helpers.withMessage('City is required', required)
    },
    zipcode: { 
        required : helpers.withMessage('Zip code is required', required)
    },
    mobileNumber: { 
        required : helpers.withMessage('Mobile number is required', required) 
    },
    // phoneNumber: { 
    //     required : helpers.withMessage('Phone number is required', required)
    // }
}

const BusinessModal = {
    companyName: { 
        required : helpers.withMessage('Company is required', required)
    },
    // companyType: { 
    //     required : helpers.withMessage('Select company type', required)
    // },
    // businessType: { 
    //     required : helpers.withMessage('Select business type', required)
    // },
    addressLine1: { 
        required : helpers.withMessage('Address is required', required)
    },
    
    state: { 
        required : helpers.withMessage('State is required', required)
    },
    country: { 
        required : helpers.withMessage('Country is required', required) 
    },
    city: { 
        required : helpers.withMessage('City is required', required)
    },
    mobileNumber: { 
        required : helpers.withMessage('Mobile number is required', required) 
    },
    // phoneNumber: { 
    //     required : helpers.withMessage('Phone number is required', required)
    // },
}

const Setting = {
    // invoice_template: { required },
    invoice_title: { 
        required : helpers.withMessage("Invoice title is required",required) 
    },
    estimate_title: {
        required : helpers.withMessage("Estimate title is required",required)
    }
}


const Invoice = {
    customerId      : { 
        required : helpers.withMessage("Customer is required",required),
    },
    invoiceNumber   : { 
        required :  helpers.withMessage("Invoice number is required",required)
    }
}

const Estimate = {
    customerId      : { 
        required : helpers.withMessage("Customer is required",required),
    },
    estimateNumber   : { 
        required :  helpers.withMessage("Estimate number is required",required)
    }
}

const InviteUser = {
    firstName   : { 
        required : helpers.withMessage("First name is required",required)
    },
    lastName    : { 
        required : helpers.withMessage("Last name is required",required)
    },
    email       : { 
        required : helpers.withMessage("Email is required",required),
        email : helpers.withMessage("Email is invalid",email),
    },
    userTypeId  : { 
        required  : helpers.withMessage("User role is required",required),
    },
//    username    : { 
//        required  : helpers.withMessage("Username is required",required),
//    },
}


const AddPayment = {
    Credit : {    
        name : {required},
        amount: { required },        
        cardNumber : {required},
        cardCvv : {required},
        cardExpiry : {required},
    },
    Cash : {
        amount: { required },
    },
    CloverPOS : {
        amount: { required },
    },
    ACH : {
        amount: { required },
    }

}

const PaymentGateways = {
    Payeezy : {
        ApiKey: { 
            required : helpers.withMessage('Api key is required',required),
        },
        ApiSecret: { 
            required : helpers.withMessage('Api secret is required',required),
        },
        ApiToken: { 
            required : helpers.withMessage('Api token is required',required),
        }
    },
    Clover : {
        ApiToken: { 
            required : helpers.withMessage('Api token is required',required),
        }
    },

    Paypal : {
        ApiKey: { 
            required : helpers.withMessage('Api key is required',required),
        },
        ApiSecret: { 
            required : helpers.withMessage('Api secret is required',required),
        },
        // ApiToken: { 
        //     required : helpers.withMessage('Api token is required',required),
        // }
    },
    Stripe : {
        ApiKey: { 
            required : helpers.withMessage('Api key is required',required),
        },
        ApiSecret: { 
            required : helpers.withMessage('Api secret is required',required),
        },
        ApiToken: { 
            required : helpers.withMessage('Api token is required',required),
        }
    },

}

const SyncPastEVentFilter = {
    startDate      : { 
        required : helpers.withMessage("Start date is required",required),
    },
    endDate   : { 
        required :  helpers.withMessage("End date is required",required)
    },
    eventType   : { 
        required :  helpers.withMessage("Event type is required",required)
    }
}

const SyncFailed = {
    status   : { 
        required :  helpers.withMessage("Status",required)
    },
    type   : { 
        required :  helpers.withMessage("Type is required",required)
    }
}
    export function uniqueField(records = [], currentId = null, fieldName) {
        return helpers.withMessage(
            `${fieldName} must be unique`,
            (value) => {
                if (!value) return true
                const norm = String(value).trim().toLowerCase()
                return records
                    .filter(r => !(currentId != null && String(r.id) === String(currentId)))
                    .every(r => String(r[fieldName]).trim().toLowerCase() !== norm)
            }
        )
    }

    export function uniqueSalesTaxName(records = [], currentId = null) {
        return helpers.withMessage(
            'Tax name must be unique',
            (value) => {
                if (!value) return true
                const norm = value.trim().toLowerCase()
                return records
                .filter(r => !(currentId != null && String(r.id) === String(currentId)))
                .every(r => String(r.taxName).trim().toLowerCase() !== norm)
            }
        )
    }

    export function salesTaxRules(records, currentId) {
        return {
            taxName: {
                required: helpers.withMessage('Tax name is required', required),
                unique:   uniqueSalesTaxName(records, currentId)
            },
            taxAbbreviation: {
                required: helpers.withMessage('Abbreviation is required', required)
            },
            taxDescription: {
                required: helpers.withMessage('Description is required', required)
            },
            taxNumber: {
                required: helpers.withMessage('Tax number is required', required)
            },
            taxRate: {
                required: helpers.withMessage('Rate is required', required)
            }
        }
    }

    export function taxItemRules() {
        return {
            $each: {
                name: {
                    required: helpers.withMessage('Item name is required', required),
                    minLength: helpers.withMessage('Name must be at least 3 characters', minLength(3)),
                },
                rate: {
                    required: helpers.withMessage('Item rate is required', required),
                    numeric:  helpers.withMessage('Rate must be numeric', helpers.regex(/^[0-9]*\.?[0-9]+$/)),
                    notZero:  helpers.withMessage('Rate must be greater than zero', (v) => {
                        const num = parseFloat(String(v).replace('%',''))
                        return !isNaN(num) && num > 0
                    }),
                },
            },
        }
    }

    export function customerRules(records = [], currentId = null) {
        return {
        customer: {
            required: helpers.withMessage('Customer name is required', required),
            unique:   uniqueField(records, currentId, 'customer'),
        },
        };
    }

const VALIDATE = {
    Login,
    Register,
    RegisterInvitation,
    ForgotPassword,
    ResetPassword,
    MultiFactorVerify,
    Customer,
    Product,
    SalesTax,
    Business,
    BusinessModal,
    Setting,
    Invoice,
    Estimate,
    InviteUser,
    AddPayment,
    PaymentGateways,
    SyncPastEVentFilter,
    SyncFailed,
    uniqueField,
    customerRules,
    uniqueSalesTaxName,
    salesTaxRules,
    taxItemRules,
}

export default VALIDATE