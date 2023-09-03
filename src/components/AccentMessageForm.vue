<script>
export default {
    name: 'AccentMessageForm'
}
</script>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useApi from '@/composables/useApi.js';
import {
    FigButton,
    FigFormText,
    FigLabelValueGroup,
    FigLabelValue,
    FigUseToaster,
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

const message = ref({});

async function fetchData(id) {
    try {
        const response = await $api.product.accentMessage.get(id);
        message.value = response?.data || {};
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
        const response = await $api.product.accentMessage.upsert(message.value);

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

            <!-- Name -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Accent Message') }}</template>
                <fig-form-text
                    v-model="message.message" />
            </fig-label-value>

            <!-- buttons -->
            <fig-label-value>
                <template v-slot:label></template>
                <div class="flex items-center gap-2 pt-6">
                    <fig-button
                        variant="primary"
                        type="submit">{{ $t('Save') }}</fig-button>

                    <fig-button
                        variant="plain"
                        @click="emitCancel">{{ $t('Cancel') }}</fig-button>
                </div>
            </fig-label-value>

        </fig-label-value-group>
    </form>
</template>
