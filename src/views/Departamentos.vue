<template>
  <div>
    <MenuNav />
    <section class="departamentos-section">
      <div class="container">
        <h1 class="text-center mb-5">Nuestros Departamentos y Condominios</h1>
        <div class="row">
          <div class="col-md-12 col-lg-6 mb-4">
            <div class="card departamento-card" @click="toggleCard(1)">
              <div class="card-inner">
                <div class="card-front">
                  <img src="/img/departamento1.jpg" class="card-img-top" alt="Departamento 1">
                  <div class="card-body">
                    <h5 class="card-title">Departamento Premium</h5>
                    <p class="card-text">2 recámaras, 2 baños, rooftop privado</p>
                    <div class="rating">
                      <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
                    </div>
                    <p class="card-text"><strong>Desde $2.3 MDP</strong></p>
                    <p class="card-text"><small>Tulum, Quintana Roo</small></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12 col-lg-6 mb-4">
            <div class="card departamento-card" @click="toggleCard(2)">
              <div class="card-inner">
                <div class="card-front">
                  <img src="/img/departamento2.jpg" class="card-img-top" alt="Departamento 2">
                  <div class="card-body">
                    <h5 class="card-title">Condominio de Lujo</h5>
                    <p class="card-text">3 recámaras, 3 baños, terraza amplia</p>
                    <div class="rating">
                      <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
                    </div>
                    <p class="card-text"><strong>Desde $3.5 MDP</strong></p>
                    <p class="card-text"><small>Tulum, Quintana Roo</small></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12 col-lg-6 mb-4">
            <div class="card departamento-card" @click="toggleCard(3)">
              <div class="card-inner">
                <div class="card-front">
                  <img src="/img/departamento3.jpg" class="card-img-top" alt="Departamento 3">
                  <div class="card-body">
                    <h5 class="card-title">Estudio de Lujo</h5>
                    <p class="card-text">1 recámara, 1 baño, balcón privado</p>
                    <div class="rating">
                      <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
                    </div>
                    <p class="card-text"><strong>Desde $1.8 MDP</strong></p>
                    <p class="card-text"><small>Tulum, Quintana Roo</small></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <transition name="card-expand">
        <div v-if="selectedCard" class="modal-overlay" @click="closeCard">
          <div class="modal-card" @click.stop>
            <button class="close-btn" @click="closeCard">×</button>
            <div class="card-back">
              <div class="card-body">
                <h5 class="card-title">{{ selectedCardDetails[selectedCard].title }}</h5>
                <p class="card-text">{{ selectedCardDetails[selectedCard].description }}</p>
                <ul>
                  <li v-for="feature in selectedCardDetails[selectedCard].features" :key="feature">{{ feature }}</li>
                </ul>
              </div>
              <div class="carousel-container">
                <div id="carouselExample" class="carousel slide mb-4" data-bs-ride="carousel">
                  <div class="carousel-inner">
                                    <div class="mb-2 text-center">
                  <strong>{{ currentImageDesc }}</strong>
                </div>
                    <div
                      class="carousel-item"
                      :class="{ active: index === carouselIndex }"
                      v-for="(image, index) in selectedCardDetails[selectedCard].images"
                      :key="index"
                    >
                      <img :src="image.src" class="d-block w-100" :alt="image.desc">
                    </div>
                  </div>
                  <button class="carousel-control-prev" type="button" @click="prevImage">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                  </button>
                  <button class="carousel-control-next" type="button" @click="nextImage">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
            <h1 class="text-center mb-4">Ubicación</h1>
            <div class="map-container">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.071682689496!2d-87.46313968508776!3d20.21141898643824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDEyJzQxLjEiTiA4N8KwMjcnNDcuMyJX!5e0!3m2!1ses!2smx!4v1635783921847" allowfullscreen="" loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </transition>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
import MenuNav from '@/components/MenuNav.vue';

const selectedCard = ref(null);
const carouselIndex = ref(0);

const selectedCardDetails = reactive({
  1: {
    title: 'Departamento Premium',
    description: 'Disfruta de un espacio moderno con acabados de lujo, vistas al mar Caribe y acceso a amenidades exclusivas.',
    features: ['Superficie: 120 m²', '2 recámaras con baño completo', 'Rooftop privado con jacuzzi', 'Acceso a piscina infinity'],
    images: [
      { src: '/img/departamento1_recamara.jpg', desc: 'Recámara principal con vista al mar' },
      { src: '/img/departamento1_bano.jpg', desc: 'Baño moderno con acabados de lujo' },
      { src: '/img/departamento1_rooftop.jpg', desc: 'Rooftop privado con jacuzzi' },
      { src: '/img/departamento1_piscina.jpg', desc: 'Piscina infinity con vista al mar' }
      
    ]
  },
  2: {
    title: 'Condominio de Lujo',
    description: 'Espacioso condominio con diseño contemporáneo, ideal para familias, con vistas panorámicas y amenidades premium.',
    features: ['Superficie: 180 m²', '3 recámaras con baño completo', 'Terraza con vista al mar', 'Gimnasio y spa en el complejo'],
    images: [
      { src: '/img/departamento2_recamara.jpg', desc: 'Recámara principal con balcón privado' },
      { src: '/img/departamento2_bano.jpg', desc: 'Baño principal con acabados premium' },
      { src: '/img/departamento2_terraza.png', desc: 'Terraza amplia con vista al mar' },
      { src: '/img/departamento2_gimnasio.png', desc: 'Gimnasio moderno en el complejo' },
      { src: '/img/departamento2_spa.jpg', desc: 'Spa de lujo en el complejo' }
    ]
  },
  3: {
    title: 'Estudio de Lujo',
    description: 'Perfecto para parejas o solteros, con diseño minimalista y acceso a todas las amenidades de Luxury Space.',
    features: ['Superficie: 80 m²', '1 recámara con baño completo', 'Balcón con vista a la selva', 'Piscina y área de yoga'],
    images: [
      { src: '/img/departamento3_balcón.jpg', desc: 'Balcón privado con vista a la selva' },
      { src: '/img/departamento3_sala.jpg', desc: 'Sala acogedora y luminosa' },
      { src: '/img/departamento3_bano.jpg', desc: 'Baño elegante y funcional' }
    ]
  }
});

function toggleCard(cardId) {
  if (selectedCard.value === cardId) {
    selectedCard.value = null;
  } else {
    selectedCard.value = cardId;
    carouselIndex.value = 0;
    nextTick(() => {
      if (window.bootstrap) {
        const el = document.getElementById('carouselExample');
        if (el && window.bootstrap.Carousel) {
          window.bootstrap.Carousel.getOrCreateInstance(el).to(0);
        }
      }
    });
  }
}

function closeCard() {
  selectedCard.value = null;
  carouselIndex.value = 0;
}

function prevImage() {
  const images = selectedCardDetails[selectedCard.value]?.images || [];
  carouselIndex.value = (carouselIndex.value - 1 + images.length) % images.length;
  moveBootstrapCarousel(carouselIndex.value);
}
function nextImage() {
  const images = selectedCardDetails[selectedCard.value]?.images || [];
  carouselIndex.value = (carouselIndex.value + 1) % images.length;
  moveBootstrapCarousel(carouselIndex.value);
}

function moveBootstrapCarousel(index) {
  nextTick(() => {
    if (window.bootstrap) {
      const el = document.getElementById('carouselExample');
      if (el && window.bootstrap.Carousel) {
        window.bootstrap.Carousel.getOrCreateInstance(el).to(index);
      }
    }
  });
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('slid.bs.carousel', (e) => {
      if (selectedCard.value) {
        carouselIndex.value = e.to;
      }
    });
  }
});

const currentImageDesc = computed(() => {
  if (!selectedCard.value) return '';
  const images = selectedCardDetails[selectedCard.value].images;
  return images[carouselIndex.value]?.desc || '';
});
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
}

.departamentos-section {
  background: url('../img/banner0.png') no-repeat center center/cover;
  padding: 60px 5%;
  color: #fff;
}

.departamento-card {
  cursor: pointer;
  height: 650px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  max-width: 620px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.75);
}

.card-img-top {
  height: 400px;
  object-fit: cover;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37;
}

.card-text {
  font-size: 1rem;
  margin-bottom: 10px;
}

.rating {
  color: #d4af37;
  margin-bottom: 10px;
}

.rating .star {
  font-size: 1.2rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-card {
  position: relative;
  width: 100%;
  max-width: 1100px;
  min-width: 320px;
  min-height: 400px;
  max-height: 90vh;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  color: white;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-back {
  padding: 30px 40px;
  display: flex;
  flex-direction: row;
  gap: 32px;
}

.card-back .card-body {
  flex: 1 1 350px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.card-back .carousel-container {
  flex: 1 1 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.card-back ul {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.card-back ul li {
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.carousel-inner img {
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.map-container {
  margin-bottom: 40px;
}

.map-container iframe {
  width: 100%;
  height: 300px;
  border: none;
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #d4af37;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #fff;
}

.card-expand-enter-active,
.card-expand-leave-active {
  transition: all 0.5s ease;
}

.card-expand-enter-from,
.card-expand-leave-to {
  opacity: 0;
  transform: scale(0.8) rotateY(180deg);
}

.card-expand-enter-to,
.card-expand-leave-from {
  opacity: 1;
  transform: scale(1) rotateY(0deg);
}

@keyframes slideIn {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-card {
  animation: slideIn 0.5s ease-out;
}

@media (max-width: 1100px) {
  .modal-card {
    max-width: 98vw;
    padding: 0;
  }
  .card-back {
    flex-direction: column;
    gap: 16px;
    padding: 20px 10px;
  }
  .card-back .carousel-container {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .modal-card {
    width: 100vw;
    max-width: 100vw;
    min-width: unset;
    min-height: unset;
    max-height: 98vh;
    border-radius: 0;
  }
  .card-back {
    padding: 10px 2vw;
    gap: 10px;
  }
  .carousel-inner img {
    height: 180px;
  }
  .map-container iframe {
    height: 160px;
  }
}
</style>