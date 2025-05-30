<template>
  <MenuNav />
  <section class="auth-section">
    <div class="auth-container">
      <form id="login-form" class="auth-form" @submit.prevent="login">
        <h2>Iniciar Sesión</h2>
        <input v-model="form.correo" type="email" placeholder="Correo Electrónico" required />
        <input v-model="form.contrasena" type="password" placeholder="Contraseña" required />
        <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
        <div v-if="error" style="color:red;">{{ error }}</div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import MenuNav from '@/components/MenuNav.vue';
import { loginHuesped } from '@/store/session.js';

const form = reactive({
  correo: '',
  contrasena: ''
});
const error = ref('');

async function login() {
  error.value = '';
  try {
    const res = await axios.post('http://127.0.0.1:8000/api/login', form);
    if (res.data.ok) {
      loginHuesped(res.data.user); // Guarda todo el usuario
      window.location.href = '/';
    }
  } catch (e) {
    error.value = e.response?.data?.error || 'Credenciales inválidas';
  }
}
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
  background: url('../img/banner3.png') no-repeat center center/cover;
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