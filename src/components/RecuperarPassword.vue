<template>
  <section class="recovery-section">
    <div class="recovery-container">
      <div class="d-flex align-items-center mb-4">
        <button v-if="step > 1" @click="prevStep" class="btn btn-link p-0 me-3 back-arrow" aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
        </button>
        <h2 class="mb-0">Recuperar contraseña</h2>
      </div>

      <div class="progress-indicator mb-4">
        <div :class="['progress-step', { 'active': step >= 1 }]"></div>
        <div :class="['progress-step', { 'active': step >= 2 }]"></div>
        <div :class="['progress-step', { 'active': step >= 3 }]"></div>
      </div>

      <div v-if="step === 1" class="text-center">
        <p class="mb-4">Te enviaremos un código de recuperación al siguiente correo:</p>
        <input v-model="correo" type="email" class="form-control form-control-lg mb-4" placeholder="Tu correo electrónico" @keyup.enter="enviarCodigo" />
        <button class="btn btn-primary btn-lg w-100 d-flex justify-content-center align-items-center" @click="enviarCodigo" :disabled="loading">
          <span v-if="loading" class="spinner me-2"></span>
          {{ loading ? 'Enviando...' : 'Enviar código' }}
        </button>
      </div>

      <div v-if="step === 2" class="text-center">
        <p class="mb-4">Hemos enviado un código de seguridad a tu correo. Por favor, ingrésalo a continuación:</p>
        <div class="d-flex justify-content-center mb-4 code-inputs">
          <input
            v-for="i in 6"
            :key="i"
            ref="codeInputs"
            v-model="codeDigits[i - 1]"
            type="text"
            maxlength="1"
            class="form-control form-control-lg text-center mx-1 code-input"
            @input="handleCodeInput($event, i - 1)"
            @keydown="handleCodeKeyDown($event, i - 1)"
          />
        </div>
        <button class="btn btn-success btn-lg w-100" @click="validarCodigo" :disabled="loading || !isCodeComplete">
          {{ loading ? 'Validando...' : 'Validar código' }}
        </button>
      </div>

      <div v-if="step === 3" class="text-center">
        <p class="mb-4">Ingresa tu nueva contraseña:</p>
        <div class="position-relative mb-3">
          <input
            v-model="nuevaContrasena"
            :type="showNueva ? 'text' : 'password'"
            class="form-control form-control-lg"
            placeholder="Nueva contraseña"
          />
          <button type="button" class="eye-btn" @click="showNueva = !showNueva">
            <i :class="showNueva ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
        <div class="position-relative mb-4">
          <input
            v-model="confirmarContrasena"
            :type="showConfirmar ? 'text' : 'password'"
            class="form-control form-control-lg"
            placeholder="Confirmar contraseña"
            @keyup.enter="actualizarContrasena"
          />
          <button type="button" class="eye-btn" @click="showConfirmar = !showConfirmar">
            <i :class="showConfirmar ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
        <button class="btn btn-success btn-lg w-100" @click="actualizarContrasena" :disabled="loading">
          {{ loading ? 'Actualizando...' : 'Cambiar contraseña' }}
        </button>
      </div>

      <div v-if="error" class="alert alert-danger mt-4 text-center" role="alert">{{ error }}</div>
      <div v-if="success" class="alert alert-success mt-4 text-center" role="alert">{{ success }}</div>

      <router-link to="/" class="d-block text-center mt-5 text-decoration-none text-muted">Volver al inicio</router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const correo = ref('');
const codeDigits = ref(Array(6).fill(''));
const codigo = computed(() => codeDigits.value.join(''));
const nuevaContrasena = ref('');
const confirmarContrasena = ref('');
const step = ref(1);
const loading = ref(false);
const error = ref('');
const success = ref('');
const codeInputs = ref([]);

const showNueva = ref(false);
const showConfirmar = ref(false);

const isCodeComplete = computed(() => codeDigits.value.every(digit => digit !== ''));

function validarCorreo(correo) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(correo)) return false;
  const dominio = correo.split('@')[1]?.toLowerCase();
  const dominiosValidos = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'
  ];
  return dominiosValidos.includes(dominio);
}

async function enviarCodigo() {
  error.value = '';
  success.value = '';
  if (!validarCorreo(correo.value)) {
    error.value = 'Por favor ingresa un correo válido y con dominio permitido (gmail.com, hotmail.com, outlook.com, etc).';
    return;
  }
  loading.value = true;
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/enviar-codigo', { correo: correo.value });

    if (response.data.success === true) {
      step.value = 2;
      success.value = 'Código enviado a tu correo. Por favor, revisa tu bandeja de entrada.';
      nextTick(() => {
        if (codeInputs.value[0]) {
          codeInputs.value[0].focus();
        }
      });
    } else {
      error.value = 'Este correo no está registrado. Por favor ingresa el correo asociado a tu cuenta.';
    }
  } catch (e) {
    console.error('Error al enviar código:', e);
    error.value = 'Hubo un problema al enviar el código. Inténtalo de nuevo.';
  } finally {
    loading.value = false;
  }
}

async function validarCodigo() {
  if (!isCodeComplete.value) {
    error.value = 'Por favor, ingresa el código completo.';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';
  try {
    await axios.post('http://127.0.0.1:8000/api/validar-codigo', { correo: correo.value, codigo: codigo.value });
    step.value = 3;
    success.value = 'Código validado. Ahora puedes establecer tu nueva contraseña.';
  } catch (e) {
    console.error('Error al validar código:', e);
    error.value = e.response?.data?.error || 'Código inválido o expirado. Inténtalo de nuevo.';
  } finally {
    loading.value = false;
  }
}

async function actualizarContrasena() {
  if (!nuevaContrasena.value || nuevaContrasena.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }
  if (nuevaContrasena.value !== confirmarContrasena.value) {
    error.value = 'Las contraseñas no coinciden. Por favor, verifica.';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    await axios.post('http://127.0.0.1:8000/api/cambiar-contrasena', {
      correo: correo.value,
      codigo: codigo.value,
      nueva_contrasena: nuevaContrasena.value,
      nueva_contrasena_confirmation: confirmarContrasena.value
    });

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.delete('http://127.0.0.1:8000/api/sesiones', {
          headers: { Authorization: 'Bearer ' + token }
        });
        localStorage.removeItem('token');
      } catch (logoutError) {
        console.warn('Error al cerrar sesión existente:', logoutError);
      }
    }

    success.value = '¡Contraseña actualizada correctamente! Redirigiendo al inicio de sesión...';
    setTimeout(() => router.push('/login'), 2500);
  } catch (e) {
    console.error('Error al actualizar contraseña:', e);
    error.value = e.response?.data?.error || 'Error al actualizar contraseña. Por favor, inténtalo de nuevo.';
  } finally {
    loading.value = false;
  }
}

function prevStep() {
  if (step.value > 1) {
    step.value--;
    error.value = ''; 
    success.value = ''; 
  }
}

function handleCodeInput(event, index) {
  let value = event.target.value;
  value = value.replace(/\D/g, '').slice(0, 1);
  codeDigits.value[index] = value;

  if (value && index < codeDigits.value.length - 1) {
    nextTick(() => {
      codeInputs.value[index + 1].focus();
    });
  } else if (!value && index > 0) {
    nextTick(() => {
      codeInputs.value[index - 1].focus();
    });
  }
}

function handleCodeKeyDown(event, index) {
  if (event.key === 'Backspace' && !codeDigits.value[index] && index > 0) {
    nextTick(() => {
      codeInputs.value[index - 1].focus();
    });
  }
}
</script>

<style scoped>
.recovery-section {
  min-height: 100vh;
  background: linear-gradient(135deg, #d9e2ec, #1f51bd);  
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

p {
  color: #555;
  line-height: 1.6;
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

.btn-primary, .btn-success {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-2px);
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #1e7e34;
  border-color: #1e7e34;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.back-arrow {
  color: #6c757d;
  transition: color 0.3s ease;
}

.back-arrow:hover {
  color: #007bff;
}

.progress-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
}

.progress-step {
  width: 30px; 
  height: 8px; 
  background-color: #e0e0e0;
  border-radius: 4px; 
  margin: 0 5px;
  transition: background-color 0.3s ease, width 0.3s ease;
}

.progress-step.active {
  background-color: #007bff;
  width: 40px; 
}

.code-inputs {
  gap: 10px; 
}

.code-input {
  width: 50px;  
  height: 55px; 
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  border: 2px solid #ced4da;
  border-radius: 8px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.code-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  outline: none;
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

.eye-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #007bff;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.eye-btn:hover {
  color: #0056b3;
}
</style>