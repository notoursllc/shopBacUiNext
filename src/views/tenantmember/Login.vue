<script>
export default {
    name: 'LoginPage'
}
</script>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useApi from '@/composables/useApi.js';
import { useAppStore } from '@/stores/app';
import {
    FigButton,
    FigFormText,
    FigOverlay,
    FigVictoryIcon,
    FigUseToaster
} from '@notoursllc/figleaf';

const { t } = useI18n();
const $api = useApi();
const $router = useRouter();
const appStore = useAppStore();
const { showErrorToast, clearToasts } = FigUseToaster();

const isLoading = ref(false);
const userInfo = reactive({
    email: null,
    password: null
});

const buttonIsEnabled = computed(() => {
    return userInfo.email?.length && userInfo.password?.length;
});

async function onSubmit() {
    try {
        isLoading.value = true;

        const response = await $api.tenant.member.login(userInfo);

        if(!response) {
            throw new Error('Unauthorized');
        }

        appStore.login();

        $router.push({
            // name: 'reports-orders-list'
            name: 'home'
        });

        clearToasts();
    }
    catch(e) {
        appStore.logout();

        showErrorToast({
            title: t('Error'),
            text: e.message
        });
    }
    finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div class="-mt-20 max-w-md w-full p-4 lg:p-8 shadow-md rounded-md bg-white">
            <div>
                <div class="flex items-center justify-center">
                    <fig-victory-icon :width="75" :height="50" fill="#4e4e4f" />
                </div>
            </div>

            <fig-overlay :show="false">
                <form class="mt-4 space-y-4" @submit.prevent="onSubmit">
                    <div>
                        <fig-form-text
                            v-model.trim="userInfo.email"
                            :placeholder="$t('Email address')"
                            type="email"
                            size="lg" />
                    </div>

                    <div>
                        <fig-form-text
                            v-model.trim="userInfo.password"
                            :placeholder="$t('Password')"
                            type="password"
                            :autocomplete="false"
                            size="lg" />
                    </div>

                    <div>
                        <fig-button
                            type="submit"
                            variant="primary"
                            icon="lock"
                            size="md"
                            block
                            :disabled="!buttonIsEnabled">{{ $t('Sign in') }}</fig-button>
                    </div>
                </form>
            </fig-overlay>
        </div>
    </div>
</template>
