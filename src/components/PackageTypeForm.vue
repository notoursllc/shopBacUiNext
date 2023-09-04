<script>
export default {
    name: 'PackageTypeForm'
}
</script>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import useApi from '@/composables/useApi.js';
import useUtils from '@/composables/useUtils.js';
import {
    FigButton,
    FigFormText,
    FigFormTextarea,
    FigFormInputNumber,
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
const { cmToInches } = useUtils();
const { showSuccessToast, showErrorToast } = FigUseToaster();

const packageType = ref({
    label: null,
    description: null,
    code: null,
    // code_for_carrier: null,
    length_cm: null,
    width_cm: null,
    height_cm: null,
    weight_oz: null,
    max_weight_oz: null
});

const rules = {
    label: {
        required
    },
    length_cm: {
        required
    },
    width_cm: {
        required
    },
    height_cm: {
        required
    }
};

const v$ = useVuelidate(rules, packageType);

const formIsValid = computed(() => {
    return !v$.value.$invalid;
});

async function fetchData(id) {
    try {
        const response = await $api.packageType.get(id);
        packageType.value = response?.data || {};
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
        const response = await $api.packageType.upsert(packageType.value);

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

            <!-- Length -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Length (cm)') }}</template>

                <fig-form-input-number
                    v-model="packageType.length_cm"
                    :step=".01"
                    :min="0"
                    @input="v$.length_cm.$touch()" />

                <div
                    v-if="packageType.length_cm"
                    class="text-sm text-gray-500 pl-2">
                    {{ $t('{num} in.', {num: cmToInches(packageType.length_cm)}) }}
                </div>

                <template v-slot:error>
                    <div v-if="v$.length_cm.required.$invalid">{{ $t('required') }}</div>
                </template>
            </fig-label-value>


            <!-- Width -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Width (cm)') }}</template>

                <fig-form-input-number
                    v-model="packageType.width_cm"
                    :step=".01"
                    :min="0" />

                <div
                    v-if="packageType.width_cm"
                    class="text-sm text-gray-500 pl-2">
                    {{ $t('{num} in.', {num: cmToInches(packageType.width_cm)}) }}
                </div>

                <template v-slot:error>
                    <div v-if="v$.width_cm.required.$invalid">{{ $t('required') }}</div>
                </template>
            </fig-label-value>


            <!-- Height -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Height (cm)') }}</template>

                <fig-form-input-number
                    v-model="packageType.height_cm"
                    :step=".01"
                    :min="0" />

                <div
                    v-if="packageType.height_cm"
                    class="text-sm text-gray-500 pl-2">
                    {{ $t('{num} in.', {num: cmToInches(packageType.height_cm)}) }}
                </div>

                <template v-slot:error>
                    <div v-if="v$.height_cm.required.$invalid">{{ $t('required') }}</div>
                </template>
            </fig-label-value>


            <!-- Label -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Label') }}</template>

                <fig-form-text
                    v-model="packageType.label" />

                <template v-slot:error>
                    <div v-if="v$.label.required.$invalid">{{ $t('required') }}</div>
                </template>
            </fig-label-value>


            <!-- Carrier code -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Carrier package type code') }}</template>

                <fig-form-text
                    v-model="packageType.code" />
            </fig-label-value>


            <!-- Description -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Description') }}</template>

                <fig-form-textarea
                    v-model="packageType.description"
                    :rows="2" />
            </fig-label-value>


            <!-- Notes -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Notes') }}</template>

                <fig-form-textarea
                    v-model="packageType.notes"
                    :rows="2" />
            </fig-label-value>


            <!-- Weight -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Weight (oz)') }}</template>

                <fig-form-input-number
                    v-model="packageType.weight_oz"
                    :step="1"
                    :min="0" />
            </fig-label-value>


            <!-- Max weight -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Max weight (oz)') }}</template>

                <fig-form-input-number
                    v-model="packageType.max_weight_oz"
                    :step="1"
                    :min="0" />
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
