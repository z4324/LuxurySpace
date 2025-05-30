<template>
  <div class="home">
    <h1>Welcome to Luxury Space</h1>
    <p>Your one-stop destination for luxury living.</p>
    <img src="@/assets/luxury-space-image.jpg" alt="Luxury Space" />
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  color: var(--color-primary);
}

p {
  font-size: 1.2rem;
  color: var(--color-secondary);
}

img {
  max-width: 100%;
  height: auto;
  margin-top: 1rem;
}
</style>