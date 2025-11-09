import { createWebHistory, createRouter } from "vue-router"

import  { alreadyLoggedinGuard, authGuard, userInvitationGuard } from "@/middleware"

import SideMenu from "@/layouts/side-menu/Main.vue"
import IconMenu from "@/layouts/icon-menu/Main.vue"
import HealthCheck from "@/views/HealthCheck.vue"
import Login from "@/views/auth/Login.vue"
import Register from "@/views/auth/Register.vue"
import InviteUserLogin from "@/views/auth/invite-user/Login.vue"
import InviteUserRegister from "@/views/auth/invite-user/Register.vue"

import ForgotPassword from "@/views/auth/ForgotPassword.vue"
import ResetPassword from "@/views/auth/ResetPassword.vue"
import VerifyMultiFactor from "@/views/auth/MultiFactor-Auth.vue"
import ErrorPage from "@/views/error-page/Main.vue"

import OnBoarding from "@/views/auth/OnBoarding.vue"

import Dashboard from "@/views/dashboard/Main.vue"

import Customers from "@/views/customers/Main.vue"
import CustomersForm from "@/views/customers/CreateForm.vue"

import Products from "@/views/products/Main.vue"
import ProductsForm from "@/views/products/CreateForm.vue"

import UserProfile from "@/views/profile/EditProfile.vue"
import UserPassword from "@/views/profile/SetPassword.vue"

import Businesses from "@/views/profile/businesses/Main.vue"
import BusinessesForm from "@/views/profile/businesses/CreateForm.vue"

import UserManagement from "@/views/settings/user/Main.vue"

import SalesTaxManagement from "@/views/settings/sales-tax/Main.vue"
import SalesTaxManagementForm from "@/views/settings/sales-tax/CreateForm.vue"

import InvoiceCustomizationForm from "@/views/settings/invoice/Main.vue"
import InvoiceColumns from "@/views/settings/invoice/InvoiceColumn.vue"
import InvoiceReminders from "@/views/settings/invoice/Reminders.vue"
import DateCurrency from "@/views/settings/invoice/Date-Currency.vue"
import multiFactorAuth from "@/views/settings/multifactor-auth/Main.vue"
import creditCard from "@/views/settings/credit-card/Main.vue"
import Integrations from "@/views/settings/integration/Main.vue"
import IntuitIntegration from "@/views/settings/integration/intuit/Main.vue"
import IntuitSuccessfulResponse from "@/views/settings/integration/intuit/Successful.vue"

import PosSettings from "@/views/settings/integration/clover/Setting.vue"
import CloverSuccessfulResponse from "@/views/settings/integration/clover/Successful.vue"

import PaymentTypes from "@/views/settings/payment-types/Main.vue"
import PaymentTypesForm from "@/views/settings/payment-types/CreateForm.vue"

import PublicInvoiceView from "@/views/links/invoices/view/Main.vue"

import Invoices from "@/views/invoices/grid/Main.vue"
import InvoiceForm from "@/views/invoices/form/InvoiceForm.vue"
import ViewInvoice from "@/views/invoices/view/Main.vue"

import Estimates from "@/views/estimates/grid/Main.vue"
import EstimateForm from "@/views/estimates/form/EstimateForm.vue"
import ViewEstimate from "@/views/estimates/view/Main.vue"
import SocialCallback from "@/views/auth/SocialCallback.vue"

const routes = [
    {
        path: "/healthcheck",
        name: "healthcheck",
        component: HealthCheck,
    },
    {
        path: "/public/view-invoice/:uid",
        name: "publicInvoiceView",
        component: PublicInvoiceView,
        meta: {
            title: 'View Invoice',
        },
    },
    {
        path: "/intuit-success",
        name: "intuitSuccessfulResponse",
        component: IntuitSuccessfulResponse,
    },
    {
        path: "/clover-device-success",
        name: "cloverSuccessfulResponse",
        component: CloverSuccessfulResponse,
    },    
    {
        path: "/",
        name: "default",
        component: Login,
        beforeEnter: alreadyLoggedinGuard,
        meta: {
            title: 'Login',
        },
    },
    {
        path: "/login",
        name: "login",
        component: Login,
        beforeEnter: alreadyLoggedinGuard,
        meta: {
            title: 'Login',
        },
    },
    {
        path: "/register/",
        name: "register",
        component: Register,
        beforeEnter: alreadyLoggedinGuard,
        meta: {
            title: 'Sign up',
        },
    },
    {
        path: "/auth/:provider/callback",
        name: "social-callback",
        component: SocialCallback,
        beforeEnter: alreadyLoggedinGuard,
    },    
    {
        path: "/login/:token",
        name: "invite-user-login",
        component: InviteUserLogin,
        beforeEnter: userInvitationGuard,
    },
    {
        path: "/register/:token",
        name: "invite-user-register",
        component: InviteUserRegister,
        beforeEnter: userInvitationGuard,
    },
    {
        path: "/forgot-password",
        name: "forgot-password",
        component: ForgotPassword,
        beforeEnter: alreadyLoggedinGuard,
        meta: {
            title: 'Forgot password',
        },
    },
    {
        path: "/reset-password/:token/:username",
        name: "reset-password",
        component: ResetPassword,
        beforeEnter: alreadyLoggedinGuard,
        meta: {
            title: 'Reset password',
        },
    },
    {
        path: "/onboarding",
        name: "onboarding",
        component: OnBoarding,
        beforeEnter: alreadyLoggedinGuard,
        meta: {
            title: 'Onboarding',
        },
        
    },    
    {
        path: "/multifactor-authentication",
        name: "multifactor-authentication",
        component: VerifyMultiFactor,
        beforeEnter: authGuard,
        meta: {
            title: 'Multifactor authentication',
        },
    },            
    {
        path: "/error-page",
        name: "error-page",
        component: ErrorPage,
        meta: {
            title: '404 page not found',
        },
    },
    {
        path: "/:pathMatch(.*)*",
        component: ErrorPage,
        meta: {
            title: '404 page not found',
        },
    },
    {
        path: "/",
        component: IconMenu,
        children: [

            {
                path: "/:businessId?/invoice/add",
                name: "add-invoice",
                component: InvoiceForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Create invoice',
                },
            },
            {
                path: "/:businessId?/invoice/:uid/edit",
                name: "edit-invoice",
                component: InvoiceForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Edit Invoice',
                },
            },
            {
                path: "/:businessId?/invoice/:uid/view",
                name: "view-invoice",
                component: ViewInvoice,
                beforeEnter: authGuard,
                meta: {
                    title: 'View Invoice',
                },
            },
        ]
    },

    {
        path: "/",
        component: SideMenu,
        children: [
            {
                path: "/:businessId?/dashboard",
                name: "dashboard",
                component: Dashboard,
                beforeEnter: authGuard,
                props: true,
                meta: {
                    title: 'Dashboard',
                },

            },
            //customers
            {
                path: "/customers",
                name: "customers",
                component: Customers,
                beforeEnter: authGuard,
                meta: {
                    title: 'Customers',
                },
            },
            {
                path: "/:businessId?/customer/add",
                name: "add-customer",
                component: CustomersForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Create customer',
                },
            },
            {
                path: "/:businessId?/customer/:id/edit",
                name: "edit-customer",
                component: CustomersForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Edit customer',
                },
            },
            //products
            {
                path: "/:businessId?/product-services",
                name: "product-services",
                component: Products,
                beforeEnter: authGuard,
                meta: {
                    title: 'Products & Services',
                  },
            },
            {
                path: "/:businessId?/product/add",
                name: "add-product",
                component: ProductsForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Add new product',
                },
            },
            {
                path: "/:businessId?/product/:id/edit",
                name: "edit-product",
                component: ProductsForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Edit product',
                },
            },
            //User Profile
            {
                path: "/:businessId?/user/profile",
                name: "user-profile",
                component: UserProfile,
                beforeEnter: authGuard,
                meta: {
                    title: 'User Profile',
                },
            },
            //User Password Setting
            {
                path: "/:businessId?/user/password",
                name: "user-password",
                component: UserPassword,
                beforeEnter: authGuard,
                meta: {
                    title: 'Edit password',
                },
            },
            // businesses
            {
                path: "businesses",
                name: "businesses",
                component: Businesses,
                beforeEnter: authGuard,
                meta: {
                    title: 'Businesses',
                },
            },
            {
                path: "/businesses/add",
                name: "add-businesses",
                component: BusinessesForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Add new business',
                },
            },
            {
                path: "/businesses/:business_id/edit",
                name: "edit-businesses",
                component: BusinessesForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Edit business',
                },
            },
            //Invoices
            {
                path: "/:businessId?/invoices",
                name: "invoices",
                component: Invoices,
                beforeEnter: authGuard,
                meta: {
                    title: 'Invoices',
                },
            },            

            //Estimates
            {
                path: "/:businessId?/estimates",
                name: "estimates",
                component: Estimates,
                beforeEnter: authGuard,
                meta: {
                    title: 'Estimates',
                },
            },            
            {
                path: "/:businessId?/estimate/add",
                name: "add-estimate",
                component: EstimateForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Create estimate',
                },
            },
            {
                path: "/:businessId?/estimate/:uid/edit",
                name: "edit-estimate",
                component: EstimateForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Edit estimate',
                },
            },
            {
                path: "/:businessId?/estimate/:uid/view",
                name: "view-estimate",
                component: ViewEstimate,
                beforeEnter: authGuard,
                meta: {
                    title: 'View estimate',
                },
            },            

            //settings
            //user management
            {
                path: "/settings/user-management",
                name: "user-management",
                component: UserManagement,
                beforeEnter: authGuard,
                meta: {
                    title: 'User management',
                },
            },
            //sales tax management
            {
                path: "/settings/sales-tax",
                name: "sales-tax",
                component: SalesTaxManagement,
                beforeEnter: authGuard,
                meta: {
                    title: 'Sales tax',
                },
            },
            {
                path: "/settings/sales-tax/add",
                name: "add-sales-tax",
                component: SalesTaxManagementForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Add Sales Tax',
                },
            },
            {
                path: "/settings/sales-tax/:tax_id/edit",
                name: "edit-sales-tax",
                component: SalesTaxManagementForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Edit sales tax',
                },
            },
            // invoice customization
            {
                path: "/settings/invoice-customization",
                name: "invoice-customization",
                component: InvoiceCustomizationForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Invoice Customization',
                },
            },            
            {
                path: "/settings/invoice-columns",
                name: "invoice-columns",
                component: InvoiceColumns,
                beforeEnter: authGuard,
                meta: {
                    title: 'Invoice Field Names',
                },
            },                   
            {
                path: "/settings/invoice-reminders",
                name: "invoice-reminders",
                component: InvoiceReminders,
                beforeEnter: authGuard,
                meta: {
                    title: 'Invoice reminders',
                },
            },                
            {
                path: "/settings/date-currency",
                name: "date-currency",
                component: DateCurrency,
                beforeEnter: authGuard,
                meta: {
                    title: 'Date & Currency',
                },
            },
            {
                path: "/settings/multifactor-auth",
                name: "multifactor-auth",
                component: multiFactorAuth,
                beforeEnter: authGuard,
                meta: {
                    title: 'Multifactor auth',
                },
            },
            {
                path: "/settings/payment-gateway",
                name: "credit-card",
                component: creditCard,
                beforeEnter: authGuard,
                meta: {
                    title: 'Credit card',
                },
            },
            {
                path: "/settings/integrations",
                name: "integrations",
                component: Integrations,
                beforeEnter: authGuard,
                meta: {
                    title: 'Intuit integration',
                },
            },
            {
                path: "/settings/intuit-integration",
                name: "intuit-integration",
                component: IntuitIntegration,
                beforeEnter: authGuard,
                meta: {
                    title: 'Intuit integration',
                },
            },                                                           
            {
                path: "/settings/pos-setting",
                name: "pos-setting",
                component: PosSettings,
                beforeEnter: authGuard,
                meta: {
                    title: 'POS setting',
                },
            },
            //payment types
            {
                path: "/settings/payment-types",
                name: "payment-types",
                component: PaymentTypes,
                beforeEnter: authGuard,
                meta: {
                    title: 'Payment types',
                },
            },
            {
                path: "/settings/payment-types/add",
                name: "add-payment-types",
                component: PaymentTypesForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Add new payment type',
                },
            },
            {
                path: "/settings/payment-types/:type_id?/edit",
                name: "edit-payment-types",
                component: PaymentTypesForm,
                beforeEnter: authGuard,
                meta: {
                    title: 'Edit payment type',
                },
            },                                                                        
        ],
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { left: 0, top: 0 }
    },
    
})

router.updateMeta = (routeName, newMeta) => {
    const route = router.getRoutes().find((r) => r.name === routeName);
    if (route) {
      Object.assign(route.meta, newMeta);
    }
  };

window.router = router

export default router