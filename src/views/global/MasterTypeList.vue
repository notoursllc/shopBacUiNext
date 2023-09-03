<script>
export default {
    name: 'MasterTypeList'
}
</script>

<script setup>
import { computed, ref, reactive, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { VueDraggableNext as draggable } from 'vue-draggable-next';
import isObject from 'lodash-es/isObject.js';
import slugify from 'slugify';
import useApi from '@/composables/useApi.js';
import usePagination from '@/composables/usePagination.js';
import useTable from '@/composables/useTable.js';
import useModal from '@/composables/useModal.js';
import BooleanTag from '@/components/BooleanTag.vue';
import PageTitle from '@/components/PageTitle.vue';
import { useAppStore } from '@/stores/app';
import {
    FigButton,
    FigButtonFab,
    FigFormCheckbox,
    FigFormText,
    FigFormTextarea,
    FigModal,
    FigTableSimple,
    FigTh,
    FigTr,
    FigTd,
    FigOverlay,
    FigOperationsDropdown,
    FigLabelValueGroup,
    FigLabelValue,
    FigMetaDataBuilder,
    FigTrNoResults,
    FigPaginationWrapper,
    FigUseToaster,
    FigUseConfirm,
    FigIcon
} from '@notoursllc/figleaf';

const { t } = useI18n();
const $route = useRoute();
const { showSuccessToast, showErrorToast } = FigUseToaster();
const { showConfirm } = FigUseConfirm();
const $api = useApi();
const { pagination, setPagination } = usePagination();
const { table, setSort } = useTable();
const { modal: upsert_modal, showModal, hideModal } = useModal();
const appStore = useAppStore();

const form = reactive({
    object: $route.params.type,
    name: null,
    slug: null,
    published: true,
    description: null,
    metadata: null,
    hasMetaData: false
});

const types = ref([]);
const updatingSortOrder = ref(false);
const loading = ref(false);
const totalResults = ref(0);

const slugIdea = computed(() => {
    if(form.name) {
        return slugify(form.name, { lower: true });
    }
    return '';
});

async function fetchTypes() {
    try {
        loading.value = true;

        const response = await $api.masterType.list({
            object: $route.params.type,
            ...pagination,
            ...table
        });

        types.value = response?.data || [];
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

function refreshState() {
    // Need to clone each object in the array before storing in vuex.
    // Otherwise when the setOrdinals() methods modifies the 'ordinal' value
    // in each object, vuex will throw an error that state can not be modified
    // outside of a vuex modifier method
    const typesCopy = types.value.map((obj) => Object.assign({}, obj));
    appStore.addMasterTypes(typesCopy);
}

async function onDeleteClick(data) {
    try {
        await showConfirm(
            t('delete_name?', {name: data.name}),
            {
                size: 'md',
                // title: 'Test title'
            }
        );

        try {
            const response = await $api.masterType.delete(data.id);

            if(!response.data) {
                throw new Error(t('Master type not found'));
            }

            await fetchTypes();
            refreshState();

            showSuccessToast({
                title: t('Success'),
                text: t('deleted_name', { name: data.name })
            });
        }
        catch(err) {
            showErrorToast({
                title: t('Error'),
                text: err.message
            });
        }
    }
    catch(e) {
        // confirm cancelled
    }
}

async function onUpsertClick(data) {
    try {
        clearForm();

        if(isObject(data) && data.id) {
            const response = await $api.masterType.get(data.id);

            if(!response.data) {
                throw new Error(t('Master Type not found'));
            }

            Object.keys(response.data).forEach((key) => {
                form[key] = response.data[key];
            });
        }

        form.hasMetaData = Array.isArray(form.metadata) && form.metadata.length > 0;

        showModal();
    }
    catch(e) {
        showErrorToast({
            title: t('Error'),
            text: e.message
        });
    }
}

async function onUpsertFormSave() {
    try {
        if(!form.hasMetaData) {
            form.metadata = null;
        }

        delete form.hasMetaData;

        if(!form.id) {
            delete form.id;
            delete form.value;
        }

        const { data } = await $api.masterType.upsert(form);

        if(!data) {
            throw new Error(t('Error updating Master Type'));
        }

        showSuccessToast({
            title: t('Success'),
            text: t(form.id ? 'updated_name' : 'added_name', { name: data.name })
        });

        hideModal();
        await fetchTypes();
        refreshState();
    }
    catch(e) {
        showErrorToast({
            title: t('Error'),
            text: e.message
        });
    }
}

async function saveOrdinals() {
    try {
        loading.value = true;

        await $api.masterType.ordinals({
            ordinals: types.value.map(
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

function clearForm() {
    for(const key in form) {
        if(key === 'published') {
            form.published = true;
        }
        else if(key !== 'object') {
            form[key] = null;
        }
    }
}

function onUseSlugSuggestion() {
    form.slug = slugIdea.value;
}

function setOrdinals() {
    updatingSortOrder.value = true;

    types.value.forEach((obj, index) => {
        obj.ordinal = index;
    });
}

function onPaginationChange(data) {
    setPagination(data);
    fetchTypes();
}

function onSortChange(val) {
    setSort(val);
    fetchTypes();
}

onMounted(() => {
    fetchTypes();
});

watch(
    () => $route.params.type,
    () => {
        fetchTypes();
    }
);
</script>


<template>
    <div>
        <page-title>{{ $t(`master_type_nav_labels.${$route.params.type}`) }}</page-title>
        <fig-button-fab icon="plus" @click="onUpsertClick" />

        <fig-pagination-wrapper
            bottom
            :total-rows="totalResults"
            @change="onPaginationChange">

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
                        <tr>
                            <fig-th v-if="types.length > 1" class="handle-cell"></fig-th>
                            <fig-th sortable prop="name" class="text-left">{{ $t('Name') }}</fig-th>
                            <fig-th sortable prop="slug" class="text-left">{{ $t('Slug') }}</fig-th>
                            <fig-th sortable prop="published" class="text-left">{{ $t('Published') }}</fig-th>
                            <fig-th class="w-20"></fig-th>
                        </tr>
                    </template>

                    <template v-slot:belowTbody>
                        <draggable
                            :list="types"
                            ghost-class="ghost"
                            handle=".handle"
                            @change="setOrdinals"
                            tag="tbody">
                            <fig-tr
                                v-for="(type, idx) in types"
                                :key="idx">
                                <!-- handle -->
                                <fig-td v-if="types.length > 1" class="align-middle">
                                    <i class="handle">
                                        <fig-icon icon="dots-vertical-double" />
                                    </i>
                                </fig-td>

                                <fig-td>
                                    {{ type.name }}
                                </fig-td>

                                <fig-td>
                                    {{ type.slug }}
                                </fig-td>

                                <fig-td>
                                    <boolean-tag :value="type.published" />
                                </fig-td>

                                <fig-td class="text-center">
                                    <fig-operations-dropdown
                                        :show-view="false"
                                        @edit="onUpsertClick(type)"
                                        @delete="onDeleteClick(type)"
                                        class="ml-1" />
                                </fig-td>
                            </fig-tr>

                            <fig-tr-no-results v-if="!types.length" :colspan="4" />
                        </draggable>
                    </template>
                </fig-table-simple>
            </fig-overlay>

        </fig-pagination-wrapper>


        <fig-modal
            ref="upsert_modal"
            size="md">

            <template v-slot:header>
                {{ form.id
                    ? $t(`Edit Master Type ({name})`, {'name': form.object})
                    : $t(`Add Master Type ({name})`, {'name': form.object}) }}
            </template>

            <fig-label-value-group density="lg" display="table" class="w-full">
                <!-- Published -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Published') }}:</template>
                    <fig-form-checkbox
                        v-model="form.published"
                        binary />
                </fig-label-value>

                <!-- Name -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Name') }}:</template>
                    <fig-form-text v-model="form.name" />
                </fig-label-value>

                <!-- Slug -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Slug') }}:</template>
                    <fig-form-text v-model="form.slug" />
                    <div class="text-xs" v-show="slugIdea">
                        <span class="text-gray-500">{{ $t('Suggestion') }}:</span>&nbsp;&nbsp;{{ slugIdea }}&nbsp;
                        (<a @click="onUseSlugSuggestion" class="underlineDotted">{{ $t('use this') }}</a>)
                    </div>
                </fig-label-value>

                <!-- Description -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Description') }}:</template>
                    <fig-form-textarea
                        v-model="form.description"
                        :rows="2" />
                </fig-label-value>

                <!-- Meta data -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Meta data') }}:</template>
                    <fig-form-checkbox
                        v-model="form.hasMetaData"
                        binary>{{ $t('This item has additional meta data') }}</fig-form-checkbox>
                    <div class="mt-3" v-show="form.hasMetaData">
                        <fig-meta-data-builder v-model="form.metadata" />
                    </div>
                </fig-label-value>
            </fig-label-value-group>


            <div class="pt-5 flex items-center justify-center">
                <fig-button
                    variant="primary"
                    @click="onUpsertFormSave"
                    class="mr-3">{{ $t('Save') }}</fig-button>

                <fig-button
                    variant="plain"
                    @click="hideModal">{{ $t('Cancel') }}</fig-button>
            </div>
        </fig-modal>

    </div>
</template>


<style scoped>
.handle-cell {
    width: 30px;
}
.handle {
    cursor: grab;
}
</style>
