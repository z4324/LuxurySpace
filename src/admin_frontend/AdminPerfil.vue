<template>
  <section class="perfil-section">
    <div class="perfil-container">
      <h2>Perfil de Administrador</h2>
      
      <div v-if="admin" class="admin-info">
        <div class="info-group">
          <label>Nombre:</label>
          <span>{{ admin.nombre }}</span>
        </div>
        <div class="info-group">
          <label>Apellidos:</label>
          <span>{{ admin.apellidos }}</span>
        </div>
        <div class="info-group">
          <label>Email:</label>
          <span>{{ admin.email }}</span>
        </div>
        <div class="info-group">
          <label>Rol:</label>
          <span>{{ admin.rol }}</span>
        </div>
        <div class="info-group">
          <label>Fecha de registro:</label>
          <span>{{ formatDate(admin.fecha_registro) }}</span>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-primary" @click="showEditForm = true">
          Editar Perfil
        </button>
        <button class="btn btn-secondary" @click="showPasswordForm = true">
          Cambiar Contraseña
        </button>
        <router-link to="/admin/dashboard" class="btn btn-tertiary">
          Volver al Dashboard
        </router-link>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="message" class="success">{{ message }}</p>
    </div>

    <transition name="slide-fade">
      <div v-if="showEditForm" class="modal-overlay">
        <div class="modal-content">
          <h3>Editar Perfil</h3>
          <form @submit.prevent="editarPerfil">
            <div class="form-group">
              <label>Nombre:</label>
              <input type="text" v-model="editForm.nombre" required />
            </div>
            <div class="form-group">
              <label>Apellidos:</label>
              <input type="text" v-model="editForm.apellidos" required />
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Guardando...' : 'Guardar' }}
              </button>
              <button type="button" class="btn btn-secondary" @click="showEditForm = false">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <transition name="slide-fade">
      <div v-if="showPasswordForm" class="modal-overlay">
        <div class="modal-content">
          <h3>Cambiar Contraseña</h3>
          <form @submit.prevent="cambiarContrasena">
            <div class="form-group">
              <label>Contraseña actual:</label>
              <input type="password" v-model="passwordForm.password_actual" required />
            </div>
            <div class="form-group">
              <label>Nueva contraseña:</label>
              <input type="password" v-model="passwordForm.nueva_password" required minlength="6" />
            </div>
            <div class="form-group">
              <label>Confirmar nueva contraseña:</label>
              <input type="password" v-model="passwordForm.nueva_password_confirmation" required minlength="6" />
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Cambiando...' : 'Cambiar Contraseña' }}
              </button>
              <button type="button" class="btn btn-secondary" @click="showPasswordForm = false">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const admin = ref(null);
const loading = ref(false);
const error = ref('');
const message = ref('');
const showEditForm = ref(false);
const showPasswordForm = ref(false);

const editForm = reactive({
  nombre: '',
  apellidos: ''
});

const passwordForm = reactive({
  password_actual: '',
  nueva_password: '',
  nueva_password_confirmation: ''
});

const getAdminToken = () => {
  return localStorage.getItem('admin_token') || localStorage.getItem('token');
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES');
};

onMounted(async () => {
  const adminData = localStorage.getItem('admin');
  if (adminData) {
    admin.value = JSON.parse(adminData);
    editForm.nombre = admin.value.nombre;
    editForm.apellidos = admin.value.apellidos;
  }
});

async function editarPerfil() {
  loading.value = true;
  error.value = '';
  message.value = '';
  
  try {
    const token = getAdminToken();
    const response = await axios.post('http://127.0.0.1:8000/api/admin/editar-perfil', editForm, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    admin.value = response.data.admin;
    localStorage.setItem('admin', JSON.stringify(admin.value));
    message.value = response.data.message;
    showEditForm.value = false;
    
  } catch (e) {
    console.error('Error al editar perfil:', e);
    error.value = e.response?.data?.error || e.response?.data?.message || 'Error al editar perfil';
  } finally {
    loading.value = false;
  }
}

async function cambiarContrasena() {
  if (passwordForm.nueva_password !== passwordForm.nueva_password_confirmation) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }
  
  loading.value = true;
  error.value = '';
  message.value = '';
  
  try {
    const token = getAdminToken();
    const response = await axios.post('http://127.0.0.1:8000/api/admin/actualizar-contrasena', passwordForm, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    message.value = response.data.message;
    showPasswordForm.value = false;
    passwordForm.password_actual = '';
    passwordForm.nueva_password = '';
    passwordForm.nueva_password_confirmation = '';
    
  } catch (e) {
    console.error('Error al cambiar contraseña:', e);
    error.value = e.response?.data?.error || e.response?.data?.message || 'Error al cambiar contraseña';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.perfil-section {
  min-height: 100vh;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.perfil-container {
  background: white;
  padding: 40px;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.perfil-container h2 {
  text-align: center;
  color: #dc3545;
  margin-bottom: 30px;
}

.admin-info {
  margin-bottom: 30px;
}

.info-group {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.info-group label {
  font-weight: 600;
  color: #333;
}

.info-group span {
  color: #666;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
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

.btn-tertiary {
  background-color: #28a745;
  color: white;
}

.btn-tertiary:hover {
  background-color: #218838;
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
}

.success {
  color: #28a745;
  text-align: center;
  font-weight: 600;
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
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  color: #dc3545;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background-color: #f8f9fa;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #dc3545;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
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
