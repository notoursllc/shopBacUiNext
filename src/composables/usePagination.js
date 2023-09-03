import { reactive } from 'vue';
import isObject from 'lodash-es/isObject.js';

export default function usePagination() {

    const pagination = reactive({
        _page: 1,
        _pageSize: 100
    });

    function setPagination(data) {
        if (isObject(data)) {
            if (data.hasOwnProperty('_page')) {
                pagination._page = data._page;
            }
            if (data.hasOwnProperty('_pageSize')) {
                pagination._pageSize = data._pageSize;
            }
        }
    }

    return {
        pagination,
        setPagination
    }
}
