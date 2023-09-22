<script>
export default {
    name: 'ProductArtists'
}
</script>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import usePagination from '@/composables/usePagination.js';
import useTable from '@/composables/useTable.js';
import useModal from '@/composables/useModal.js';
import useApi from '@/composables/useApi.js';
import PageTitle from '@/components/PageTitle.vue';
import BooleanTag from '@/components/BooleanTag.vue';
import ProductArtistForm from '@/components/product/ProductArtistForm.vue';
import BunnyImage from '@/components/BunnyImage.vue';
import {
    FigButtonFab,
    FigTableSimple,
    FigTh,
    FigTr,
    FigTd,
    FigTrNoResults,
    FigOperationsDropdown,
    FigOverlay,
    FigPaginationWrapper,
    FigNuxtImgBunny,
    FigModal,
    FigUseToaster,
    FigUseConfirm
} from '@notoursllc/figleaf';


const { t } = useI18n();
const $api = useApi();
const { pagination, setPagination } = usePagination();
const { table, setSort } = useTable();
const { modal: upsert_modal, showModal, hideModal } = useModal();
const { showSuccessToast, showErrorToast } = FigUseToaster();
const { showConfirm } = FigUseConfirm();

const artists = ref([]);
const totalResults = ref(0);
const idForUpdate = ref(null);
const loading = ref(false);

async function fetchData() {
    try {
        loading.value = true;

        const response = await $api.product_artists.list({
            ...pagination,
            ...table
        });

        artists.value = response?.data || [];
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

async function onDelete(data) {
    try {
        await showConfirm(
            t('remove_label?', {label: data.message}),
            {
                size: 'md',
            }
        );

        try {
            const response = await $api.product_artists.delete(data.id);

            if(!response.data) {
                throw new Error(t('Item not found'));
            }

            fetchData();

            showSuccessToast({
                title: t('Success'),
                text: t('item_deleted_label', {label: data.message})
            });
        }
        catch(e) {
            showErrorToast({
                title: t('Error'),
                text: e.message
            });
        }
    }
    catch(e) {
        // confirm cancelled
    }
}

function onSaved() {
    hideModal();
    fetchData();
}

function onAdd() {
    idForUpdate.value = null;
    showModal();
}

function onEdit(id) {
    idForUpdate.value = id;
    showModal();
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
    <page-title>{{ $t('Product artists') }}</page-title>

    <fig-button-fab icon="plus" @click="onAdd" />

    <fig-pagination-wrapper
        bottom
        :total-records="totalResults"
        @perPage="onPaginationChange"
        @pageNumber="onPaginationChange">

        <fig-overlay :show="loading">
            <fig-table-simple
                striped
                hover
                class="w-full"
                @sort="onSortChange">
                <template v-slot:head>
                    <fig-tr>
                        <fig-th sortable prop="name" colspan="2">{{ $t('Name') }}</fig-th>
                        <fig-th sortable prop="published">{{ $t('Published') }}</fig-th>
                        <fig-th sortable prop="is_global">{{ $t('Is global') }}</fig-th>
                        <fig-th sortable prop="website">{{ $t('Website') }}</fig-th>
                        <fig-th sortable prop="city">{{ $t('City') }}</fig-th>
                        <fig-th sortable prop="state">{{ $t('State/Province/Region') }}</fig-th>
                        <fig-th sortable prop="countryCodeAlpha2">{{ $t('Country') }}</fig-th>
                        <fig-th class="w-20"></fig-th>
                    </fig-tr>
                </template>

                <fig-tr v-for="(obj, idx) in artists" :key="idx">
                    <!-- image -->
                    <fig-td>
                        <bunny-image
                            v-if="obj.image"
                            :src="obj.image"
                            preset="w150"
                            loading="lazy"
                            class="shadow" />
                    </fig-td>

                    <!-- title -->
                    <fig-td>
                        {{ obj.name }}
                    </fig-td>

                    <!-- published -->
                    <fig-td>
                        <boolean-tag :value="obj.published" />
                    </fig-td>

                    <!-- is global -->
                    <fig-td>
                        <boolean-tag :value="obj.is_global" />
                    </fig-td>

                    <!-- website -->
                    <fig-td>
                        <a :href="obj.website" target="_blank">{{ obj.website }}</a>
                    </fig-td>

                    <!-- city -->
                    <fig-td>
                        {{ obj.city }}
                    </fig-td>

                    <!-- state -->
                    <fig-td>
                        {{ obj.state }}
                    </fig-td>

                    <!-- country -->
                    <fig-td>
                        {{ obj.countryCodeAlpha2 }}
                    </fig-td>

                    <!-- actions -->
                    <fig-td class="text-center">
                        <fig-operations-dropdown
                            :show-view="false"
                            @edit="onEdit(obj.id)"
                            @delete="onDelete(obj)" />
                    </fig-td>
                </fig-tr>

                <fig-tr-no-results
                    v-if="!artists.length"
                    :colspan="9" />
            </fig-table-simple>
        </fig-overlay>
    </fig-pagination-wrapper>


    <fig-modal
        ref="upsert_modal"
        size="lg">
        <template v-slot:header>
            {{ $t(idForUpdate ? 'Edit Item' : 'Add Item') }}
        </template>

        <product-artist-form
            :id="idForUpdate"
            @saved="onSaved"
            @cancel="hideModal" />
    </fig-modal>
</template>
