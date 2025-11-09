<template>
<div id="edit-business-modal" class="modal" data-backdrop="static" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-md">
    <form method="POST" @submit.prevent="$emit('submitBusiness')">
        <div class="modal-content">
            <!-- BEGIN: Modal Header -->
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Edit Business Detail</h2>
                <Lucide icon="X" class="w-8 h-8 cursor-pointer" @click="closeModal"/>
            </div>
            <!-- END: Modal Header -->
            <!-- BEGIN: Modal Body -->
            <div class="modal-body grid grid-cols-12 gap-4 gap-y-2">

                <div class="col-span-12 alert alert-danger-soft show mb-2" v-if="validationErrors.$errors.length > 0">
                    <ul>
                        <li v-for="error of validationErrors.$errors" :key="error.$uid">
                            {{ error.$message }}
                        </li>
                    </ul>
                    <button type="button" class="absolute right-2 top-2 bg-white px-2 py-1 rounded" 
                    @click="validationErrors.$errors = null">
                        <Lucide icon="X" class="w-4 h-4" />
                    </button>
                </div>

                <div class="col-span-12">
                    <label for="company-name" class="form-label hidden">Company Name</label>
                    <input
                        v-model="business.companyName" 
                        type="text" 
                        class="form-control" 
                        placeholder="Company name"
                        :class="{'border-theme-6': validationErrors.companyName.$error}" 
                        />
                </div>

                <div class="col-span-12">
                    <label for="address-line1" class="form-label hidden">Address Line 1</label>
                    <input
                        v-model="business.addressLine1"
                        type="text"
                        class="form-control"
                        placeholder="Address Line 1" 
                        :class="{'border-theme-6': validationErrors.addressLine1.$error}"/>
                </div>

                <div class="col-span-12">
                    <label for="address-line2" class="form-label hidden">Address Line 2</label>
                    <input
                        v-model="business.addressLine2"
                        type="text"
                        class="form-control"
                        placeholder="Address Line 2" />
                </div>

                <div class="col-span-12 sm:col-span-6">
                    <label for="country" class="form-label hidden">Country</label>
                    <TomSelect
                        v-model="business.country"
                        :options="{
                            search: true,
                            classNames: 'w-full',
                        }"
                        :class="{'border-theme-6': validationErrors.country.$error}">
                        <option>Select country</option>
                        <option
                            v-for="(country, key) in countries"
                            :key="key" :value="country.code">
                            {{ country.name }}
                        </option>
                    </TomSelect>
                </div>

                <div class="col-span-12 sm:col-span-6">
                    <label for="state" class="form-label hidden">State</label>
                    <TomSelect
                        v-model="business.state"
                        :options="{
                            search: true,
                            classNames: 'w-full',
                        }"
                        :class="{'border-theme-6': validationErrors.state.$error}">
                        <option
                            v-for="state in holdStates"
                            :key="state.id"
                            :value="state.state_code">
                            {{ state.name }}
                        </option>
                    </TomSelect>
                </div>

                <div class="col-span-12 sm:col-span-6">
                    <label for="city" class="form-label hidden">City</label>
                    <input
                        v-model="business.city"
                        type="city"
                        class="form-control"
                        placeholder="City" 
                        :class="{'border-theme-6': validationErrors.city.$error}"/>
                </div>

                <div class="col-span-12 sm:col-span-6">
                    <label for="zip-code" class="form-label hidden">Zip Code</label>
                    <input
                        v-model="business.zipcode"
                        type="text"
                        class="form-control"
                        placeholder="Zip Code" />
                </div>

                <div class="col-span-12 sm:col-span-6">
                    <label for="mobile-number" class="form-label hidden">Mobile Number</label>
                    <input
                        v-model="business.mobileNumber"
                        type="text"
                        class="form-control"
                        placeholder="Mobile Number"
                        :class="{'border-theme-6': validationErrors.mobileNumber.$error}" />
                </div>

                <div class="col-span-12 sm:col-span-6">
                    <label for="mobile-number" class="form-label hidden">Phone Number</label>
                    <input
                        v-model="business.phoneNumber"
                        type="text"
                        class="form-control"
                        placeholder="Phone Number"
                        />
                </div>

                <div class="col-span-12 sm:col-span-6">
                    <label for="fax" class="form-label hidden">Fax</label>
                    <input
                        v-model="business.fax"
                        type="text"
                        class="form-control"
                        placeholder="Fax" />
                </div>

                <div class="col-span-12 sm:col-span-6">
                    <label for="website" class="form-label hidden">Website</label>
                    <input
                        v-model="business.website"
                        type="text"
                        class="form-control"
                        placeholder="Website url" />
                </div>
            </div>
            <!-- END: Modal Body -->
            <!-- BEGIN: Modal Footer -->
            <div class="modal-footer text-left">
                <button 
                    type="button" 
                    class="btn btn-primary w-20 mr-1"
                    :class="{'disable' : showLoadingIcon}"
                    :disabled="showLoadingIcon" 
                    @click="$emit('submitBusiness')">
                    <span v-if="!showLoadingIcon">Save</span>
                    <LoadingIcon icon="oval" color="white" class="w-5 h-5" v-if="showLoadingIcon" />
                </button>
                <button type="button" class="btn btn-outline-secondary w-20"
                    @click="closeModal">
                    Cancel
                </button>
            </div>
            <!-- END: Modal Footer -->
        </div>
    </form>

    </div>
</div>

</template>

<script>
import { defineComponent, ref, watchEffect, computed } from "vue"
import cash from "cash-dom"

export default defineComponent({
    props : ['records','countries','states','validate','saved','showLoadingIcon'],
    setup(props) {
        const business  = props.records
        const countries = props.countries
        const states    = props.states
        const showLoadingIcon = ref(props.showLoadingIcon)
        const validationErrors = ref(props.validate)

        const closeModal = () => {
            cash("#edit-business-modal").modal('hide')
            showLoadingIcon.value= false
        }

        const holdStates = computed(() => {
          return states.filter(st => st.country_code == business.country)
        })


        watchEffect(() => { if(props.saved) closeModal() })

        watchEffect(() => { if(props.validate.$errors) validationErrors.value = props.validate })

        watchEffect(() => { if(props.showLoadingIcon) showLoadingIcon.value = props.showLoadingIcon })

        watchEffect( () => { return business.country}, holdStates)
        
        return {
            business,
            countries,
            holdStates,
            closeModal,
            validationErrors,
            showLoadingIcon,
        }
    }

})
</script>