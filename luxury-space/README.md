# Luxury Space Project

## Descripción
Luxury Space es una aplicación web construida con Vue.js que proporciona una interfaz elegante y moderna para explorar espacios de lujo. La aplicación incluye una página de inicio y una sección "Acerca de" que describe el propósito y las características del proyecto.

## Estructura del Proyecto
El proyecto tiene la siguiente estructura de archivos:

```
luxury-space
├── public
│   └── index.html          # Estructura HTML principal de la aplicación
├── src
│   ├── assets
│   │   └── main.css       # Estilos CSS personalizados
│   ├── components
│   │   └── HelloWorld.vue  # Componente de Vue para mensajes de bienvenida
│   ├── router
│   │   └── index.js       # Configuración del enrutador de Vue
│   ├── views
│   │   ├── HomeView.vue   # Vista de la página de inicio
│   │   └── AboutView.vue  # Vista de la página "Acerca de"
│   ├── App.vue            # Componente raíz de la aplicación
│   └── main.js            # Punto de entrada de la aplicación
├── package.json            # Configuración del proyecto para npm
├── vite.config.js         # Configuración para Vite
└── README.md              # Documentación del proyecto
```

## Instalación
Para instalar las dependencias del proyecto, navega a la carpeta del proyecto y ejecuta:

```
npm install
```

## Ejecución
Para iniciar la aplicación en modo de desarrollo, ejecuta:

```
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Contribuciones
Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia
Este proyecto está bajo la Licencia MIT.