<template>
      <MenuNav />
<section class="location-section">
    <div class="location-content">
      <h1>Ubicación Privilegiada en Tulum</h1>
      <p>Luxury Space se encuentra en el corazón de Tulum, a pocos minutos de las playas de arena blanca y las ruinas mayas. Disfruta de la perfecta combinación entre naturaleza, cultura y lujo en la Riviera Maya.</p>
      <div class="map-container">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.071682689496!2d-87.46313968508776!3d20.21141898643824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDEyJzQxLjEiTiA4N8KwMjcnNDcuMyJX!5e0!3m2!1ses!2smx!4v1635783921847" allowfullscreen="" loading="lazy"></iframe>
      </div>
      <div class="location-details">
        <div class="detail-card">
          <h3>Cercanía a Playas</h3>
          <p>A solo 5 minutos de las playas más hermosas de Tulum, perfectas para relajarte o practicar deportes acuáticos.</p>
        </div>
        <div class="detail-card">
          <h3>Acceso a Cultura</h3>
          <p>Explora las ruinas mayas de Tulum y los cenotes cercanos, a pocos kilómetros de tu nuevo hogar.</p>
        </div>
        <div class="detail-card">
          <h3>Conectividad</h3>
          <p>A 90 minutos del Aeropuerto Internacional de Cancún, con fácil acceso a tiendas y restaurantes de lujo.</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { reactive } from 'vue';
import MenuNav from '@/components/MenuNav.vue';
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
.location-section {
      background: url('img/location.png') no-repeat center center/cover;
      padding: 60px 5%;
      color: #111;
      text-align: center;
      position: relative;
    }

    .location-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
    }

    .location-content {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 2; 
    }

    .location-content h1 {
      font-size: 2.8rem;
      font-weight: 700;
      margin-bottom: 15px;
      color: white;
    }

    .location-content p {
      font-size: 1.2rem;
      line-height: 1.5;
      margin-bottom: 40px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      color: white;
    }

    .map-container {
      margin-bottom: 40px;
    }

    .map-container iframe {
      width: 100%;
      height: 450px;
      border: none;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .location-details {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
    }

    .detail-card {
      background-color: rgba(255, 255, 255, 0.9);
      padding: 20px;
      border-radius: 12px;
      max-width: 300px;
      flex: 1;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .detail-card h3 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: #009FE3;
    }

    .detail-card p {
      font-size: 1rem;
      line-height: 1.4;
      color: #111;
    }

    @media (max-width: 768px) {
      .location-content h1 {
        font-size: 2rem;
      }

      .location-content p {
        font-size: 1rem;
      }

      .map-container iframe {
        height: 300px;
      }
    }
</style>