<script>
export default {
    name: 'Account'
}
</script>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useApi from '@/composables/useApi.js';
import PageTitle from '@/components/PageTitle.vue';
import AccountUpdateForm from '@/components/account/AccountUpdateForm.vue';
import AccountDetailsLayout from '@/components/account/AccountDetailsLayout.vue';
import BunnyImage from '@/components/BunnyImage.vue';
import {
    FigModal,
    FigIcon,
    FigOverlay,
    FigLabelValueGroup,
    FigLabelValue,
    FigButton,
    FigPopConfirm,
    FigNuxtImgBunny,
    FigUseToaster
} from '@notoursllc/figleaf';

const { t } = useI18n();
const $api = useApi();
const { showSuccessToast, showErrorToast } = FigUseToaster();

const account = ref({});
const loading = ref(false);
const loadingApiInfo = ref(false);
const account_upsert_modal = ref(null);
const form = reactive({
    accountId: null
});

async function fetchData() {
    try {
        const resposne = await $api.account.get();
        account.value = resposne?.data || {};
    }
    catch(e) {
        showErrorToast({
            title: t('Error'),
            text: e.message
        });
    }
}

async function onUpdateApiKey() {
    try {
        loadingApiInfo.value = true;
        await $api.account.updateApiKey();

        showSuccessToast({
            title: t('Success'),
            text: t('API key has been created')
        });

        fetchData();
    }
    catch(e) {
        showErrorToast({
            title: t('Error'),
            text: e.message
        });
    }
    finally {
        loadingApiInfo.value = false;
    }
}

async function onDeleteApiKey() {
    try {
        loadingApiInfo.value = true;
        await $api.account.deleteApiKey();

        showSuccessToast({
            title: t('Success'),
            text: t('API key has been deleted')
        });

        this.fetchData();
    }
    catch(e) {
        showErrorToast({
            title: t('Error'),
            text: e.message
        });
    }
    finally {
        loadingApiInfo.value = false;
    }
}

function onFormSaved() {
    fetchData();
    showModal(false);
}

function showModal(show) {
    show === false ? account_upsert_modal.value.hide() : account_upsert_modal.value.show();
}

function onUpdate() {
    showModal();
}

onMounted(() => {
    fetchData();
});
</script>


<template>
    <page-title>{{ $t('Account') }}</page-title>

    <div>
        <fig-overlay :show="loading">
            <account-details-layout>
                <template v-slot:application_name>{{ account.application_name }}</template>
                <template v-slot:application_url>{{ account.application_url }}</template>
                <template v-slot:application_logo>
                    <bunny-image
                        v-if="account.application_logo"
                        :src="account.application_logo"
                        preset="w150"
                        loading="lazy"
                        class="shadow" />
                </template>
                <template v-slot:order_details_page_url>
                    <div>{{ account.order_details_page_url }}</div>
                </template>
                <!-- <template v-slot:api_key>
                    <fig-overlay :show="loadingApiInfo">
                        {{ account.api_key_public }}

                        <div class="mt-3">
                            <fig-pop-confirm @confirm="onDeleteApiKey">
                                {{ $t('Delete the API key?') }}

                                <template v-slot:reference>
                                    <fig-button
                                        v-if="account.api_key_public"
                                        variant="danger"
                                        size="sm">{{ $t('Delete') }}</fig-button>
                                </template>
                            </fig-pop-confirm>

                            <fig-pop-confirm @confirm="onUpdateApiKey">
                                {{ $t('Create a new API key?') }}

                                <template v-slot:reference>
                                    <fig-button
                                        variant="plain"
                                        size="sm"
                                        class="ml-2">{{ $t('Create new') }}</fig-button>
                                </template>
                            </fig-pop-confirm>
                        </div>
                    </fig-overlay>
                </template> -->
                <!-- <template v-slot:paypal_client_id>{{ account.paypal_client_id }}</template> -->
                <template v-slot:stripe_api_key>{{ account.stripe_key }}</template>
                <template v-slot:shipengine_api_key>{{ account.shipengine_api_key }}</template>
                <template v-slot:shipengine_carriers>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div
                            v-for="(obj, idx) in account.shipengine_carriers"
                            :key="idx"
                            class="rounded-md bg-gray-100 p-2">
                            <div>
                                <div class="mb-2">
                                    <div class="text-gray-500">{{ $t('ID') }}:</div>
                                    {{ obj.id }}
                                </div>

                                <div class="mb-2">
                                    <div class="text-gray-500">{{ $t('Service code (domestic)') }}:</div>
                                    {{ obj.service_codes.domestic }}
                                </div>

                                <div>
                                    <div class="text-gray-500">{{ $t('Service code (international)') }}:</div>
                                    {{ obj.service_codes.international }}
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-slot:shipping_from_company>{{ account.shipping_from_company }}</template>
                <template v-slot:shipping_from_streetAddress>{{ account.shipping_from_streetAddress }}</template>
                <template v-slot:shipping_from_city>{{ account.shipping_from_city }}</template>
                <template v-slot:shipping_from_state>{{ account.shipping_from_state }}</template>
                <template v-slot:shipping_from_postalCode>{{ account.shipping_from_postalCode }}</template>
                <template v-slot:shipping_from_countryCodeAlpha2>{{ account.shipping_from_countryCodeAlpha2 }}</template>
                <template v-slot:shipping_from_phone>{{ account.shipping_from_phone }}</template>
                <template v-slot:supported_currencies>
                    {{ Array.isArray(account.supported_currencies) ? account.supported_currencies.join(', ') : null }}
                </template>
                <template v-slot:default_currency>{{ account.default_currency }}</template>

                <template v-slot:button>
                    <fig-button
                        variant="primary"
                        @click="onUpdate">{{ $t('Edit') }}</fig-button>
                </template>
            </account-details-layout>
        </fig-overlay>


        <!-- add/upsert modal -->
        <fig-modal
            ref="account_upsert_modal"
            size="xl">

            <template v-slot:header>
                {{ $t('Edit account') }}
            </template>

            <account-update-form
                @saved="onFormSaved" />
        </fig-modal>
    </div>
</template>

