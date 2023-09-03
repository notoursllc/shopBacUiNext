import { ref } from 'vue';

export default function useModal() {

    const modal = ref(null);

    function showModal() {
        modal.value.show();
    }

    function hideModal() {
        modal.value.hide();
    }

    return {
        modal,
        showModal,
        hideModal
    }

}
