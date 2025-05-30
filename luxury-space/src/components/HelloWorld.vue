<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>Welcome to Luxury Space, your ultimate destination for luxury living.</p>
    <p>Explore our exclusive collection of high-end properties and services.</p>
  </div>
</template>

<script setup>
defineProps(['msg'])
</script>

<style scoped>
.hello {
  text-align: center;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  font-size: 2.5em;
}

p {
  color: #34495e;
  font-size: 1.2em;
}
</style>