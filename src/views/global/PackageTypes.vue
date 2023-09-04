<script>
export default {
    name: 'PackageTypes'
}
</script>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { VueDraggableNext as draggable } from 'vue-draggable-next';
import usePagination from '@/composables/usePagination.js';
import useTable from '@/composables/useTable.js';
import useModal from '@/composables/useModal.js';
import useApi from '@/composables/useApi.js';
import useUtils from '@/composables/useUtils.js';
import PageTitle from '@/components/PageTitle.vue';
import PackageTypeForm from '@/components/PackageTypeForm.vue';
import {
    FigOperationsDropdown,
    FigButtonFab,
    FigButton,
    FigTableSimple,
    FigTh,
    FigTr,
    FigTd,
    FigTrNoResults,
    FigModal,
    FigOverlay,
    FigPaginationWrapper,
    FigUseToaster,
    FigUseConfirm,
    FigIcon,
    FigNumber
} from '@notoursllc/figleaf';


const { t } = useI18n();
const $api = useApi();
const { pagination, setPagination } = usePagination();
const { table, setSort } = useTable();
const { modal: upsert_modal, showModal, hideModal } = useModal();
const { cmToInches } = useUtils();
const { showSuccessToast, showErrorToast } = FigUseToaster();
const { showConfirm } = FigUseConfirm();

const packageTypes = ref([]);
const totalResults = ref(0);
const idForUpdate = ref(null);
const loading = ref(false);
const updatingSortOrder = ref(false);

async function fetchData() {
    try {
        loading.value = true;

        const response = await $api.packageType.list({
            ...pagination,
            ...table
        });

        packageTypes.value = response?.data || [];
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
            const response = await $api.packageType.delete(data.id);

            if(!response.data) {
                throw new Error(t('Item not found'));
            }

            fetchData();

            showSuccessToast({
                title: t('Success'),
                text: t('item_deleted_label', {label: data.label})
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

async function saveOrdinals() {
    try {
        loading.value = true;

        await $api.packageType.ordinals({
            ordinals: packageTypes.value.map(
                (obj) => {
                    return { id: obj.id, ordinal: obj.ordinal };
                }
            )
        });

        updatingSortOrder.value = false;

        showSuccessToast({
            title: t('Success'),
            text: t('Sort order updated')
        });
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

function setOrdinals() {
    updatingSortOrder.value = true;

    packageTypes.value.forEach((obj, index) => {
        obj.ordinal = index;
    });
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
    <page-title>{{ $t('Package types') }}</page-title>

    <fig-button-fab icon="plus" @click="onAdd" />

    <fig-pagination-wrapper
        bottom
        :total-records="totalResults"
        @perPage="onPaginationChange"
        @pageNumber="onPaginationChange">

        <div
            v-if="updatingSortOrder"
            class="mb-4">
            <fig-button
                variant="primary"
                size="sm"
                @click="saveOrdinals"
                :disabled="loading">{{ $t('Save sorting changes') }}</fig-button>
        </div>

        <fig-overlay :show="loading">
            <fig-table-simple
                striped
                hover
                class="w-full"
                @sort="onSortChange">
                <template v-slot:head>
                    <fig-tr>
                        <fig-th v-if="packageTypes.length > 1" class="handle-cell"></fig-th>
                        <fig-th sortable prop="label" class="text-left">{{ $t('Label') }}</fig-th>
                        <fig-th sortable prop="length_cm" class="text-right">{{ $t('Length (cm)') }}</fig-th>
                        <fig-th sortable prop="width_cm" class="text-right">{{ $t('Width (cm)') }}</fig-th>
                        <fig-th sortable prop="height_cm" class="text-right">{{ $t('Height (cm)') }}</fig-th>
                        <fig-th class="text-right">{{ $t('Volume') }}</fig-th>
                        <fig-th class="w-20"></fig-th>
                    </fig-tr>
                </template>

                <template v-slot:belowTbody>
                    <draggable
                        :list="packageTypes"
                        ghost-class="ghost"
                        handle=".handle"
                        @change="setOrdinals"
                        tag="tbody">
                        <fig-tr v-for="(obj, idx) in packageTypes" :key="idx">
                            <!-- handle -->
                            <fig-td v-if="packageTypes.length > 1" class="align-middle">
                                <i class="handle">
                                    <fig-icon icon="dots-vertical-double" />
                                </i>
                            </fig-td>

                            <fig-td>
                                {{ obj.label }}
                            </fig-td>

                            <!-- length -->
                            <fig-td class="text-right">
                                <fig-number :value="obj.length_cm" />
                                <div class="text-sm text-gray-500 text-right">
                                    {{ $t('{num} in.', {num: cmToInches(obj.length_cm)}) }}
                                </div>
                            </fig-td>

                            <!-- width -->
                            <fig-td class="text-right">
                                <fig-number :value="obj.width_cm" />
                                <div class="text-sm text-gray-500 text-right">
                                    {{ $t('{num} in.', {num: cmToInches(obj.width_cm)}) }}
                                </div>
                            </fig-td>

                            <!-- height -->
                            <fig-td class="text-right">
                                <fig-number :value="obj.height_cm" />
                                <div class="text-sm text-gray-500 text-right">
                                    {{ $t('{num} in.', {num: cmToInches(obj.height_cm)}) }}
                                </div>
                            </fig-td>

                            <!-- volume -->
                            <fig-td class="text-right">
                                <fig-number :value="obj.volume_cm" />
                            </fig-td>

                            <!-- actions -->
                            <fig-td class="text-center">
                                <fig-operations-dropdown
                                    :show-view="false"
                                    @edit="onEdit(obj.id)"
                                    @delete="onDelete(obj)" />
                            </fig-td>
                        </fig-tr>
                    </draggable>
                </template>

                <fig-tr-no-results
                    v-if="!packageTypes.length"
                    :colspan="7" />
            </fig-table-simple>
        </fig-overlay>
    </fig-pagination-wrapper>


    <fig-modal
        ref="upsert_modal"
        size="lg">
        <template v-slot:header>
            {{ $t(idForUpdate ? 'Edit Package Type' : 'Add Package Type') }}
        </template>

        <package-type-form
            :id="idForUpdate"
            @saved="onSaved"
            @cancel="hideModal" />
    </fig-modal>
</template>


<style scoped>
.handle-cell {
    width: 30px;
}
.handle {
    cursor: grab;
}
</style>
