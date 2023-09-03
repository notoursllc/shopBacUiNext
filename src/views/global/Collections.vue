<script>
export default {
    name: 'CollectionsView'
}
</script>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import BooleanTag from '@/components/BooleanTag.vue';
import CollectionForm from '@/components/CollectionForm.vue';
import PageTitle from '@/components/PageTitle.vue';
import usePagination from '@/composables/usePagination.js';
import useTable from '@/composables/useTable.js';
import useApi from '@/composables/useApi.js';
import useModal from '@/composables/useModal.js';
import {
    FigButtonFab,
    FigTableSimple,
    FigTh,
    FigTr,
    FigTd,
    FigTrNoResults,
    FigOperationsDropdown,
    FigPaginationWrapper,
    FigOverlay,
    FigUseToaster,
    FigUseConfirm,
    FigModal
} from '@notoursllc/figleaf';

const { t } = useI18n();
const { pagination, setPagination } = usePagination();
const { table, setSort } = useTable();
const $api = useApi();
const { modal: upsert_modal, showModal, hideModal } = useModal();

const { showSuccessToast, showErrorToast } = FigUseToaster();
const { showConfirm } = FigUseConfirm();

const loading = ref(false);
const collections = ref([]);
const totalResults = ref(0);
const collectionIdForUpdate = ref(null);

async function fetchData() {
    try {
        loading.value = true;

        const response = await $api.product.collection.list({
            ...pagination,
            ...table
        });

        collections.value = response?.data || [];
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

async function onDeleteCollection(data) {
    try {
        await showConfirm(
            t('delete_name?', {name: data.name}),
            'warning'
        );

        try {
            const response = await $api.product.collection.delete(data.id);

            if(!response.data) {
                throw new Error(t('Collection not found'));
            }

            fetchData();

            showSuccessToast({
                // title: t('Success'),
                text: t('deleted_name', { name: data.name })
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

function onEditCollection(id) {
    collectionIdForUpdate.value = id;
    showModal();
}

function onAddCollection() {
    collectionIdForUpdate.value = null;
    showModal();
}

function onCollectionUpsert() {
    hideModal();
    fetchData();
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
    <div>
        <page-title>{{ $t('Product collections') }}</page-title>

        <fig-button-fab icon="plus" @click="onAddCollection" />

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
                            <fig-th sortable prop="name">{{ $t('Name') }}</fig-th>
                            <fig-th sortable prop="published">{{ $t('Published') }}</fig-th>
                            <fig-th></fig-th>
                        </fig-tr>
                    </template>

                    <fig-tr v-for="(obj, idx) in collections" :key="idx">
                        <!-- name -->
                        <fig-td>
                            {{ obj.name }}
                        </fig-td>

                        <!-- published -->
                        <fig-td>
                            <boolean-tag :value="obj.published" />
                        </fig-td>

                        <!-- actions -->
                        <fig-td>
                            <fig-operations-dropdown
                                :show-view="false"
                                @edit="onEditCollection(obj.id)"
                                @delete="onDeleteCollection(obj)"
                                class="ml-1" />
                        </fig-td>
                    </fig-tr>

                    <fig-tr-no-results
                        v-if="!collections.length"
                        :colspan="3" />
                </fig-table-simple>
            </fig-overlay>

        </fig-pagination-wrapper>

        <!-- add/edit collection modal -->
        <fig-modal
            ref="upsert_modal"
            size="md">

            <template v-slot:header>
                {{ $t(collectionIdForUpdate ? 'Edit product collection' : 'Add product collection') }}
            </template>

            collectionIdForUpdate {{  collectionIdForUpdate }}
            <collection-form
                :id="collectionIdForUpdate"
                @saved="onCollectionUpsert"
                @cancel="hideModal" />

        </fig-modal>
    </div>
</template>
