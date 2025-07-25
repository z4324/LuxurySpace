<template>
  <section class="multas-section">
    <div class="multas-container">
      <h2>Crear Multa - Administrador</h2>
      <form @submit.prevent="crearMulta" class="multas-form">
        <div class="form-group">
          <label for="huesped_id">Huésped</label>
          <select v-model="form.huesped_id" required>
            <option value="" disabled>Selecciona un huésped</option>
            <option v-for="h in huespedes" :key="h.id" :value="h.id">
              {{ h.nombre }} {{ h.apellidos }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="monto">Monto</label>
          <input type="number" v-model="form.monto" required min="1" step="0.01" />
        </div>
        <div class="form-group">
          <label for="motivo">Motivo</label>
          <input type="text" v-model="form.motivo" required />
        </div>
        <div class="form-group">
          <label for="fecha_emision">Fecha de emisión</label>
          <input type="date" v-model="form.fecha_emision" required />
        </div>
        <div class="form-group">
          <label for="estado">Estado</label>
          <select v-model="form.estado" required>
            <option value="pendiente">Pendiente</option>
            <option value="pagada">Pagada</option>
          </select>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Enviando...' : 'Crear Multa' }}
          </button>
          <router-link to="/admin/dashboard" class="btn btn-secondary">
            Volver al Dashboard
          </router-link>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="debugInfo" class="debug">{{ debugInfo }}</p>
      </form>
    </div>
  </section>

  <transition name="slide-fade">
    <div v-if="success" class="modal-overlay">
      <div class="modal-content">
        <h3>¡Éxito!</h3>
        <p>Multa creada correctamente</p>
        <button class="btn btn-close" @click="success = false"></button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const huespedes = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref(false);
const debugInfo = ref('');
const form = reactive({
  huesped_id: '',
  monto: '',
  motivo: '',
  fecha_emision: '',
  estado: 'pendiente'
});

onMounted(async () => {
  await cargarHuespedes();
});

async function cargarHuespedes() {
  try {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      error.value = 'No se encontró token de administrador. Por favor, inicia sesión nuevamente.';
      return;
    }

    debugInfo.value = 'Cargando huéspedes...';
    
    const res = await axios.get('http://127.0.0.1:8000/api/huespedes', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    huespedes.value = res.data;
    debugInfo.value = `${huespedes.value.length} huéspedes cargados correctamente`;
    
    setTimeout(() => {
      debugInfo.value = '';
    }, 3000);
    
  } catch (e) {
    console.error('Error cargando huéspedes:', e);
    if (e.response?.status === 401) {
      error.value = 'Token de administrador inválido o expirado. Por favor, inicia sesión nuevamente.';
    } else if (e.response?.status === 403) {
      error.value = 'No tienes permisos para acceder a esta información.';
    } else {
      error.value = 'No se pudieron cargar los huéspedes: ' + (e.response?.data?.message || e.message);
    }
  }
}

async function crearMulta() {
  loading.value = true;
  success.value = false;
  error.value = '';
  debugInfo.value = '';
  
  try {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      error.value = 'No se encontró token de administrador. Por favor, inicia sesión nuevamente.';
      return;
    }

    debugInfo.value = 'Creando multa...';
    
    const response = await axios.post('http://127.0.0.1:8000/api/multas', { 
      ...form 
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });
    
    success.value = true;
    debugInfo.value = 'Multa creada exitosamente';
    
    form.huesped_id = '';
    form.monto = '';
    form.motivo = '';
    form.fecha_emision = '';
    form.estado = 'pendiente';
    
  } catch (e) {
    console.error('Error creando multa:', e);
    if (e.response?.status === 401) {
      error.value = 'Token de administrador inválido o expirado. Por favor, inicia sesión nuevamente.';
    } else if (e.response?.status === 403) {
      error.value = 'No tienes permisos para crear multas.';
    } else if (e.response?.status === 422) {
      const validationErrors = e.response.data;
      if (typeof validationErrors === 'object') {
        error.value = 'Errores de validación: ' + Object.values(validationErrors).flat().join(', ');
      } else if (validationErrors.message) {
        error.value = validationErrors.message;
      } else {
        error.value = 'Error de validación en los datos enviados.';
      }
    } else {
      error.value = e.response?.data?.error || e.response?.data?.message || 'Error al crear la multa';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.multas-section {
  min-height: 100vh;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.multas-container {
  background: white;
  padding: 40px;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.multas-container h2 {
  text-align: center;
  color: #dc3545;
  margin-bottom: 30px;
}

.multas-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

input, select {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background-color: #f8f9fa;
}

input:focus, select:focus {
  outline: none;
  border-color: #dc3545;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s;
  text-align: center;
}

.btn-primary {
  background-color: #dc3545;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #c82333;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}

.btn:disabled {
  background: #aaa;
  cursor: not-allowed;
  transform: none;
}

.error {
  color: #dc3545;
  text-align: center;
  font-weight: 600;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 5px;
}

.debug {
  color: #155724;
  text-align: center;
  font-weight: 600;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 10px;
  border-radius: 5px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  color: #28a745;
  margin-bottom: 15px;
}

.btn-close {
  background-color: #dc3545;
  margin-top: 20px;
}

.btn-close:hover {
  background-color: #c82333;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
