<script>
export default {
    name: 'AccentMessages'
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
import AccentMessageForm from '@/components/AccentMessageForm.vue';
import {
    FigButtonFab,
    FigModal,
    FigTableSimple,
    FigTh,
    FigTr,
    FigTd,
    FigTrNoResults,
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

const messages = ref([]);
const totalResults = ref(0);
const idForUpdate = ref(null);
const loading = ref(false);

async function fetchData() {
    try {
        loading.value = true;

        const response = await $api.product.accentMessage.list({
            ...pagination,
            ...table
        });

        messages.value = response?.data || [];
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
            const response = await $api.product.accentMessage.delete(data.id);

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
    <page-title>{{ $t('Product accent messages') }}</page-title>

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
                        <fig-th sortable prop="message">{{ $t('Accent Message') }}</fig-th>
                        <fig-th class="w-20"></fig-th>
                    </fig-tr>
                </template>

                <fig-tr v-for="(obj, idx) in messages" :key="idx">
                    <!-- message -->
                    <fig-td>
                        {{ obj.message }}
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
                    v-if="!messages.length"
                    :colspan="2" />
            </fig-table-simple>
        </fig-overlay>
    </fig-pagination-wrapper>


    <fig-modal
        ref="upsert_modal"
        size="lg">
        <template v-slot:header>
            {{ $t(idForUpdate ? 'Edit Item' : 'Add Item') }}
        </template>

        <accent-message-form
            :id="idForUpdate"
            @saved="onSaved"
            @cancel="hideModal" />
    </fig-modal>
</template>
