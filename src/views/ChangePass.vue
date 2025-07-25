<template>
  <section class="recovery-section">
    <div class="recovery-container">
      <div class="d-flex align-items-center mb-4">
        <button @click="router.back()" class="btn btn-link p-0 me-3 back-arrow" aria-label="Regresar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
        </button>
        <h2 class="mb-0">Cambiar contraseña</h2>
      </div>
      <form @submit.prevent="cambiarContrasena" class="text-center">
        <div class="mb-4">
          <div class="position-relative mb-3">
            <input
              v-model="contrasena_actual"
              :type="showActual ? 'text' : 'password'"
              class="form-control form-control-lg"
              placeholder="Contraseña actual"
              required
            />
            <button type="button" class="eye-btn" @click="showActual = !showActual">
              <i :class="showActual ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
          <div class="position-relative mb-3">
            <input
              v-model="nueva_contrasena"
              :type="showNueva ? 'text' : 'password'"
              class="form-control form-control-lg"
              placeholder="Nueva contraseña"
              required
            />
            <button type="button" class="eye-btn" @click="showNueva = !showNueva">
              <i :class="showNueva ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
          <div class="position-relative mb-4">
            <input
              v-model="confirmar_contrasena"
              :type="showConfirmar ? 'text' : 'password'"
              class="form-control form-control-lg"
              placeholder="Confirmar nueva contraseña"
              required
            />
            <button type="button" class="eye-btn" @click="showConfirmar = !showConfirmar">
              <i :class="showConfirmar ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>
        <button class="btn btn-success btn-lg w-100 d-flex justify-content-center align-items-center" :disabled="loading" type="submit">
          <span v-if="loading" class="spinner me-2"></span>
          {{ loading ? 'Actualizando...' : 'Cambiar contraseña' }}
        </button>
        <div v-if="error" class="alert alert-danger mt-4 text-center">{{ error }}</div>
        <div v-if="success" class="alert alert-success mt-4 text-center">{{ success }}</div>
        <router-link to="/" class="d-block text-center mt-5 text-decoration-none text-muted">Volver al inicio</router-link>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const contrasena_actual = ref('');
const nueva_contrasena = ref('');
const confirmar_contrasena = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const showActual = ref(false);
const showNueva = ref(false);
const showConfirmar = ref(false);

async function cambiarContrasena() {
  error.value = '';
  success.value = '';
  if (!contrasena_actual.value || !nueva_contrasena.value || !confirmar_contrasena.value) {
    error.value = 'Completa todos los campos.';
    return;
  }
  if (nueva_contrasena.value.length < 6) {
    error.value = 'La nueva contraseña debe tener al menos 6 caracteres.';
    return;
  }
  if (nueva_contrasena.value !== confirmar_contrasena.value) {
    error.value = 'Las contraseñas no coinciden.';
    return;
  }
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    await axios.post('http://127.0.0.1:8000/api/actualizar-contrasena', {
      contrasena_actual: contrasena_actual.value,
      nueva_contrasena: nueva_contrasena.value,
      nueva_contrasena_confirmation: confirmar_contrasena.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    success.value = 'Contraseña actualizada correctamente.';
    setTimeout(() => router.push('/'), 1800);
  } catch (e) {
    error.value = e.response?.data?.error || 'Error al cambiar la contraseña.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.recovery-section {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a45a2, #d9e2ec); 
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
}
.recovery-container {
  background: #fff;
  padding: 40px 30px;
  border-radius: 16px;
  max-width: 450px; 
  width: 100%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
  animation: fadeIn 0.5s ease-out; 
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
h2 {
  color: #333;
  font-weight: 700;
  font-size: 1.8rem;
}
.form-control-lg {
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  transition: all 0.3s ease;
}
.form-control-lg:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
}
.position-relative {
  position: relative;
}
.eye-btn {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #888;
  font-size: 1.3rem;
}
.eye-btn:focus {
  outline: none;
}
.btn-success {
  background-color: #1168ff;
  border-color: #0049d1;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}
.btn-success:hover {
  background-color: #1c20ff;
  border-color: #4e18fe;
  transform: translateY(-2px);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.back-arrow {
  color: #6c757d;
  transition: color 0.3s ease;
}
.back-arrow:hover {
  color: #007bff;
}
.alert {
  border-radius: 8px;
  font-size: 0.95rem;
  padding: 12px 20px;
}
.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}
.alert-success {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}
.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid #fff;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>