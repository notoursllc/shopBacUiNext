<script>
export default {
    name: 'ColorSwatches'
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
import ColorSwatchForm from '@/components/ColorSwatchForm.vue';
import {
    FigButtonFab,
    FigModal,
    FigTableSimple,
    FigTh,
    FigTr,
    FigTd,
    FigTrNoResults,
    FigFormText,
    FigOperationsDropdown,
    FigPaginationWrapper,
    FigOverlay,
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

const swatches = ref([]);
const totalResults = ref(0);
const idForUpdate = ref(null);
const loading = ref(false);

async function fetchData() {
    try {
        loading.value = true;

        const response = await $api.product.colorSwatch.list({
            ...pagination,
            ...table
        });

        swatches.value = response?.data || [];
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
            t('remove_label?', {label: data.label}),
            {
                size: 'md',
            }
        );

        try {
            const response = await $api.product.colorSwatch.delete(data.id);

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
    <page-title>{{ $t('Color swatches') }}</page-title>

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
                        <fig-th>{{ $t('Swatch') }}</fig-th>
                        <fig-th>{{ $t('Hex') }}</fig-th>
                        <fig-th sortable prop="name">{{ $t('Label') }}</fig-th>
                        <fig-th sortable prop="description">{{ $t('Description') }}</fig-th>
                        <fig-th class="w-20"></fig-th>
                    </fig-tr>
                </template>

                <fig-tr v-for="(obj, idx) in swatches" :key="idx">
                    <!-- swatch -->
                    <fig-td>
                        <fig-form-text
                            type="color"
                            v-model="obj.hex"
                            disabled />
                    </fig-td>

                    <!-- hex -->
                    <fig-td>
                        {{ obj.hex }}
                    </fig-td>

                    <!-- label -->
                    <fig-td>
                        {{ obj.label }}
                    </fig-td>

                    <!-- description -->
                    <fig-td>
                        {{ obj.description }}
                    </fig-td>

                    <!-- actions -->
                    <fig-td class="text-center">
                        <fig-operations-dropdown
                            :show-view="false"
                            @edit="onEdit(obj.id)"
                            @delete="onDelete(obj)"
                            class="ml-1" />
                    </fig-td>
                </fig-tr>

                <fig-tr-no-results
                    v-if="!swatches.length"
                    :colspan="5" />
            </fig-table-simple>
        </fig-overlay>
    </fig-pagination-wrapper>


    <fig-modal
        ref="upsert_modal"
        size="lg">
        <template v-slot:header>
            {{ $t(idForUpdate ? 'Edit Item' : 'Add Item') }}
        </template>

        <color-swatch-form
            :id="idForUpdate"
            @saved="onSaved"
            @cancel="hideModal" />
    </fig-modal>
</template>

