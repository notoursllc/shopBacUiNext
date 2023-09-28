<script>
export default {
    name: 'AccountUpdateForm'
}
</script>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useApi from '@/composables/useApi.js';
import AccountDetailsLayout from '@/components/account/AccountDetailsLayout.vue';
import {
    FigButton,
    FigOverlay,
    FigFormText,
    FigPopConfirm,
    FigSelectCountry,
    FigSelectStateProvince,
    FigUseToaster
} from '@notoursllc/figleaf';

const $api = useApi();
const { t } = useI18n();
const { showErrorToast } = FigUseToaster();

const props = defineProps({
    id: {
        type: String
    }
});

const emit = defineEmits([
    'saved'
]);

const loading = ref(false);
const form = reactive({
    application_name: null,
    application_url: null,
    application_logo: null,
    order_details_page_url: null,
    stripe_key: null,
    shipengine_api_key: null,
    shipengine_carriers: [],
    shipping_from_company: null,
    shipping_from_streetAddress: null,
    shipping_from_city: null,
    shipping_from_state: null,
    shipping_from_postalCode: null,
    shipping_from_countryCodeAlpha2: null,
    shipping_from_phone: null,
});

async function fetchAccount() {
    try {
        loading.value = true;

        const response = await $api.account.get();

        if(!response.data) {
            throw new Error(t('Item not found'));
        }

        for(let key in response.data) {
            if(form.hasOwnProperty(key)) {
                form[key] = response.data[key];
            }
        }
    }
    catch(e) {
        showErrorToast({
            title: t('Error'),
            text: e.message
        });
    }
    finally {
        loading.value = false;
    }
}

async function onSave(event) {
    try {
        loading.value = true;

        await $api.account.update({
            ...form
        });

        emit('saved');
    }
    catch(e) {
        showErrorToast({
            title: t('Error'),
            text: e.message
        });
    }
    finally {
        loading.value = false;
    }
}

function addCarrier() {
    if(!Array.isArray(form.shipengine_carriers)) {
        form.shipengine_carriers = [];
    }

    form.shipengine_carriers.push({
        id: null,
        service_codes: {
            domestic: null,
            international: null
        }
    })
}

async function onLogoChange(event) {
    // event.target.files is a FileList object
    // https://developer.mozilla.org/en-US/docs/Web/API/FileList
    const files = event.target.files;

    if (!files.length) {
        return;
    }

    form.application_logo = files[0];
}

function onDeleteCarrier(idx) {
    form.shipengine_carriers.splice(idx, 1);
}

onMounted(() => {
    fetchAccount();
});
</script>


<template>
    <fig-overlay :show="loading">
        <form @submit.prevent="onSave">
            <account-details-layout>
                <template v-slot:application_name>
                    <fig-form-text
                        v-model="form.application_name" />
                </template>

                <template v-slot:application_url>
                    <fig-form-text
                        v-model="form.application_url" />
                </template>

                <template v-slot:application_logo>
                    <input
                        accept="image/*"
                        :multiple="false"
                        type="file"
                        :placeholder="$t('No file chosen')"
                        @input="onLogoChange" />
                </template>

                <template v-slot:order_details_page_url>
                    <fig-form-text v-model="form.order_details_page_url" />
                    <div class="text-sm text-gray-400">
                        {{ $t('order_details_page_url_token_tip') }}
                    </div>
                </template>

                <template v-slot:stripe_api_key>
                    <fig-form-text
                        v-model="form.stripe_key" />
                </template>

                <template v-slot:shipengine_api_key>
                    <fig-form-text
                        v-model="form.shipengine_api_key" />
                </template>

                <template v-slot:shipengine_carriers>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div
                            v-for="(obj, idx) in form.shipengine_carriers"
                            :key="idx"
                            class="rounded-md bg-gray-100 p-2">
                            <div>
                                <div class="mb-2">
                                    <div class="text-gray-500">{{ $t('ID') }}:</div>
                                    <fig-form-text v-model="obj.id" />
                                </div>

                                <div class="mb-2">
                                    <div class="text-gray-500">{{ $t('Service code (domestic)') }}:</div>
                                    <fig-form-text v-model="obj.service_codes.domestic" />
                                </div>

                                <div>
                                    <div class="text-gray-500">{{ $t('Service code (international)') }}:</div>
                                    <fig-form-text v-model="obj.service_codes.international" />
                                </div>
                            </div>

                            <div class="pt-4 text-right">
                                <fig-pop-confirm @confirm="onDeleteCarrier(idx)">
                                    {{ $t('Delete this item?') }}

                                    <template v-slot:reference>
                                        <fig-button
                                            variant="plain"
                                            size="sm"
                                            icon="trash">{{ $t('Remove') }}</fig-button>
                                    </template>
                                </fig-pop-confirm>
                            </div>
                        </div>
                    </div>
                    <div class="pt-4">
                        <fig-button
                            variant="plain"
                            @click="addCarrier">{{ $t('Add carrier') }}</fig-button>
                    </div>
                </template>

                <template v-slot:shipping_from_company>
                    <fig-form-text
                        v-model="form.shipping_from_company" />
                </template>

                <template v-slot:shipping_from_countryCodeAlpha2>
                    <fig-select-country
                        v-model="form.shipping_from_countryCodeAlpha2"
                        :clearable="false" />
                </template>

                <template v-slot:shipping_from_streetAddress>
                    <fig-form-text
                        v-model="form.shipping_from_streetAddress" />
                </template>

                <template v-slot:shipping_from_city>
                    <fig-form-text
                        v-model="form.shipping_from_city" />
                </template>

                <template v-slot:shipping_from_state>
                    <fig-select-state-province
                        v-model="form.shipping_from_state"
                        :country="form.shipping_from_countryCodeAlpha2"
                        :clearable="false" />
                </template>

                <template v-slot:shipping_from_postalCode>
                    <fig-form-text
                        v-model="form.shipping_from_postalCode" />
                </template>

                <template v-slot:shipping_from_phone>
                    <fig-form-text
                        v-model="form.shipping_from_phone" />
                </template>

                <template v-slot:button>
                    <fig-button
                        variant="primary"
                        @click="onSave">{{ $t('Save') }}</fig-button>
                </template>
            </account-details-layout>
        </form>
    </fig-overlay>
</template>
