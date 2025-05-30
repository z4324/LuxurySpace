<template>
  <MenuNav />
  <section class="gallery-section">
    <div class="gallery-content">
      <h1>Galería de Luxury Space</h1>
      <p>Explora la belleza y el lujo de nuestros departamentos y amenidades. Cada espacio está diseñado para ofrecerte una experiencia única en Tulum.</p>
      <div class="carousel">
        <div class="carousel-images">
          <img :src="amenitiesBg" alt="Departamento de Lujo">
          <img :src="pool" alt="Piscina Infinity">
          <img :src="rooftop" alt="Rooftop Privado">
          <img :src="spa" alt="Spa Exclusivo">
        </div>
        <button class="carousel-prev">&#10094;</button>
        <button class="carousel-next">&#10095;</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import MenuNav from '@/components/MenuNav.vue'
import amenitiesBg from '/img/amenities-bg.png'
import pool from '/img/pool.jpg'
import rooftop from '/img/rooftop.jpg'
import spa from '/img/spa.jpg'
import { onMounted, ref } from 'vue'

const images = [amenitiesBg, pool, rooftop, spa]
const currentIndex = ref(0)
const carouselImages = ref(null)

function showImage(index) {
  if (index < 0) index = images.length - 1
  if (index >= images.length) index = 0
  currentIndex.value = index
  if (carouselImages.value) {
    carouselImages.value.style.transform = `translateX(-${currentIndex.value * 100}%)`
  }
}

onMounted(() => {
  carouselImages.value = document.querySelector('.carousel-images')
  showImage(0)
  document.querySelector('.carousel-prev').addEventListener('click', () => showImage(currentIndex.value - 1))
  document.querySelector('.carousel-next').addEventListener('click', () => showImage(currentIndex.value + 1))
  setInterval(() => showImage(currentIndex.value + 1), 5000)
})
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  background-color: #f8f8f8;
}

.navbar {
  background-color: #111;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 30px;
}

.navbar-logo {
  display: flex;
  align-items: center;
}

.navbar-logo img {
  height: 120px;
  margin-right: 10px;
}

.navbar-logo h1 {
  font-family: 'Great Vibes', cursive;
  font-size: 62px;
  margin: 0;
  color: white;
}

.navbar-links a {
  margin-left: 20px;
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.navbar-links a:hover {
  color: #d4af37;
}

.gallery-section {
  padding: 60px 5%;
  color: #111;
  text-align: center;
}

.gallery-content {
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-content h1 {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.gallery-content p {
  font-size: 1.2rem;
  line-height: 1.5;
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.carousel {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.carousel-images {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-images img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  flex-shrink: 0;
}

.carousel-prev, .carousel-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 1.5rem;
  border-radius: 50%;
}

.carousel-prev {
  left: 10px;
}

.carousel-next {
  right: 10px;
}

.carousel-prev:hover, .carousel-next:hover {
  background-color:rgb(237, 196, 63);
}

@media (max-width: 768px) {
  .gallery-content h1 {
    font-size: 2rem;
  }
  .gallery-content p {
    font-size: 1rem;
  }
  .carousel-images img {
    height: 300px;
  }
}
</style>