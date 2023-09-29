<script>
export default {
    name: 'OrdersList'
}
</script>

<script setup>
import { ref, onMounted} from 'vue';
import { useI18n } from 'vue-i18n';
import qs from 'qs';
import usePagination from '@/composables/usePagination.js';
import useTable from '@/composables/useTable.js';
import useApi from '@/composables/useApi.js';
import PageTitle from '@/components/PageTitle.vue';
import {
    FigTableSimple,
    FigTr,
    FigTh,
    FigTd,
    FigTrNoResults,
    FigMoney,
    FigAddress,
    FigPaginationWrapper,
    FigTag,
    FigUseToaster,
    FigOverlay,
    FigFormat8601,
    FigNumber
} from '@notoursllc/figleaf';

const { t } = useI18n();
const $api = useApi();
const { pagination, setPagination } = usePagination();
const { table, setSort } = useTable();
const { showSuccessToast, showErrorToast } = FigUseToaster();

const loading = ref(false);
const carts = ref([]);
const totalResults = ref(0);

async function fetchData() {
    try {
        loading.value = true;

        const response = await $api.cart.search({
            closed_at: JSON.stringify({ 'null': false }),
            ...pagination,
            ...table
        });

        carts.value = response?.data || [];
        totalResults.value = response?.pagination.rowCount || 0;
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

function onPaginationChange(data) {
    setPagination(data);
    fetchData();
}

function onSortChange(val) {
    setSort(val);
    fetchData();
}

onMounted(() => {
    fetchData();
});
</script>


<template>
    <page-title>{{ $t('Orders') }}</page-title>

    <fig-pagination-wrapper
        bottom
        :total-records="totalResults"
        @perPage="onPaginationChange"
        @pageNumber="onPaginationChange">

        <fig-overlay :show="loading">
            <fig-table-simple
                striped
                hover
                @sort="onSortChange"
                class="w-full">
                <template v-slot:head>
                    <fig-tr>
                        <fig-th class="text-right">{{ $t('Grand total') }}</fig-th>
                        <fig-th class="text-right">{{ $t('Subtotal') }}</fig-th>
                        <fig-th class="text-right">{{ $t('Shipping') }}</fig-th>
                        <fig-th class="text-right">{{ $t('Tax') }}</fig-th>
                        <fig-th class="text-right">{{ $t('# items') }}</fig-th>
                        <fig-th>{{ $t('Shipping address') }}</fig-th>
                        <fig-th sortable prop="shipped_at">{{ $t('Shipped at') }}</fig-th>
                        <fig-th sortable prop="closed_at">{{ $t('Created') }}</fig-th>
                    </fig-tr>
                </template>

                <fig-tr v-for="(cart, idx) in carts" :key="idx">
                    <fig-td class="text-right">
                        <router-link
                            :to="{ name: 'reports-orders-id', params: { id: cart.id }}"
                            tag="a">
                            <fig-money :cents="cart.grand_total" />
                        </router-link>
                        <!-- <fig-operations-dropdown
                            :show-view="false"
                            @edit="goToProductUpsert(prod.id)"
                            @delete="onProductDelete(prod)"
                            class="ml-1" /> -->
                    </fig-td>

                    <fig-td class="text-right">
                        <fig-money :cents="cart.sub_total" />
                    </fig-td>

                    <fig-td class="text-right">
                        <fig-money :cents="cart.shipping_total" />
                    </fig-td>

                    <fig-td class="text-right">
                        <fig-money :cents="cart.sales_tax" />
                    </fig-td>

                    <fig-td class="text-right">
                        <fig-number :value="cart.num_items" />
                    </fig-td>

                    <fig-td>
                        <fig-address
                            :first-name="cart.shipping_firstName"
                            :last-name="cart.shipping_lastName"
                            :company="cart.shipping_company"
                            :street-address="cart.shipping_streetAddress"
                            :extended-address="cart.shipping_extendedAddress"
                            :city="cart.shipping_city"
                            :state="cart.shipping_state"
                            :zip="cart.shipping_postalCode"
                            :country-code="cart.shipping_countryCodeAlpha2" />
                    </fig-td>

                    <!-- shipped at -->
                    <fig-td>
                        <fig-format-8601
                            v-if="cart.shipped_at"
                            :date="cart.shipped_at " />
                        <fig-tag
                            v-else
                            variant="warning"
                            size="sm">{{ $t('not shipped') }}</fig-tag>
                    </fig-td>

                    <!-- Created -->
                    <fig-td>
                        <fig-format-8601 :date="cart.closed_at " />
                    </fig-td>
                </fig-tr>

                <fig-tr-no-results v-if="!carts.length" :colspan="8" />
            </fig-table-simple>
        </fig-overlay>

    </fig-pagination-wrapper>
</template>

