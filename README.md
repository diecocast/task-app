```
# Task App

Aplicación web completa para gestión de tareas con funcionalidades de IA, desarrollada con Next.js en el frontend y Express.js con MongoDB en el backend.

🚀 Características
✅ Gestión completa de tareas (CRUD)  
🤖 Integración con IA (Google Gemini) para resúmenes y creación automática  
📊 Dashboard con estadísticas en tiempo real  
🏷️ Sistema de etiquetas y filtros  
⚡ Interfaz moderna con Next.js 15 y Tailwind CSS  
🔒 API REST segura con validaciones  
📱 Diseño responsive  

🛠️ Tecnologías

Frontend  
- Next.js 15.3.5 - Framework React  
- React 19 - Biblioteca de UI  
- TypeScript - Tipado estático  
- Tailwind CSS 4 - Framework CSS  

Backend  
- Node.js - Runtime de JavaScript  
- Express.js 4.18.2 - Framework web  
- MongoDB - Base de datos NoSQL  
- Mongoose 8.0.3 - ODM para MongoDB  
- Google Generative AI - Integración con Gemini  

Herramientas adicionales  
- Helmet - Seguridad HTTP  
- CORS - Manejo de políticas de origen cruzado  
- Morgan - Logging de requests  
- Express Validator - Validación de datos  

📁 Estructura del Proyecto

task-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── aiController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── services/
│   │   │   └── geminiService.js
│   │   ├── validators/
│   │   │   ├── aiValidator.js
│   │   │   └── taskValidator.js
│   │   └── index.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── app/
    │   ├── page.tsx
    │   ├── layout.tsx
    │   └── globals.css
    ├── components/
    ├── hooks/
    ├── services/
    ├── types/
    ├── .env.local
    └── package.json

⚙️ Configuración

Variables de Entorno

Backend (.env)
GOOGLE_API_KEY=AIzaSyCUFsjAJ2B72Kj2-ZaWBcCDvYk5xeTUCYk  
PORT=8000  
MONGODB_URI=mongodb+srv://diego:toyboyaco07@diegocastcluster.9lpsglb.mongodb.net/TaskAppT?retryWrites=true&w=majority&appName=diegocastCluster  

Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000/api  

🚀 Instalación y Ejecución

Prerrequisitos  
- Node.js (versión 18 o superior)  
- npm o yarn  
- MongoDB (local o en la nube)  
- Cuenta de Google Cloud con API de Gemini habilitada  

1. Clonar el repositorio
git clone https://github.com/tu-usuario/task-app.git  
cd task-app  

2. Configurar el Backend
cd backend  
npm install  

Crear archivo .env con las variables de entorno mencionadas arriba.  

# Ejecutar en modo desarrollo
npm run dev  

# Ejecutar en modo producción
npm start  

El backend estará disponible en http://localhost:8000  

3. Configurar el Frontend
cd frontend  
npm install  

Crear archivo .env.local con las variables de entorno mencionadas arriba.  

# Ejecutar en modo desarrollo
npm run dev  

# Construir para producción
npm run build  
npm start  

El frontend estará disponible en http://localhost:3000  

📚 API Endpoints

Tareas  
GET /api/tasks - Obtener todas las tareas  
GET /api/tasks/:id - Obtener tarea por ID  
POST /api/tasks - Crear nueva tarea  
PUT /api/tasks/:id - Actualizar tarea  
DELETE /api/tasks/:id - Eliminar tarea  
GET /api/tasks/stats - Obtener estadísticas  

IA (Gemini)  
POST /api/ai/summary - Generar resumen de tareas  
POST /api/ai/create-task - Crear tarea con IA  

Salud del sistema  
GET /api/health - Verificar estado de la API  

🎯 Funcionalidades Principales

Gestión de Tareas  
- Crear tareas con título, descripción, prioridad y fecha límite  
- Editar tareas existentes  
- Cambiar estados: Pendiente, En Progreso, Completada  
- Eliminar tareas con confirmación  
- Sistema de etiquetas para organización  
- Filtros avanzados por estado, prioridad y búsqueda  

Funcionalidades de IA  
- Resumen inteligente de todas las tareas usando Gemini  
- Creación automática de tareas mediante descripción en lenguaje natural  
- Análisis de productividad y sugerencias  

Dashboard  
- Estadísticas en tiempo real  
- Gráficos de progreso  
- Tareas vencidas destacadas  
- Vista de calendario (próximamente)  

🔧 Scripts Disponibles

Backend
npm start      # Ejecutar en producción  
npm run dev    # Ejecutar en desarrollo con nodemon  
npm test       # Ejecutar tests (por implementar)  

Frontend
npm run dev    # Ejecutar en desarrollo  
npm run build  # Construir para producción  
npm start      # Ejecutar versión de producción  
npm run lint   # Ejecutar linter  

🗄️ Modelo de Datos

Task Schema

{
  title: String (requerido, máx. 100 caracteres),
  description: String (requerido, máx. 500 caracteres),
  status: Enum ['pendiente', 'en progreso', 'completada'],
  priority: Enum ['baja', 'media', 'alta'],
  dueDate: Date (opcional, debe ser futura),
  tags: Array de Strings,
  createdAt: Date (automático),
  updatedAt: Date (automático),
  isOverdue: Virtual (calculado)
}
