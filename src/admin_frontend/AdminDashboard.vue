<template>
  <section class="admin-dashboard">
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2>Panel de Administración</h2>
        <p>Bienvenido, {{ adminData?.nombre }} {{ adminData?.apellidos }}</p>
      </div>
      
      <div class="dashboard-content">
        <div class="dashboard-card">
          <h3>Crear Multa</h3>
          <router-link to="/admin/multas/crear" class="btn btn-primary">
            Crear Nueva Multa
          </router-link>
        </div>
        
        
        
        <div class="dashboard-card">
          <h3>Sesión</h3>
          <button @click="logout" class="btn btn-danger">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MenuNav from '@/components/MenuNav.vue';

const router = useRouter();
const adminData = ref(null);

onMounted(() => {
  const stored = localStorage.getItem('admin_data');
  if (stored) {
    adminData.value = JSON.parse(stored);
  }
});

function logout() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_data');
  localStorage.removeItem('user_type');
  router.push('/admin/login');
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 20px;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 40px;
}

.dashboard-header h2 {
  color: #dc3545;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.dashboard-header p {
  color: #666;
  font-size: 1.2rem;
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.dashboard-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.dashboard-card h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
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
}

.btn-primary {
  background-color: #dc3545;
  color: white;
}

.btn-primary:hover {
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

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}
</style>
