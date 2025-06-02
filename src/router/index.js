import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  /* {
    path: '/departamentos',
    name: 'Departamentos',
    component: () => import('../views/Departamentos.vue') // Carga diferida
  },*/
  {
    path: '/multas',
    name: 'Multas',
    component: () => import('../views/Multas.vue')
  }, 
  {
  path: '/notificaciones',
  name: 'Notificaciones',
  component: () => import('@/views/Notificaciones.vue')
  },
  {
    path: '/amenidades',
    name: 'Amenidades',
    component: () => import('../views/Amenidades.vue')
  }, 
  {
    path: '/ubicacion',
    name: 'Ubicacion',
    component: () => import('../views/Ubicacion.vue')
  },
  {
    path: '/galeria',
    name: 'Galeria',
    component: () => import('../views/Galeria.vue')
  },
 
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  } 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
