<script>
export default {
    name: 'ProductArtistForm'
}
</script>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useApi from '@/composables/useApi.js';
import BunnyImage from '@/components/BunnyImage.vue';
import {
    FigButton,
    FigFormText,
    FigFormTextarea,
    FigFormCheckbox,
    FigSelectCountry,
    FigSelectStateProvince,
    FigLabelValueGroup,
    FigLabelValue,
    FigOverlay,
    FigUseToaster,
    FigUseFile
} from '@notoursllc/figleaf';

const props = defineProps({
    id: {
        type: String
    },

    showIsGlobal: {
        type: Boolean,
        default: false
    },
});

const emit = defineEmits([
    'saved',
    'cancel'
]);

const { t } = useI18n();
const $api = useApi();
const { showSuccessToast, showErrorToast } = FigUseToaster();
const { filesAreAcceptedType } = FigUseFile();

const artist = reactive({
    alt_text: null,
    city: null,
    countryCodeAlpha2: null,
    description: null,
    id: null,
    is_global: false,
    name: null,
    published: false,
    state: null,
    image: null,
    website: null,
    file: null
});

const fileError = ref(null);
const fileAccept = 'image/png, image/jpeg, image/gif';
const loading = ref(false);

async function fetchData(id) {
    try {
        loading.value = true;

        const response = await $api.product_artists.get(id);

        Object.keys(artist).forEach((key) => {
            artist[key] = response?.data[key];
        });

        console.log("RESPONSE", response)
        console.log("ARTIST", artist)
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

async function onFormSave() {
    try {
        loading.value = true;
        const response = await $api.product_artists.upsert(artist);

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
    finally {
        loading.value = false;
    }
}

function onFileChange(event) {
    const files = event.target.files;

    if (!filesAreAcceptedType(files, fileAccept)) {
        fileError.value = t('Invalid file type');
        artist.file = null;
        return;
    }

    fileError.value = null;
    artist.file = files[0];
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
    <fig-overlay :show="loading">
        <form @submit.prevent="onFormSave">
            <fig-label-value-group density="md">
                <!-- Published -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Published') }}:</template>
                    <fig-form-checkbox
                        v-model="artist.published"
                        binary />
                </fig-label-value>

                <!-- Is global -->
                <fig-label-value v-if="showIsGlobal">
                    <template v-slot:label>{{ $t('Is global') }}:</template>
                    <fig-form-checkbox
                        v-model="artist.is_global"
                        binary />
                </fig-label-value>

                <!-- Current image -->
                <fig-label-value v-if="artist.image">
                    <template v-slot:label>{{ $t('Current image') }}:</template>
                    <bunny-image
                        :src="artist.image"
                        preset="w150"
                        loading="lazy"
                        class="shadow" />
                </fig-label-value>

                <!-- image upload -->
                <fig-label-value>
                    <template v-slot:label>
                        {{ $t(artist.image ? 'New image' : 'Image') }}:
                    </template>
                    <input
                        ref="file-input"
                        :accept="fileAccept"
                        :multiple="false"
                        type="file"
                        :placeholder="$t('No file chosen')"
                        @input="onFileChange">

                    <template v-slot:error>
                        <div v-if="fileError">{{ fileError }}</div>
                    </template>
                </fig-label-value>

                <!-- Image alt text -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Image alt text') }}:</template>
                    <fig-form-text v-model="artist.alt_text" />
                </fig-label-value>

                <!-- Name -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Name') }}:</template>
                    <fig-form-text v-model="artist.name" />
                </fig-label-value>

                <!-- description -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Description') }}:</template>
                    <fig-form-textarea
                        v-model="artist.description"
                        rows="5" />
                </fig-label-value>

                <!-- website -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Website') }}:</template>
                    <fig-form-text v-model="artist.website" />
                </fig-label-value>

                <!-- city -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('City') }}:</template>
                    <fig-form-text v-model="artist.city" />
                </fig-label-value>

                <!-- country -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Country') }}:</template>
                    <fig-select-country
                        v-model="artist.countryCodeAlpha2"
                        :clearable="false" />
                </fig-label-value>

                <!-- state -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('State/Province/Region') }}:</template>
                    <fig-select-state-province
                        v-model="artist.state"
                        :country="artist.countryCodeAlpha2"
                        :clearable="false"
                        size="sm" />
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
    </fig-overlay>
</template>
