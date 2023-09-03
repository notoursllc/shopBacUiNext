<script>
export default {
    name: 'PageTitle'
}
</script>

<script setup>

</script>

<template>
    <div class="sidebar-layout-page-title">
        <div class="font-semibold test-lg"><slot /></div>
    </div>
</template>

<style scoped>
.sidebar-layout-page-title {
    @apply flex justify-between items-center mb-5;
    margin-top: -18px;
}
</style>
