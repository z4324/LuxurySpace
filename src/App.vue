<template>
  <Notificaciones />
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import MenuNav from './components/MenuNav.vue';
</script>

<style scoped>
#app {
  font-family: 'Montserrat', sans-serif;
}
</style>