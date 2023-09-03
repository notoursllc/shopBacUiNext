import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';
import isObject from 'lodash-es/isObject.js';


export const useAppStore = defineStore('appStore', () => {

    const isAuthenticated = ref(false);
    const configs = ref([]);
    const masterTypes = ref({});
    const types = ref({});
    const taxCodes = ref([]);

    function logout() {
        isAuthenticated.value = false;
    }

    function login() {
        isAuthenticated.value = true;
    }

    function addMasterTypes(arr) {
        if (Array.isArray(arr)) {
            arr.forEach((type) => {
                if (isObject(type) && type.hasOwnProperty('object')) {
                    if (!Array.isArray(masterTypes.value[type.object])) {
                        masterTypes.value[type.object] = [];
                    }

                    const existingIndex = masterTypes.value[type.object].findIndex((item) => {
                        return item.id === type.id;
                    });

                    if (existingIndex > -1) {
                        masterTypes.value[type.object][existingIndex] = type;
                    }
                    else {
                        masterTypes.value[type.object].push(type);
                    }
                }
            });
        }
    }

    function setMasterType(data) {
        if (isObject(data) && data.hasOwnProperty('object')) {
            masterTypes.value[data.object].push(data);
        }
    }

    return {
        configs,
        masterTypes,
        types,
        isAuthenticated,
        taxCodes,
        logout,
        login,
        addMasterTypes,
        setMasterType
    }

}, { persist: true });


if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
