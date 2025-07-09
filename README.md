
# 🚀 Task App

Aplicación web moderna y completa para la **gestión inteligente de tareas**, impulsada por IA, con frontend en **Next.js** y backend en **Express.js** + **MongoDB**.

---

## ✨ Características Principales

- ✅ Gestión completa de tareas (CRUD)
- 🤖 Integración con **Google Gemini** para IA
- 📊 Dashboard con estadísticas en tiempo real
- 🏷️ Sistema de etiquetas y filtros avanzados
- ⚡ Interfaz moderna con **Next.js 15** y **Tailwind CSS**
- 🔒 API REST segura con validaciones y sanitización
- 📱 Diseño completamente responsive

---

## 🛠️ Tecnologías Utilizadas

### 🔷 Frontend

| Tecnología     | Descripción                    |
|---------------|--------------------------------|
| Next.js 15.3.5| Framework React moderno        |
| React 19      | Biblioteca UI principal        |
| TypeScript    | Tipado estático                |
| Tailwind CSS  | Framework CSS utilitario       |

### 🔶 Backend

| Tecnología       | Descripción                         |
|------------------|-------------------------------------|
| Node.js          | Entorno de ejecución JavaScript     |
| Express.js 4.18.2| Framework backend ligero            |
| MongoDB          | Base de datos NoSQL                 |
| Mongoose 8.0.3   | ODM para MongoDB                    |
| Google Gemini    | IA para resumen y generación de tareas |

### 🧰 Herramientas Adicionales

- Helmet (seguridad HTTP)
- CORS (control de origen)
- Morgan (logs de requests)
- Express Validator (validaciones)

---

## 📁 Estructura del Proyecto

```
task-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── index.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── app/
    ├── components/
    ├── hooks/
    ├── services/
    ├── types/
    ├── .env.local
    └── package.json
```

---

## ⚙️ Configuración del Entorno

### 🔐 Variables de Entorno

**Backend (.env):**
```env
GOOGLE_API_KEY=tu_api_key_google
PORT=8000
MONGODB_URI=tu_uri_de_mongo
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🧪 Instalación y Ejecución

### ✅ Prerrequisitos

- Node.js (v18+)
- npm o yarn
- MongoDB local o en la nube
- Cuenta de Google Cloud con API de Gemini habilitada

### 🔧 Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/task-app.git
cd task-app
```

2. **Backend**
```bash
cd backend
npm install
npm run dev       # Desarrollo
npm start         # Producción
```
Disponible en: `http://localhost:8000`

3. **Frontend**
```bash
cd frontend
npm install
npm run dev       # Desarrollo
npm run build     # Compilar
npm start         # Producción
```
Disponible en: `http://localhost:3000`

---

## 📚 API Endpoints

### 📝 Tareas

| Método | Endpoint             | Descripción                    |
|--------|----------------------|--------------------------------|
| GET    | /api/tasks           | Obtener todas las tareas       |
| GET    | /api/tasks/:id       | Obtener una tarea por ID       |
| POST   | /api/tasks           | Crear nueva tarea              |
| PUT    | /api/tasks/:id       | Actualizar tarea               |
| DELETE | /api/tasks/:id       | Eliminar tarea                 |
| GET    | /api/tasks/stats     | Obtener estadísticas           |

### 🤖 IA (Gemini)

| Método | Endpoint              | Descripción                      |
|--------|-----------------------|----------------------------------|
| POST   | /api/ai/summary       | Generar resumen de tareas        |
| POST   | /api/ai/create-task   | Crear tarea desde lenguaje natural |

### ❤️ Health Check
- `GET /api/health` — Estado del sistema

---

## 📊 Dashboard y Funcionalidades

- Crear, editar, actualizar y eliminar tareas
- Cambiar estados: pendiente, en progreso, completada
- Sistema de etiquetas
- Filtros por estado, prioridad y texto
- **Resumen inteligente de IA**
- **Creación automática de tareas por IA**
- Dashboard con progreso y tareas vencidas

---

## 🧬 Modelo de Datos

```ts
{
  title: string,               // requerido, máx. 100 caracteres
  description: string,         // requerido, máx. 500 caracteres
  status: 'pendiente' | 'en progreso' | 'completada',
  priority: 'baja' | 'media' | 'alta',
  dueDate?: Date,              // opcional, debe ser futura
  tags: string[],
  createdAt: Date,
  updatedAt: Date,
  isOverdue: boolean           // calculado
}
```

---

## 🔐 Seguridad

- 🛡️ Headers seguros con Helmet
- 🌍 CORS para controlar orígenes
- 🧼 Sanitización de inputs
- ✅ Validación estricta con Express Validator
- 🚫 Rate limiting (recomendado para producción)

---

## 🚀 Despliegue

### 🔁 Backend
```bash
npm install --production
npm start
```

### 🌐 Frontend
```bash
npm run build
npm start
```

**Recomendaciones de Hosting:**

- Backend: Railway, Render, Heroku
- Frontend: Vercel, Netlify
- Database: MongoDB Atlas

---

## 🔧 Scripts Útiles

### Backend

```bash
npm run dev     # Modo desarrollo con nodemon
npm start       # Producción
npm test        # Ejecutar tests (por implementar)
```

### Frontend

```bash
npm run dev     # Desarrollo
npm run build   # Producción
npm start       # Ejecutar app
npm run lint    # Linter
```

---

## 🤝 Contribución

1. Haz un fork del proyecto
2. Crea una nueva rama (`git checkout -b feature/NuevaFeature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Agregar nueva funcionalidad'`)
4. Sube tu rama (`git push origin feature/NuevaFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está licenciado bajo la **Licencia ISC**.

---

## 👨‍💻 Autor

Desarrollado con ❤️ por Diego Castañeda y colaboradores.

¿Dudas o sugerencias?  
Abre un [issue](https://github.com/tu-usuario/task-app/issues) o contáctanos.
