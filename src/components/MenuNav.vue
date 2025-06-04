<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <router-link to="/" class="flex items-center no-underline">
        <img :src="logo" width="120" alt="Luxury Space Logo" class="mr-2">
        <h1 class="m-0">Luxury Space</h1>
      </router-link>
    </div>
    <div class="navbar-links">
      <router-link to="/">Inicio</router-link>
      <router-link to="/departamentos">Departamentos</router-link>
      <router-link to="/amenidades">Amenidades</router-link>
      <router-link to="/ubicacion">Ubicación</router-link>
      <router-link to="/multas">Multas</router-link>
      <router-link to="/galeria">Galería</router-link>
      <template v-if="!huesped || !huesped.id">
        <router-link to="/login">Iniciar sesión</router-link>
        <router-link to="/register">Registrarte</router-link>
      </template>
      <template v-else>
        <button @click="openProfile" class="btn btn-primary">Perfil</button>
      </template>
    </div>
    
    <div v-if="showProfile && huesped" class="modal-perfil">
      <div class="modal-content">
        <h2>Perfil de usuario</h2>
        <p><b>Nombre:</b> {{ huesped.nombre }} {{ huesped.apellidos }}</p>
        <p><b>Correo:</b> {{ huesped.correo }}</p>
        <p><b>Teléfono:</b> {{ huesped.telefono }}</p>
        <p><b>Fecha de registro:</b> {{ huesped.fecha_registro }}</p>
        <button @click="cerrarSesion" class="btn btn-primary">Cerrar sesión</button>
        <button @click="closeProfile" class="btn btn-outline">Cerrar</button>
        
        <div v-if="huesped && todasMultas.length" class="historial-multas">
          <h3>Multas</h3>
          <ul>
            <li v-for="multa in todasMultas" :key="multa._id">
              <b>${{ multa.monto }}</b> - {{ multa.motivo }} ({{ multa.estado }}) - {{ multa.fecha_emision }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    
<div v-if="notiMostrada" class="notificaciones">
  <div class="notificacion">
    <button class="cerrar-noti" @click="descartar">×</button>
    <div class="noti-header">
      <strong>¡Tienes una nueva notificacion!</strong>
      <span class="noti-tipo">Multa</span>
    </div>
    <div class="noti-body">
      <div class="noti-row">
        <span class="noti-label"><b>Monto:</b></span>
        <span class="noti-value">${{ notiMostrada.monto }}</span>
      </div>
      <div class="noti-row">
        <span class="noti-label"><b>Motivo:</b></span>
        <span class="noti-value">{{ notiMostrada.motivo }}</span>
      </div>
      <div class="noti-row">
        <span class="noti-label"><b>Estado:</b></span>
        <span class="noti-value">{{ notiMostrada.estado }}</span>
      </div>
      <div class="noti-row">
        <span class="noti-label"><b>Fecha:</b></span>
        <span class="noti-value">{{ notiMostrada.fecha_emision }}</span>
      </div>
    </div>
  </div>
</div>

<div class="navbar-noti">
  <div class="noti-bell" @click="goToNotificaciones">
<i class="mdi mdi-bell-outline">🔔</i>
    <span v-if="contadorNoLeidas > 0" class="noti-count">{{ contadorNoLeidas }}</span>
  </div>
</div>
  </nav>
</template>

<script setup>
import logo from '/img/logo.png';
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { huesped, logoutHuesped } from '@/store/session.js';
import { useRouter } from 'vue-router';
import Multas from '@/views/Multas.vue';


const showProfile = ref(false);
const todasMultas = ref([]);
const notiMostrada = ref(null);
const descartadas = ref(JSON.parse(localStorage.getItem('multas_descartadas') || '[]'));
const lastNotiId = ref(localStorage.getItem('last_noti_id') || null);

let autoHideTimer = null;
let intervalId = null;


const contadorNoLeidas = ref(0);
const router = useRouter();

function goToNotificaciones() {
  router.push('/notificaciones');
}

async function actualizarContadorNoLeidas() {
  const userId = huesped.value?.id || huesped.value?._id;
  if (!userId) {
    contadorNoLeidas.value = 0;
    return;
  }
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/multas/huesped/${userId}`);
    contadorNoLeidas.value = res.data.filter(m => m.vista === false).length;
  } catch {
    contadorNoLeidas.value = 0;
  }
}

async function fetchTodasMultas() {
  const userId = huesped.value?.id || huesped.value?._id;
  if (!userId) {
    todasMultas.value = [];
    return;
  }

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/multas/huesped/${userId}`);
    todasMultas.value = response.data;
  } catch (error) {
    console.error('Error al obtener todas las multas:', error);
    todasMultas.value = [];
  }
}

async function fetchMultaReciente() {
  const userId = huesped.value?.id || huesped.value?._id;
  if (!userId) {
    notiMostrada.value = null;
    return;
  }

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/multas/huesped/reciente/${userId}`);
    const multa = response.data;
    if (multa && 
        !descartadas.value.includes(multa._id) && 
        (!lastNotiId.value || multa._id > lastNotiId.value)) {
      
      notiMostrada.value = multa;
      lastNotiId.value = multa._id;
      localStorage.setItem('last_noti_id', lastNotiId.value);
      
      if (autoHideTimer) {
        clearTimeout(autoHideTimer);
      }
      autoHideTimer = setTimeout(descartar, 20000);
    }
  } catch (error) {
    console.error('Error al obtener multa reciente:', error);
    notiMostrada.value = null;
  }
  await actualizarContadorNoLeidas();
}

function descartar() {
  if (notiMostrada.value) {
    descartadas.value.push(notiMostrada.value._id);
    localStorage.setItem('multas_descartadas', JSON.stringify(descartadas.value));
    notiMostrada.value = null;
  }
  
  if (autoHideTimer) {
    clearTimeout(autoHideTimer);
    autoHideTimer = null;
  }
}

function openProfile() {
  showProfile.value = true;
  fetchTodasMultas();
}

function closeProfile() {
  showProfile.value = false;
}

function cerrarSesion() {
  logoutHuesped();
  closeProfile();
  window.location.href = '/';
}

onMounted(() => {
  fetchMultaReciente();
  actualizarContadorNoLeidas();
  intervalId = setInterval(() => {
    fetchMultaReciente();
    actualizarContadorNoLeidas();
    if (showProfile.value) {
      fetchTodasMultas();
    }
  }, 8000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  if (autoHideTimer) {
    clearTimeout(autoHideTimer);
  }
});


</script>

<style scoped>
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
  line-height: 1;
  display: flex;
  align-items: center;
}
.navbar-links a {
  margin-left: 20px;
  color: white;
  text-decoration: none;
  font-weight: 500;
}
.navbar-logo .flex {
  display: flex;
  align-items: center;
}
.navbar-links a:hover {
  color: #d4af37;
}
.navbar-logo a {
  text-decoration: none;
  color: inherit;
}
.btn {
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
  margin-left: 20px;
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
  margin-top: 10px;
}

.btn-outline:hover {
  background-color: #f0f0f0;
}

.modal-perfil {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  max-height: 80vh;
  width: 100%;
  text-align: center;
  overflow-y: auto;
}
.modal-content h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #111;
}
.modal-content p {
  font-size: 1rem;
  margin-bottom: 15px;
  color: #333;
}
.modal-content button {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
.modal-content .btn-primary {
  background-color: #009FE3;
  color: white;
}
.modal-content .btn-primary:hover {
  background-color: #007cb3;
}
.historial-multas {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
.historial-multas h3 {
  color: #000000;
  margin-bottom: 15px;
}
.historial-multas ul {
  list-style: none;
  padding: 0;
  color: #000000;
  text-align: left;
}
.historial-multas li {
  padding: 8px;
  margin-bottom: 5px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #000000;
}
.notificaciones {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 320px;
}
.noti-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
  gap: 4px;
}
.navbar-noti {
  position: relative;
  margin-left: 20px;
  display: flex;
  align-items: center;
}
.noti-bell {
  color: #0957ff;
  font-size: 32px;
  display: flex;
  align-items: center;
  position: relative;
}
.noti-bell i {
  font-size: 32px;
  margin-right: 4px;
}
.noti-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ecc80f;
  color: white;
  border-radius: 50%;
  font-size: 0.85em;
  padding: 2px 7px;
  font-weight: bold;
  min-width: 22px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}
.noti-tipo {
  background: #ffe58f;
  color: #ad6800;
  font-size: 0.95em;
  padding: 2px 10px;
  border-radius: 6px;
  font-weight: 600;
  margin-top: 2px;
}
.noti-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.noti-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.noti-label {
  min-width: 70px;
  font-weight: 500;
}
.noti-value {
  font-weight: 600;
  color: #ad6800;
  margin-left: 10px;
  word-break: break-word;
}
.notificacion {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 16px 32px 16px 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #ad6800;
  font-size: 1rem;
  position: relative;
  animation: slideIn 0.3s ease-out;
}
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.cerrar-noti {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: #ad6800;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
}
.cerrar-noti:hover {
  color: #d48806;
}
</style>