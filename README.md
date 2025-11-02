Sistema de Gestión Ciudadana - Ministerio de Gobierno

Sistema web para la gestión y consulta de información de ciudadanos, integrado con DINARDAP.
Permite realizar consultas, validaciones de identidad y auditorías de operaciones realizadas por los usuarios autorizados.

Tecnologías

React 18 (interfaz de usuario)

TypeScript (tipado estático)

Vite (servidor y build)

React Router (navegación)

Zustand (estado global)

React Hook Form + Zod (formularios y validación)

Axios (cliente HTTP)

Tailwind CSS (estilos)

Prerrequisitos

Node.js versión 18 o superior

npm o yarn

Instalación

Clonar el repositorio:

git clone <repository-url>
cd project-4


Instalar dependencias:

npm install


Configurar variables de entorno:

cp .env.example .env


Editar el archivo .env con las variables necesarias.

Configuración
Variables de entorno
VITE_API_BASE_URL=http://54.175.243.7:3000
VITE_API_BACKEND_URL=
VITE_OAUTH_BACKEND_URL=

VITE_GRAPHQL_URI=

VITE_APP_NAME=Ministerio de Gobierno
VITE_TOKEN_REFRESH_THRESHOLD=300000

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

Proxy de desarrollo

El proxy de Vite redirige automáticamente:

/api/* → http://54.175.243.7:3000/api/*

/oauth/* → http://54.175.243.7:3000/oauth/*

Esto evita problemas de CORS durante el desarrollo.

Scripts
npm run dev          # Ejecuta el servidor de desarrollo (http://localhost:5173)
npm run build        # Genera la build de producción en ./dist
npm run preview      # Previsualiza la build generada
npm run lint         # Ejecuta ESLint
npm run typecheck    # Verifica los tipos TypeScript

Estructura del Proyecto
src/
├── features/              # Módulos funcionales
│   ├── auth/              # Autenticación
│   └── dinardap/          # Integración DINARDAP
├── pages/                 # Páginas principales
├── shared/                # Componentes y utilidades compartidas
├── config/                # Configuración de API y entorno
├── store/                 # Estado global (Zustand)
└── lib/                   # Librerías y configuraciones comunes

Funcionalidades Principales
Autenticación

Inicio de sesión con OAuth 2.0

Manejo de tokens JWT

Protección de rutas

Mensajes de error en español

Consulta DINARDAP

Búsqueda por cédula o nombres

Consulta detallada de ciudadano

Validación de identidad en línea

Auditoría

Registro de todas las operaciones

Filtros por usuario, fecha y cédula

Detalle de método, endpoint e IP

API Endpoints

Autenticación

POST /oauth/token – Obtener token de acceso

DINARDAP

POST /api/v1/dinardap – Búsqueda de ciudadanos

GET /api/v1/dinardap/consulta-ciudadano/:cedula – Consulta detallada

GET /api/v1/dinardap/validacion-identidad/:cedula – Validación de identidad

GET /api/v1/dinardap/auditoria – Listado de auditorías

Seguridad

Tokens JWT almacenados en localStorage

Interceptores Axios para autenticación automática

Redirección al login al expirar el token

Validación de permisos por endpoint

Desarrollo
Crear una nueva página

Agregar el componente en src/pages/

Registrar la ruta en src/App.tsx

Incluir el enlace en la barra lateral

Crear un nuevo servicio

Crear archivo en src/features/[feature]/services/

Definir tipos en src/features/[feature]/types/

Agregar hook en src/features/[feature]/hooks/

Despliegue

Generar la build:

npm run build


Subir el contenido de ./dist a un servidor web o servicio estático.

Licencia

Proyecto privado. Todos los derechos reservados al Ministerio de Gobierno.
