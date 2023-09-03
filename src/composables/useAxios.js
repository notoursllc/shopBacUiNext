import axios from 'axios';
import axiosRetry from 'axios-retry';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';

export default function useAxios() {

    if (!useAxios.axios) {
        const appStore = useAppStore();
        const $router = useRouter();

        useAxios.axios = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            withCredentials: true, // will send the session cookie with the requests
            // headers: {
            //     common: {
            //         Authorization: `Basic ${encodedToken}`
            //     }
            // }
        });

        // https://www.npmjs.com/package/axios-retry
        // axiosRetry(useAxios.axios, { retries: 3 });

        useAxios.axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                console.log("AXIOS ERROR", error);
                if(error.response && error.response.status === 401) {
                    appStore.logout();
                    $router.push({ name: 'tenantmember-login' })
                }

                return Promise.reject(error);
            }
        );
    }

    return useAxios.axios;


}
