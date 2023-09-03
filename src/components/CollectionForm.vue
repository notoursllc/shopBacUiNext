<script>
export default {
    name: 'CollectionForm'
}
</script>

<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import useUtils from '@/composables/useUtils.js';
import useApi from '@/composables/useApi.js';
import {
    FigTextCard,
    FigButton,
    FigFormCheckbox,
    FigFormText,
    FigFormTextarea,
    FigFormInputEndcapper,
    FigUseToaster,
    FigLabelValueGroup,
    FigLabelValue
} from '@notoursllc/figleaf';

const props = defineProps({
    id: {
        type: String
    }
});

const emit = defineEmits([
    'saved',
    'cancel'
]);

const { t } = useI18n();
const $api = useApi();
const { getNextAvailableTypeValue } = useUtils();
const { showSuccessToast, showErrorToast } = FigUseToaster();

const collection = ref({});
const domainName = import.meta.env.DOMAIN_NAME;

async function fetchCollection(id) {
    try {
        const { data } = await $api.product.collection.get(id);
        collection.value = data;

        if(!collection.value) {
            throw new Error(t('Collection not found'));
        }
    }
    catch(e) {
        showErrorToast({
            title: t('Error'),
            text: e.message
        });
    }
}

async function setNextAvailableValue() {
    try {
        const { data } = await $api.product.collection.list();
        collection.value.value = getNextAvailableTypeValue(data);
    }
    catch(e) {
        showErrorToast({
            title: t('Error'),
            text: e.message
        });
    }
}

async function onFormSave() {
    try {
        const { data } = await $api.product.collection.upsert(collection.value);

        if (!data) {
            throw new Error(t('Error updating Collection'));
        }

        showSuccessToast({
            title: t(data.id ? 'Collection updated successfully': 'Collection added successfully'),
            text: data.name
        });

        emit('saved')
    }
    catch(e) {
        showErrorToast({
            title: t('Error'),
            text: e.message
        });
    }
}

function emitCancel() {
    emit('cancel');
}

onBeforeMount(() => {
    if(!props.id) {
        setNextAvailableValue();
    }
});

watch(
    () => props.id,
    (id) => {
        if (id) {
            fetchCollection(id);
        }
    },
    { immediate: true }
);
</script>

<template>
    <div>
        <fig-text-card
            variant="light"
            shadow
            class="mb-5">
            <template v-slot:header_left>{{ $t('General info') }}</template>
            <fig-label-value-group density="md">
                <!-- Published -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Published') }}</template>
                    <fig-form-checkbox
                        v-model="collection.published"
                        binary />
                </fig-label-value>

                <!-- Name -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Name') }}</template>
                    <fig-form-text
                        v-model="collection.name" />
                </fig-label-value>

                <!-- Description -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Description') }}</template>
                    <fig-form-textarea
                        v-model="collection.description"
                        rows="2" />
                </fig-label-value>

                <!-- Value -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Value') }}</template>
                    {{ collection.value }}
                </fig-label-value>
            </fig-label-value-group>
        </fig-text-card>

        <!-- SEO -->
        <fig-text-card variant="light" shadow>
            <template v-slot:header_left>{{ $t('Search engine listing') }}</template>

            <fig-label-value-group density="md">
                <!-- page title -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Page title') }}</template>
                    <fig-form-text
                        v-model="collection.seo_page_title" />
                </fig-label-value>

                <!-- description -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Description') }}</template>
                    <fig-form-textarea
                        v-model="collection.seo_page_desc"
                        rows="2" />
                </fig-label-value>

                <!-- URI -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('URL and handle') }}</template>
                    <fig-form-input-endcapper>
                        <template v-slot:prefix>{{ `https://${domainName}` }}</template>

                        <fig-form-text
                            v-model="collection.seo_uri"
                            maxlength="50"
                            square-left />
                    </fig-form-input-endcapper>
                </fig-label-value>
            </fig-label-value-group>
        </fig-text-card>

        <!-- buttons -->
        <div class="pt-5">
            <fig-button
                variant="primary"
                @click="onFormSave"
                class="mr-2">{{ $t('Save') }}</fig-button>

            <fig-button
                variant="plain"
                @click="emitCancel">{{ $t('Cancel') }}</fig-button>
        </div>
    </div>
</template>
