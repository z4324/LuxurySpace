<template>
  <div class="change-email-bg">
    <div class="change-email-container">
      <h2>Cambiar correo electrónico</h2>
      <form @submit.prevent="abrirModal">
        <div class="form-group">
          <label>Correo actual</label>
          <input :value="correoActual" type="email" class="form-control" readonly />
        </div>
        <div class="form-group">
          <label>Nuevo correo</label>
          <input v-model="nuevoCorreo" type="email" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loadingCorreo">Actualizar correo</button>
        <div v-if="correoError" class="alert alert-danger mt-2">{{ correoError }}</div>
        <div v-if="correoSuccess" class="alert alert-success mt-2">{{ correoSuccess }}</div>
      </form>
    </div>
    <div v-if="mostrarModal" class="modal-bg">
      <div class="modal-content">
        <h4>Por seguridad, ingresa tu contraseña actual</h4>
        <input v-model="contrasenaActual" type="password" class="form-control" placeholder="Contraseña actual" />
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
          <button class="btn btn-primary" @click="cambiarCorreo">Aceptar</button>
        </div>
        <div v-if="modalError" class="alert alert-danger mt-2">{{ modalError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { huesped } from '@/store/session.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const correoActual = huesped.value?.correo || '';
const nuevoCorreo = ref('');
const correoError = ref('');
const correoSuccess = ref('');
const loadingCorreo = ref(false);

const mostrarModal = ref(false);
const contrasenaActual = ref('');
const modalError = ref('');

function abrirModal() {
  correoError.value = '';
  correoSuccess.value = '';
  modalError.value = '';
  if (!nuevoCorreo.value || !/^[^@]+@[^@]+\.[^@]+$/.test(nuevoCorreo.value)) {
    correoError.value = 'Ingresa un correo válido.';
    return;
  }
  if (nuevoCorreo.value === correoActual) {
    correoError.value = 'El nuevo correo debe ser diferente al actual.';
    return;
  }
  mostrarModal.value = true;
}

function cerrarModal() {
  mostrarModal.value = false;
  contrasenaActual.value = '';
  modalError.value = '';
}

async function cambiarCorreo() {
  modalError.value = '';
  loadingCorreo.value = true;
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://127.0.0.1:8000/api/cambiar-correo', {
      nuevo_correo: nuevoCorreo.value,
      contrasena_actual: contrasenaActual.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    correoSuccess.value = 'Correo actualizado correctamente.';
    setTimeout(() => router.push('/'), 1200); 
  } catch (e) {
    modalError.value = e.response?.data?.error || 'Error al cambiar correo.';
  } finally {
    loadingCorreo.value = false;
  }
}
</script>

<style scoped>
.change-email-bg {
  min-height: 100vh;
  background: url('../img/banner3.png') no-repeat center center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
}
.change-email-container {
  background: #fff;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  min-width: 340px;
}
.form-group {
  margin-bottom: 18px;
}
.btn {
  width: 100%;
}
.modal-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 32px 24px;
  border-radius: 12px;
  min-width: 320px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
  text-align: center;
}
.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  justify-content: center;
}
</style>