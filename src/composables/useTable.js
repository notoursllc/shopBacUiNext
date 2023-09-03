import { reactive } from 'vue';
// import isObject from 'lodash-es/isObject.js';

export default function useTable() {

    const table = reactive({
        _sort: null
    });

    function setSort(val) {
        table._sort = val;
    }

    return {
        table,
        setSort
    }

}
