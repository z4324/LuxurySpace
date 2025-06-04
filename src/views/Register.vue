<template>
  <MenuNav />
  <section class="auth-section">
    <div class="auth-container">
      <form id="register-form" class="auth-form" @submit.prevent="register">
        <h2>Registrarte</h2>
        <div class="form-group">
          <input type="text" v-model="form.nombre" placeholder="Nombre" required />
          <span v-if="errors.nombre" class="error">{{ errors.nombre[0] }}</span>
        </div>
        <div class="form-group">
          <input type="text" v-model="form.apellidos" placeholder="Apellidos" required />
          <span v-if="errors.apellidos" class="error">{{ errors.apellidos[0] }}</span>
        </div>
        <div class="form-group">
          <input type="tel" v-model="form.telefono" placeholder="Teléfono" required />
          <span v-if="errors.telefono" class="error">{{ errors.telefono[0] }}</span>
        </div>
        <div class="form-group">
          <input type="email" v-model="form.correo" placeholder="Correo Electrónico" required />
          <span v-if="errors.correo" class="error">{{ errors.correo[0] }}</span>
        </div>
        <div class="form-group">
          <input type="password" v-model="form.contrasena" placeholder="Contraseña" required />
          <span v-if="errors.contrasena" class="error">{{ errors.contrasena[0] }}</span>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrarte' }}
        </button>
        <p v-if="success" class="success">¡Registro exitoso! Redirigiendo...</p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import MenuNav from '@/components/MenuNav.vue';

const router = useRouter();
const form = reactive({
  nombre: '',
  apellidos: '',
  telefono: '',
  correo: '',
  contrasena: '',
});
const errors = ref({});
const loading = ref(false);
const success = ref(false);

const register = async () => {
  loading.value = true;
  errors.value = {};
  success.value = false;

  try {
    console.log('Enviando datos:', form); // Para depurar
    const response = await axios.post('http://127.0.0.1:8000/api/register', form, {
      headers: { 'Content-Type': 'application/json' }
    });
    success.value = true;
    setTimeout(() => {
      router.push({ name: 'Login' });
    }, 2000);
  } catch (error) {
    console.error('Error completo:', error.response || error); // Para depurar
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors;
    } else {
      errors.value.general = 'Error al registrar. Por favor, intenta de nuevo.';
    }
  } finally {
    loading.value = false;
  }
};

</script>

<style>
body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  background-color: #111;
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

.auth-section {
  background: url('../img/banner4.png') no-repeat center center/cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.auth-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.auth-container {
  background-color: white;
  padding: 40px;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  position: relative;
  z-index: 2;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.auth-form h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #111;
}

.auth-form input,
.auth-form select {
  padding: 12px;
  border: none;
  background-color: #f1f6fb;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  width: 100%; 
  box-sizing: border-box;
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
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

@media (max-width: 768px) {
  .auth-container {
    padding: 20px;
  }
}
</style>