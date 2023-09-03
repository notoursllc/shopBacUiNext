<script>
export default {
    name: 'ColorSwatchForm'
}
</script>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import useApi from '@/composables/useApi.js';
import {
    FigButton,
    FigFormText,
    FigFormTextarea,
    FigLabelValueGroup,
    FigLabelValue,
    FigUseToaster,
    FigMetaDataBuilder
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
const { showSuccessToast, showErrorToast } = FigUseToaster();

const swatch = ref({
    hex: null,
    label: null,
    description: null,
    metadata: null
});

const rules = {
    hex: {
        required
    },
    label: {
        required
    }
};

const v$ = useVuelidate(rules, swatch);

const formIsValid = computed(() => {
    return !v$.value.$invalid;
});

async function fetchData(id) {
    try {
        const response = await $api.product.colorSwatch.get(id);
        swatch.value = response?.data || {};
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
        const response = await $api.product.colorSwatch.upsert(swatch.value);

        if (!response?.data) {
            throw new Error(t('Error updating item'));
        }

        emit('saved', response.data);

        showSuccessToast({
            title: t('Success'),
            text:  t(response.data.id ? 'Item updated successfully' : 'Item added successfully')
        });
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

watch(
    () => props.id,
    (id) => {
        if (id) {
            fetchData(id);
        }
    },
    { immediate: true }
);
</script>

<template>
    <form @submit.prevent="onFormSave">
        <fig-label-value-group density="md">

            <!-- Swatch -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Swatch') }}</template>

                <fig-form-text
                    type="color"
                    v-model="swatch.hex"
                    id="input_swatch" />

                <template v-slot:error>
                    <div v-if="v$.hex.required.$invalid">{{ $t('required') }}</div>
                </template>
            </fig-label-value>

             <!-- Label -->
             <fig-label-value>
                <template v-slot:label>{{ $t('Label') }}</template>

                <fig-form-text
                    v-model="swatch.label" />

                <template v-slot:error>
                    <div v-if="v$.hex.required.$invalid">{{ $t('required') }}</div>
                </template>
            </fig-label-value>

            <!-- Description -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Description') }}</template>
                <fig-form-textarea
                    v-model="swatch.description"
                    :rows="2" />
            </fig-label-value>

            <!-- Meta data -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Meta data') }}</template>
                <fig-meta-data-builder v-model="swatch.metadata" />
            </fig-label-value>

            <!-- buttons -->
            <fig-label-value>
                <template v-slot:label></template>
                <div class="flex items-center gap-2 pt-6">
                    <fig-button
                        variant="primary"
                        type="submit"
                        :disabled="!formIsValid">{{ $t('Save') }}</fig-button>

                    <fig-button
                        variant="plain"
                        @click="emitCancel">{{ $t('Cancel') }}</fig-button>
                </div>
            </fig-label-value>

        </fig-label-value-group>
    </form>
</template>
