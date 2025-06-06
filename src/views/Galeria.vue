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
import '@/assets/styles/gallery.css'
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
