<template>
  <div class="editar-perfil-container">
    <h2>Editar perfil</h2>
    <form @submit.prevent="editarPerfil">
      <div class="form-group">
        <label>Nombre</label>
        <input v-model="form.nombre" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label>Apellidos</label>
        <input v-model="form.apellidos" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label>Teléfono</label>
        <input v-model="form.telefono" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label>Correo</label>
        <input :value="form.correo" type="email" class="form-control" disabled />
        <router-link to="/cambiar-correo" class="btn btn-outline-secondary mt-2">Cambiar correo</router-link>
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input value="********" type="password" class="form-control" disabled />
        <router-link to="/cambiar-contrasena" class="btn btn-outline-secondary mt-2">Cambiar contraseña</router-link>
      </div>
      <div v-if="error" class="alert alert-danger mt-2">{{ error }}</div>
      <div v-if="success" class="alert alert-success mt-2">{{ success }}</div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        Guardar cambios
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { huesped } from '@/store/session.js';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const error = ref('');
const success = ref('');
const loading = ref(false);

const form = reactive({
  nombre: '',
  apellidos: '',
  telefono: '',
  correo: ''
});

onMounted(() => {
  if (huesped.value) {
    form.nombre = huesped.value.nombre || '';
    form.apellidos = huesped.value.apellidos || '';
    form.telefono = huesped.value.telefono || '';
    form.correo = huesped.value.correo || '';
  }
});

async function editarPerfil() {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    const token = localStorage.getItem('token');
    const { nombre, apellidos, telefono } = form;
    const res = await axios.post(
      'http://127.0.0.1:8000/api/editar-perfil',
      { nombre, apellidos, telefono },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    success.value = 'Datos actualizados correctamente.';
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al actualizar perfil.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.editar-perfil-container {
  max-width: 400px;
  margin: 40px auto;
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
.form-group {
  margin-bottom: 18px;
}
.btn {
  width: 100%;
}
</style>