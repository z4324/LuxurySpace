import { auth, adminAuth } from '../middleware'; 
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import axios from 'axios';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    name: 'Inicio',
    component: Home
  },
  {
    path: '/departamentos',
    name: 'Departamentos',
    component: () => import('../views/Departamentos.vue') 
  },
  {
    path: '/editar-perfil',
    name: 'EditarPerfil',
    component: () => import('../views/EditarPerfil.vue'),
  },

  {
    path: '/notificaciones',
    name: 'Notificaciones',
    meta:{
      middleware: [auth]
    },
    component: () => import('@/views/Notificaciones.vue')
  },
  {
    path: '/cambiar-correo',
    name: 'ChangeEmail',
    component: () => import('../views/ChangeEmail.vue'),
    meta: { middleware: [auth] }
  },
  {
    path: '/cambiar-contrasena',
    name: 'ChangePass',
    component: () => import('../views/ChangePass.vue'),
    meta: { middleware: [auth] }
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
  },
  {
    path: '/recuperar-password',
    name: 'RecuperarPassword',
    component: () => import('../components/RecuperarPassword.vue')
  },
  
  // Rutas de Administrador
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../admin_frontend/AdminLogin.vue')
  },
  {
    path: '/admin/register',
    name: 'AdminRegister',
    component: () => import('../admin_frontend/AdminRegister.vue')
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../admin_frontend/AdminDashboard.vue'),
    meta: { middleware: [adminAuth] }
  },
  {
    path: '/admin/perfil',
    name: 'AdminPerfil',
    component: () => import('../admin_frontend/AdminPerfil.vue'),
    meta: { middleware: [adminAuth] }
  },
  {
    path: '/admin/multas/crear',
    name: 'AdminCrearMulta',
    component: () => import('../admin_frontend/AdminCrearMulta.vue'),
    meta: { middleware: [adminAuth] }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.middleware) {
    const middlewares = to.meta.middleware;
    
    for (let i = 0; i < middlewares.length; i++) {
      const middleware = middlewares[i];
      
      const result = await new Promise((resolve) => {
        middleware(to, from, (path) => {
          resolve(path);
        });
      });
      
      if (result && result !== true) {
        next(result);
        return;
      }
    }
  }
  
  next();
});

export default router;
