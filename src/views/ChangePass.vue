<template>
  <div class="change-pass-bg">
    <div class="change-pass-container">
      <h2>Cambiar contraseña</h2>
      <form v-if="!codigoEnviado" @submit.prevent="enviarCodigo">
        <div class="form-group">
          <label>Contraseña actual</label>
          <div class="input-group">
            <input :type="showActual ? 'text' : 'password'" v-model="passForm.contrasena_actual" class="form-control" required />
            <button type="button" class="btn btn-outline-secondary" @click="showActual = !showActual">
              {{ showActual ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
        </div>
        <div class="form-group">
          <label>Nueva contraseña</label>
          <div class="input-group">
            <input :type="showNueva ? 'text' : 'password'" v-model="passForm.nueva_contrasena" class="form-control" required />
            <button type="button" class="btn btn-outline-secondary" @click="showNueva = !showNueva">
              {{ showNueva ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loadingPass">Enviar código de seguridad</button>
        <div v-if="passError" class="alert alert-danger mt-2">{{ passError }}</div>
      </form>
      <form v-else @submit.prevent="validarCodigo">
        <div class="form-group">
          <label>Ingresa el código enviado a tu correo</label>
          <input v-model="codigo" maxlength="6" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-success" :disabled="loadingPass">Confirmar cambio</button>
        <button
          type="button"
          class="btn btn-link mt-2"
          :disabled="reenvioBloqueado"
          @click="reenviarCodigo"
        >
          ¿No recibiste el código? Reenviar
          <span v-if="reenvioBloqueado">({{ tiempoRestante }}s)</span>
        </button>
        <div v-if="passError" class="alert alert-danger mt-2">{{ passError }}</div>
        <div v-if="passSuccess" class="alert alert-success mt-2">{{ passSuccess }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const passForm = reactive({ contrasena_actual: '', nueva_contrasena: '' });
const passError = ref('');
const passSuccess = ref('');
const loadingPass = ref(false);

const showActual = ref(false);
const showNueva = ref(false);

const codigoEnviado = ref(false);
const codigo = ref('');

const reenvioBloqueado = ref(true);
const tiempoRestante = ref(60);
let intervaloReenvio = null;

function iniciarTemporizador() {
  reenvioBloqueado.value = true;
  tiempoRestante.value = 60;
  intervaloReenvio = setInterval(() => {
    tiempoRestante.value--;
    if (tiempoRestante.value <= 0) {
      reenvioBloqueado.value = false;
      clearInterval(intervaloReenvio);
    }
  }, 1000);
}

async function enviarCodigo() {
  passError.value = '';
  if (!passForm.contrasena_actual || !passForm.nueva_contrasena) {
    passError.value = 'Completa ambos campos.';
    return;
  }
  if (passForm.nueva_contrasena.length < 6) {
    passError.value = 'La nueva contraseña debe tener al menos 6 caracteres.';
    return;
  }
  loadingPass.value = true;
  try {
    const token = localStorage.getItem('token');
    await axios.post('http://127.0.0.1:8000/api/enviar-codigo', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    codigoEnviado.value = true;
    passSuccess.value = 'Código enviado a tu correo. Revisa tu bandeja de entrada.';
    iniciarTemporizador();
  } catch (e) {
    passError.value = e.response?.data?.error || 'Error al enviar código.';
  } finally {
    loadingPass.value = false;
  }
}

async function reenviarCodigo() {
  passError.value = '';
  loadingPass.value = true;
  try {
    const token = localStorage.getItem('token');
    await axios.post('http://127.0.0.1:8000/api/enviar-codigo', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    passSuccess.value = 'Nuevo código enviado a tu correo.';
    iniciarTemporizador();
  } catch (e) {
    passError.value = e.response?.data?.error || 'Error al reenviar código.';
  } finally {
    loadingPass.value = false;
  }
}

async function validarCodigo() {
  passError.value = '';
  passSuccess.value = '';
  loadingPass.value = true;
  setTimeout(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://127.0.0.1:8000/api/validar-codigo-cambiar-password', {
        codigo: codigo.value,
        nueva_contrasena: passForm.nueva_contrasena
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.cerrar_sesion) {
        localStorage.clear();
        sessionStorage.clear();
        passSuccess.value = 'Contraseña actualizada. Redirigiendo al login...';
        setTimeout(() => {
          router.push('/login').then(() => {
            window.location.reload();
          });
        }, 1200);
      }
    } catch (e) {
      passError.value = e.response?.data?.error || 'Código inválido o expirado.';
    } finally {
      loadingPass.value = false;
    }
  }, 2000); 
}
</script>

<style scoped>
.change-pass-bg {
  min-height: 100vh;
  background: url('../img/banner3.png') no-repeat center center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
}
.change-pass-container {
  background: #fff;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  min-width: 340px;
}
.form-group {
  margin-bottom: 18px;
}
.input-group {
  display: flex;
  gap: 8px;
}
.btn {
  width: 100%;
}
</style>