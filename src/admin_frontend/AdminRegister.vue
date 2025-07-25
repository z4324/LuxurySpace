<template>
  <section class="auth-section">
    <div class="auth-container">
      <form id="admin-register-form" class="auth-form" @submit.prevent="register">
        <h2>Registro - Administrador</h2>
        <input 
          v-model="form.nombre" 
          type="text" 
          placeholder="Nombre" 
          required 
          :disabled="loading"
        />
        <input 
          v-model="form.apellidos" 
          type="text" 
          placeholder="Apellidos" 
          required 
          :disabled="loading"
        />
        <input 
          v-model="form.email" 
          type="email" 
          placeholder="Correo Electrónico" 
          required 
          :disabled="loading"
        />
        <div class="input-group">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Contraseña"
            required
            :disabled="loading"
            minlength="6"
          />
          <button type="button" class="btn btn-outline-secondary" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
        <div class="input-group">
          <input
            v-model="form.password_confirmation"
            :type="showPasswordConfirm ? 'text' : 'password'"
            placeholder="Confirmar Contraseña"
            required
            :disabled="loading"
            minlength="6"
          />
          <button type="button" class="btn btn-outline-secondary" @click="showPasswordConfirm = !showPasswordConfirm">
            <i :class="showPasswordConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrar' }}
        </button>
        <p class="mt-2">
          <router-link to="/admin/login">¿Ya tienes cuenta? Inicia sesión</router-link>
        </p>

        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
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
  email: '',
  password: '',
  password_confirmation: ''
});
const error = ref('');
const success = ref('');
const loading = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

async function register() {
  error.value = '';
  success.value = '';
  
  if (form.password !== form.password_confirmation) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }
  
  loading.value = true;
  
  try {
    const res = await axios.post('http://127.0.0.1:8000/api/admin/register', {
      nombre: form.nombre,
      apellidos: form.apellidos,
      email: form.email,
      password: form.password
    });
    
    success.value = 'Registro exitoso. Redirigiendo al login...';
    
    setTimeout(() => {
      router.push('/admin/login');
    }, 2000);
    
  } catch (e) {
    console.error('Error en registro admin:', e);
    if (e.response?.data?.email) {
      error.value = 'El correo electrónico ya está registrado';
    } else {
      error.value = e.response?.data?.message || 'Error al registrar. Intenta nuevamente.';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  background-color: #111;
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
  text-align: center;
}

.auth-form input {
  padding: 12px;
  border: 1px solid #ddd;
  background-color: #f1f6fb;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.auth-form input:focus {
  outline: none;
  border-color: #dc3545;
}

.auth-form input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn {
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #dc3545;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #c82333;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
}

.success-message {
  color: #155724;
  font-size: 0.9rem;
  padding: 10px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  text-align: center;
}

.input-group {
  display: flex;
  gap: 10px;
}

@media (max-width: 768px) {
  .auth-container {
    padding: 20px;
  }
}
</style>
