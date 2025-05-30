<template>
  <div>
    <MenuNav />
    <section class="banner">
      <div class="banner-content">
        <h1>
          VIVE LA EXPERIENCIA EN LUXURY SPACE, TU<br>
          SEGUNDO HOGAR EN<br>
          TULUM, QUINTANA ROO
        </h1>
        <h2>Departamentos vacacionales desde $2.3 MDP en Tulum, Quintana Roo.</h2>
        <p>
          Despierta con la brisa del mar Caribe y disfruta el atardecer desde tu rooftop privado.
          Compra tu departamento de lujo con instalaciones exclusivas a minutos de las playas
          paradisíacas de Tulum, Quintana Roo, para disfrutar la Riviera Maya, con vista al mar
          y alta plusvalía.
        </p>
        <div class="buttons">
          <button class="btn btn-primary">APARTAR DEPARTAMENTO</button>
          <button class="btn btn-outline">LLÁMANOS AL 33 01800 93200</button>
        </div>
      </div>
    </section>
    <section class="form-section">
      <div class="info-cards">
        <div class="card dark">
          <h3>Vive Luxury Space entrega inmediata</h3>
          <p class="etapa">Etapa 1</p>
          <p>Facilidades de pago y empieza a vivir el estilo de vida que mereces en junio 2025.
            Últimos departamentos disponibles.</p>
          <strong>¡Aparta el tuyo!</strong>
        </div>
        <div class="card dark">
          <h3>Vive Luxury Space en preventa</h3>
          <p class="etapa">Etapas 2 y 3</p>
          <p>Promoción vigente: Enganche desde $100,000 MXN y mensualidades desde $20,000 MXN.</p>
          <strong>¡Aparta el tuyo!</strong>
        </div>
      </div>
      <div class="form-container">
        <h2>Quiero mi departamento en Luxury Space.</h2>
        <form @submit.prevent="handleSubmit">
          <input type="text" v-model="form.nombre" placeholder="Nombre" required />
          <input type="tel" v-model="form.telefono" placeholder="Teléfono" required />
          <input type="email" v-model="form.email" placeholder="Correo Electrónico" required />
          <select v-model="form.etapa" required>
            <option disabled value="">Etapa de interés</option>
            <option>Etapa 1 (Entrega inmediata)</option>
            <option>Etapas 2 y 3 (Preventa)</option>
          </select>
          <textarea v-model="form.mensaje" placeholder="Mensaje"></textarea>
          <button type="submit" class="btn btn-primary">Enviar mensaje</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import MenuNav from '@/components/MenuNav.vue';

const form = reactive({
  nombre: '',
  telefono: '',
  email: '',
  etapa: '',
  mensaje: ''
});
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
      color: #d4af37; /* Dorado suave */
    }

    .banner {
      background: #111 url('../img/banner.png') no-repeat center center/cover; /* Imagen con fallback */
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
      background: rgba(0, 0, 0, 0.4); /* Oscurecer fondo */
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


</style>