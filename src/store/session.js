import { ref } from 'vue';

export const huesped = ref(
  localStorage.getItem('huesped')
    ? JSON.parse(localStorage.getItem('huesped'))
    : null
);

export function loginHuesped(user) {
  huesped.value = user;
  localStorage.setItem('huesped', JSON.stringify(user));
}

export function logoutHuesped() {
  huesped.value = null;
  localStorage.removeItem('huesped');
}