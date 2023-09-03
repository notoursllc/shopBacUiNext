<script>
export default {
    name: 'AboutView'
}
</script>

<script setup>
import { useRoute } from 'vue-router';

const $route = useRoute();
</script>

<template>
  <div class="about">
    <h1>This is an about page {{ $route.params.type }}</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
