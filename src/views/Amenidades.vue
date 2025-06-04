<template>
  <MenuNav />
  <section class="amenities-section">
    <div class="amenities-content">
      <h1>Disfruta de Amenidades Exclusivas</h1>
      <p>En Luxury Space, cada detalle está diseñado para ofrecerte una experiencia de lujo incomparable. Descubre nuestras amenidades de primer nivel que elevan tu estilo de vida en el corazón de Tulum.</p>
      <div class="amenities-grid">
        <div class="amenity-card">
          <img :src="pool" alt="Piscina Infinity">
          <h3>Piscina Infinity</h3>
          <p>Relájate en nuestra piscina infinity con vistas panorámicas al mar Caribe, perfecta para disfrutar del atardecer.</p>
        </div>
        <div class="amenity-card">
          <img :src="gym" alt="Gimnasio Moderno">
          <h3>Gimnasio Moderno</h3>
          <p>Mantente en forma con equipos de última generación en un espacio diseñado para tu bienestar.</p>
        </div>
        <div class="amenity-card">
          <img :src="spa" alt="Spa de Lujo">
          <h3>Spa de Lujo</h3>
          <p>Sumérgete en la relajación con tratamientos exclusivos en nuestro spa inspirado en la naturaleza de Tulum.</p>
        </div>
        <div class="amenity-card">
          <img :src="rooftop" alt="Rooftop Privado">
          <h3>Rooftop Privado</h3>
          <p>Disfruta de momentos inolvidables en tu propio rooftop con vistas espectaculares y jacuzzi privado.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import MenuNav from '@/components/MenuNav.vue'
import pool from '/img/pool.jpg'
import gym from '/img/gym.png'
import spa from '/img/spa.jpg'
import rooftop from '/img/rooftop.jpg'
</script>

<style>
 body {
      margin: 0;
      font-family: 'Montserrat', sans-serif;
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

    .banner {
      background: #111 url('../img/banner.png') no-repeat center center/cover;
      height: 100vh;
      color: white;
      display: flex;
      align-items: center;
      padding: 0 5%;
      position: relative;
    }

    .banner::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }

    .banner-content {
      position: relative;
      z-index: 2;
      max-width: 600px;
    }

    .banner h1 {
      font-size: 2.8rem;
      font-weight: 700;
      margin-bottom: 15px;
      line-height: 1.2;
    }

    .banner h2 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .banner p {
      font-size: 1rem;
      line-height: 1.5;
      margin-bottom: 25px;
    }

    .buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 20px;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      transition: 0.3s;
    }

    .btn-primary {
      background-color: #009FE3;
      color: white;
    }

    .btn-primary:hover {
      background-color: #007cb3;
    }

    .btn-outline {
      background-color: white;
      color: #009FE3;
      border: 2px solid #009FE3;
    }

    .btn-outline:hover {
      background-color: #f0f0f0;
    }

    @media (max-width: 768px) {
      .banner {
        padding: 0 20px;
        text-align: center;
        justify-content: center;
      }
    }
    .form-section {
  background: url('../img/banner2.png') no-repeat center center/cover;
  padding: 60px 5%;
  color: #111;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 20px;
  border-radius: 12px;
  max-width: 300px;
  flex: 1;
}

.card .etapa {
  font-style: italic;
  color: #d4af37;
  margin-bottom: 8px;
}

.form-container {
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  max-width: 700px;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.form-container h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #111;
}

.form-container form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-container input,
.form-container select,
.form-container textarea {
  padding: 12px;
  border: none;
  background-color: #f1f6fb;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
}

.form-container textarea {
  resize: vertical;
  min-height: 100px;
}
    .amenities-section {
      background: url('img/amenities-bg.png') no-repeat center center/cover;
      padding: 60px 5%;
      color: white;
      text-align: center;
      position: relative;
    }

    .amenities-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
    }

    .amenities-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
    }

    .amenities-content h1 {
      font-size: 2.8rem;
      font-weight: 700;
      margin-bottom: 15px;
    }

    .amenities-content p {
      font-size: 1.2rem;
      line-height: 1.5;
      margin-bottom: 40px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(580px, 1fr));
      gap: 20px;
      justify-content: center;
    }

    .amenity-card {
      background-color: rgba(0, 0, 0, 0.75);
      padding: 20px;
      border-radius: 12px;
      text-align: left;
      transition: transform 0.3s;
    }

    .amenity-card:hover {
      transform: translateY(-10px);
    }

    .amenity-card img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .amenity-card h3 {
      font-size: 1.5rem;
      margin-bottom: 10px;
    }

    .amenity-card p {
      font-size: 1rem;
      line-height: 1.4;
    }

    @media (max-width: 768px) {
      .amenities-content h1 {
        font-size: 2rem;
      }

      .amenities-content p {
        font-size: 1rem;
      }
    }
</style>