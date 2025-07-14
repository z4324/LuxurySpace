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
        <div class="modal-header">
          <h2>Perfil de usuario</h2>
          <button @click="closeProfile" class="close-btn">×</button>
        </div>
        <div class="profile-info">
          <div class="row">
            <div class="col-12 col-md-6 mb-3">
              <div class="info-card">
                <h3>Información personal</h3>
                <div class="info-row">
                  <span class="info-label">Nombre:</span>
                  <span class="info-value">{{ huesped.nombre }} {{ huesped.apellidos }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Correo:</span>
                  <span class="info-value">{{ huesped.correo }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Teléfono:</span>
                  <span class="info-value">{{ huesped.telefono }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Fecha de registro:</span>
                  <span class="info-value">{{ huesped.fecha_registro }}</span>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6 mb-3">
              <div class="info-card">
                <h3>Multa más reciente</h3>
                <template v-if="todasMultas.length">
                  <div class="info-row">
                    <span class="info-label">Monto:</span>
                    <span class="info-value text-danger">${{ todasMultas[0].monto }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Motivo:</span>
                    <span class="info-value">{{ todasMultas[0].motivo }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Estado:</span>
                    <span class="info-value">{{ todasMultas[0].estado }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Fecha:</span>
                    <span class="info-value">{{ todasMultas[0].fecha_emision }}</span>
                  </div>
                  <div class="d-flex justify-content-end mt-2">
                    <button class="btn btn-outline-primary btn-sm" @click="modalMultas = true">
                      Ver todas
                    </button>
                  </div>
                </template>
                <template v-else>
                  <div class="text-muted">No tienes multas registradas.</div>
                </template>
              </div>
            </div>
          </div>
          <div class="sesiones-section mt-4">
            <button @click="toggleSesiones" class="btn btn-secondary mb-2">
              {{ showSesiones ? 'Ocultar sesiones' : 'Ver sesiones activas' }}
            </button>
            <div v-if="showSesiones" class="sesiones-table">
              <div v-if="cargandoSesiones" class="loading">Cargando sesiones...</div>
              <div v-else-if="errorSesiones" class="error">{{ errorSesiones }}</div>
              <table v-else class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Dispositivo</th>
                    <th>IP</th>
                    <th>Fecha de inicio</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sesion in sesiones" :key="sesion.id" :class="{ 'table-info': sesion.id === sesionActualId }">
                    <td>
                      <span v-html="getDeviceIcon(sesion.user_agent)"></span>
                      {{ getDeviceName(sesion.user_agent) }}
                      <span v-if="sesion.id === sesionActualId" class="current-label ms-2">(Esta sesión)</span>
                    </td>
                    <td>{{ sesion.ip || 'N/A' }}</td>
                    <td>{{ sesion.fecha_inicio || sesion.created_at }}</td>
                    <td>
                      <button
                        v-if="sesion.id !== sesionActualId"
                        @click="cerrarSesionRemota(sesion.id)"
                        class="btn btn-outline-danger btn-sm"
                      >Cerrar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                v-if="sesiones.length > 1"
                @click="cerrarOtrasSesiones"
                class="btn btn-danger btn-sm mt-2"
              >Cerrar todas las demás sesiones</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="cerrarSesion" class="btn btn-danger">Cerrar sesión</button>
          <button @click="closeProfile" class="btn btn-outline">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal de historial de multas -->
    <div v-if="modalMultas" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Historial de multas</h5>
            <button type="button" class="btn-close" @click="modalMultas = false"></button>
          </div>
          <div class="modal-body">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Monto</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="multa in todasMultas" :key="multa._id">
                  <td class="text-danger">${{ multa.monto }}</td>
                  <td>{{ multa.motivo }}</td>
                  <td>{{ multa.estado }}</td>
                  <td>{{ multa.fecha_emision }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="modalMultas = false">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="notiMostrada" class="notificaciones">
      <div class="notificacion">
        <button class="cerrar-noti" @click="descartar">×</button>
        <div class="noti-header">
          <strong>¡Tienes una nueva notificación!</strong>
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
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const showProfile = ref(false);
const todasMultas = ref([]);
const notiMostrada = ref(null);
const descartadas = ref(JSON.parse(localStorage.getItem('multas_descartadas') || '[]'));
const lastNotiId = ref(localStorage.getItem('last_noti_id') || null);

let autoHideTimer = null;
let intervalId = null;

const contadorNoLeidas = ref(0);
const router = useRouter();

const sesiones = ref([]);
const cargandoSesiones = ref(false);
const errorSesiones = ref('');
const sesionActualId = ref(null);
const showSesiones = ref(false);
const modalMultas = ref(false);



async function obtenerSesiones() {
  cargandoSesiones.value = true;
  errorSesiones.value = '';
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/sesion', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
    sesiones.value = res.data;
    const token = localStorage.getItem('token');
    const actual = sesiones.value.find(s => s.token === token || s.es_actual);
    sesionActualId.value = actual ? actual.id : null;
  } catch (e) {
    errorSesiones.value = 'No se pudieron cargar las sesiones';
    sesiones.value = [];
  } finally {
    cargandoSesiones.value = false;
  }
}

async function cerrarSesionRemota(id) {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/sesiones/${id}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
    await obtenerSesiones();
  } catch (e) {
    alert('Error al cerrar la sesión.');
  }
}

async function cerrarOtrasSesiones() {
  try {
    await axios.delete('http://127.0.0.1:8000/api/sesiones', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
    await obtenerSesiones();
  } catch (e) {
    alert('Error al cerrar otras sesiones.');
  }
}

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
    const res = await axios.get(
      `http://127.0.0.1:8000/api/multas/huesped/${userId}`,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    );
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
    const response = await axios.get(
      `http://127.0.0.1:8000/api/multas/huesped/${userId}`,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    );
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
    const response = await axios.get(
      `http://127.0.0.1:8000/api/multas/reciente/${userId}`,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    );
    const multa = response.data;
    if (
      multa &&
      !descartadas.value.includes(multa._id) &&
      (!lastNotiId.value || multa._id > lastNotiId.value)
    ) {
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
  obtenerSesiones();
}

function closeProfile() {
  showProfile.value = false;
  showSesiones.value = false;
}

function toggleSesiones() {
  showSesiones.value = !showSesiones.value;
}

async function cerrarSesion() {
  try {
    await axios.post('http://127.0.0.1:8000/api/sesiones/cerrar-actual', {}, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
  } catch (e) {
    console.error('Error al cerrar sesión:', e);
  }
  logoutHuesped();
  closeProfile();
  window.location.href = '/';
}

function getDeviceIcon(userAgent) {
  if (!userAgent) return '<i class="bi bi-question-circle"></i>';
  const ua = userAgent.toLowerCase();
  if (ua.includes('android')) return '<i class="bi bi-phone"></i>';
  if (ua.includes('iphone') || ua.includes('ipad')) return '<i class="bi bi-phone"></i>';
  if (ua.includes('windows')) return '<i class="bi bi-laptop"></i>';
  if (ua.includes('cros')) return '<i class="bi bi-pc-display"></i>';
  if (ua.includes('linux')) return '<i class="bi bi-pc-display-horizontal"></i>';
  if (ua.includes('mac')) return '<i class="bi bi-apple"></i>';
  if (ua.includes('firefox')) return '<i class="bi bi-fire"></i>';
  if (ua.includes('chrome')) return '<i class="bi bi-google"></i>';
  if (ua.includes('brave')) return '<i class="bi bi-shield-lock"></i>';
  if (ua.includes('safari')) return '<i class="bi bi-compass"></i>';
  return '<i class="bi bi-question-circle"></i>';
}

function getDeviceName(userAgent) {
  if (!userAgent) return 'Desconocido';
  const ua = userAgent.toLowerCase();
  if (ua.includes('android')) return 'Android';
  if (ua.includes('iphone')) return 'iPhone';
  if (ua.includes('ipad')) return 'iPad';
  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('cros')) return 'Chromebook';
  if (ua.includes('linux')) return 'Linux';
  if (ua.includes('mac')) return 'Mac';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('chrome')) return 'Chrome';
  if (ua.includes('brave')) return 'Brave';
  if (ua.includes('safari')) return 'Safari';
  return 'Desconocido';
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
  padding: 10px 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-logo {
  display: flex;
  align-items: center;
}

.navbar-logo img {
  height: 100px;
  margin-right: 15px;
}

.navbar-logo h1 {
  font-family: 'Great Vibes', cursive;
  font-size: 48px;
  margin: 0;
  color: white;
  line-height: 1;
}

.navbar-links a {
  margin-left: 25px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: color 0.3s;
}

.navbar-links a:hover {
  color: #d4af37;
}

.navbar-logo a {
  text-decoration: none;
  color: inherit;
}

.btn {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background-color: #009FE3;
  color: white;
}

.btn-primary:hover {
  background-color: #007cb3;
  transform: translateY(-1px);
}

.btn-outline {
  background-color: transparent;
  color: #009FE3;
  border: 2px solid #009FE3;
}

.btn-outline:hover {
  background-color: #f0f0f0;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
  transform: translateY(-1px);
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
  transform: translateY(-1px);
}

.modal-perfil {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.modal-header h2 {
  font-size: 1.8rem;
  margin: 0;
  color: #111;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}

.profile-info {
  padding: 30px;
}

.info-card, .multas-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.info-card h3, .multas-section h3 {
  font-size: 1.3rem;
  color: #111;
  margin: 0 0 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.info-label {
  font-weight: 600;
  color: #333;
  width: 30%;
}

.info-value {
  color: #555;
  width: 70%;
  text-align: right;
}

.multas-section ul {
  list-style: none;
  padding: 0;
}

.multas-section li {
  display: grid;
  grid-template-columns: 100px 1fr 150px;
  gap: 10px;
  padding: 12px;
  margin-bottom: 8px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.multa-amount {
  font-weight: 600;
  color: #dc3545;
}

.multa-details {
  color: #333;
}

.multa-date {
  color: #666;
  font-size: 0.9rem;
}

.sesiones-section {
  margin-top: 20px;
}

.sesiones-table {
  margin-top: 20px;
}

.sesiones-table table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sesiones-table th, .sesiones-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.sesiones-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.sesiones-table td {
  color: #555;
}

.current-session {
  background: #e9f7ff;
}

.current-label {
  color: #009FE3;
  font-size: 0.9rem;
  margin-left: 5px;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #dc3545;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  background: #f8f9fa;
  border-radius: 0 0 12px 12px;
}

.modal-footer .btn {
  width: auto;
  padding: 10px 20px;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
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