<script>
export default {
    name: 'ExchangeRates'
}
</script>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useApi from '@/composables/useApi.js';
import { VueDraggableNext as draggable } from 'vue-draggable-next';
import {
    FigOverlay,
    FigButton,
    FigUseToaster,
    FigTableSimple,
    FigTh,
    FigTr,
    FigTd,
    FigTrNoResults,
    FigFormCheckbox,
    FigFormSelectNative,
    FigIcon,
    FigFormat8601,
    FigSpecLayout,
    FigSpec
} from '@notoursllc/figleaf';

const $api = useApi();
const { t } = useI18n();
const { showSuccessToast, showErrorToast } = FigUseToaster();

const rate = ref({});
const account = ref({});
const loading = ref(false);

async function fetchData() {
    try {
        const response = await $api.exchangeRate.get();
        rate.value = response?.data || {};
    }
    catch(e) {
        showErrorToast({
            title: t('Error'),
            text: e.message
        });
    }
}

async function fetchAccount() {
    try {
        const response = await $api.account.get();
        account.value = response?.data || {};

        if (!account.value.supported_currencies) {
            account.value.supported_currencies = [];
        }
    }
    catch(e) {
        showErrorToast({
            title: t('Error'),
            text: e.message
        });
    }
}

const defaultCurrencySelectOptions = computed(() => {
    if (!rate.value?.rates) {
        return [];
    }

    return account.value.supported_currencies?.map(currency => ({
        label: currency,
        value: currency
    })) || [];
});

async function onSave() {
    try {
        loading.value = true;

        await $api.account.update({
            supported_currencies: account.value.supported_currencies,
            default_currency: account.value.default_currency
        });

        showSuccessToast({
            title: t('Changes saved')
        });
    }
    catch(e) {
        showErrorToast({
            title: text('Error'),
            text: e.message
        });
    }
    finally {
        loading.value = false;
    }
}

onMounted(() => {
    fetchData();
    fetchAccount();
});
</script>

<template>
    <fig-overlay :show="loading">
        <fig-spec-layout>
            <!-- Default currency -->
            <fig-spec>
                <template v-slot:label>{{ $t('Default currency') }}</template>
                <fig-form-select-native
                    v-model="account.default_currency"
                    :options="defaultCurrencySelectOptions"
                    mode="single"
                    searchable
                    :can-clear="false" />
            </fig-spec>

            <!-- Display order -->
            <fig-spec>
                <template v-slot:label>{{ $t('Display order of currency list') }}</template>
                <fig-table-simple
                    striped
                    hover>
                    <template v-slot:belowTbody>
                        <draggable
                            :list="account.supported_currencies"
                            ghost-class="ghost"
                            handle=".handle"
                            tag="tbody">
                            <fig-tr v-for="(currency, idx) in account.supported_currencies" :key="idx">
                                <!-- handle -->
                                <fig-td v-if="account.supported_currencies.length > 1" class="align-middle">
                                    <i class="handle">
                                        <fig-icon icon="dots-vertical-double" />
                                    </i>
                                </fig-td>

                                <!-- currency -->
                                <fig-td>
                                    {{ currency }}
                                </fig-td>
                            </fig-tr>
                        </draggable>
                    </template>
                </fig-table-simple>
            </fig-spec>


            <!-- Rates -->
            <fig-spec>
                <template v-slot:label>{{ $t('Rates') }}</template>
                <div class="mb-4">
                    <div>{{ $t('Exchange rates refreshed at') }}:</div>
                    <fig-format-8601 :date="rate.created_at" />
                </div>

                <fig-table-simple
                    striped
                    hover>
                    <template v-slot:head>
                        <fig-tr>
                            <fig-th class="w-20">{{ $t('Use') }}</fig-th>
                            <fig-th sortable prop="name" class="text-left">{{ $t('Currency') }}</fig-th>
                            <fig-th sortable prop="slug" class="text-right">{{ $t('Exchange rate') }}</fig-th>
                        </fig-tr>
                    </template>

                    <fig-tr
                        v-for="(exchangeRate, currency) in rate.rates"
                        :key="currency"
                        :class="{'bg-green-100': account.supported_currencies?.includes(currency)}">

                        <fig-td class="text-center">
                            <fig-form-checkbox
                                v-model="account.supported_currencies"
                                :value="currency" />
                        </fig-td>

                        <fig-td>
                            {{ currency }}
                        </fig-td>

                        <fig-td class="text-right">
                            {{ exchangeRate }}
                        </fig-td>
                    </fig-tr>

                    <!-- <fig-tr-no-results v-if="!rate.rates?.length" :colspan="3" /> -->
                </fig-table-simple>
            </fig-spec>

            <!-- submit button -->
            <fig-spec>
                <template v-slot:label></template>
                <fig-button
                    variant="primary"
                    @click="onSave">{{ $t('Save') }}</fig-button>
            </fig-spec>
        </fig-spec-layout>
    </fig-overlay>
</template>

<style scoped>
.handle {
    cursor: grab;
}
</style>
