# 🏗️ Backend CRUD Modular - Guía Completa

## 📁 Estructura Final del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # ✅ Configuración de MongoDB
│   │   └── environment.js    # ✅ Variables de entorno
│   ├── models/
│   │   └── User.js          # ✅ Modelo de Usuario con validaciones
│   ├── controllers/
│   │   └── userController.js # ✅ Lógica de negocio
│   ├── routes/
│   │   ├── userRoutes.js    # ✅ Rutas específicas de usuarios
│   │   └── index.js         # ✅ Rutas principales + documentación
│   ├── middleware/
│   │   ├── errorHandler.js  # ✅ Manejo global de errores  
│   │   └── validation.js    # ✅ Validaciones personalizadas
│   ├── utils/
│   │   └── response.js      # ✅ Helpers para respuestas consistentes
│   └── app.js              # ✅ Configuración de Express
├── server.js               # ✅ Punto de entrada
├── client.js               # ✅ Cliente Axios (del ejemplo anterior)
├── package.json            # ✅ Dependencias y scripts
├── .env                    # ⚙️ Variables de entorno
├── .gitignore             # 📝 Archivos a ignorar
└── README.md              # 📖 Documentación
```

## 🚀 Instalación Paso a Paso

### 1. Crear el proyecto
```bash
mkdir crud-backend-modular
cd crud-backend-modular
```

### 2. Inicializar npm y instalar dependencias
```bash
npm init -y
npm install express mongoose cors dotenv helmet morgan compression express-rate-limit express-mongo-sanitize
npm install -D nodemon eslint
```

### 3. Crear estructura de carpetas
```bash
mkdir -p src/{config,models,controllers,routes,middleware,utils}
```

### 4. Crear archivos principales
- Copiar el contenido de cada artifact en su archivo correspondiente
- Crear el archivo `.env` con tu configuración

### 5. Configurar .env
```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos
MONGODB_URI=mongodb://localhost:27017/crud_modular

# Seguridad
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# Frontend (CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### 6. Ejecutar el proyecto
```bash
# Modo desarrollo
npm run dev

# Modo desarrollo con watch solo en src/
npm run dev:watch

# Modo producción
npm start
```

## 🎯 Características del Backend Modular

### ✅ **Separación de responsabilidades**
- **config/**: Configuraciones (DB, variables)
- **models/**: Modelos de datos con Mongoose
- **controllers/**: Lógica de negocio
- **routes/**: Definición de endpoints
- **middleware/**: Validaciones y manejo de errores
- **utils/**: Funciones auxiliares

### ✅ **Funcionalidades avanzadas**
- **Paginación**: `GET /api/users?pagina=1&limite=10`
- **Búsqueda**: `GET /api/users?buscar=juan`
- **Filtros**: `GET /api/users?activo=true`
- **Ordenamiento**: `GET /api/users?ordenar=nombre&orden=asc`
- **Estadísticas**: `GET /api/users/stats`
- **Soft Delete**: Eliminación lógica por defecto
- **Reactivación**: `PATCH /api/users/:id/reactivate`

### ✅ **Validaciones robustas**
- Validación de tipos de datos
- Validación de formatos (email, teléfono)
- Validación de rangos (edad)
- Validación de ObjectId de MongoDB
- Sanitización de entradas

### ✅ **Manejo de errores centralizado**
- Respuestas consistentes
- Logging en desarrollo
- Diferentes tipos de errores (validación, DB, etc.)
- Stack traces en desarrollo

## 📊 Endpoints Disponibles

| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| **GET** | `/api` | Info de la API | - |
| **GET** | `/api/health` | Salud del servidor | - |
| **GET** | `/api/docs` | Documentación | - |
| **GET** | `/api/users` | Listar usuarios | `pagina`, `limite`, `buscar`, `activo`, `ordenar`, `orden` |
| **GET** | `/api/users/stats` | Estadísticas | - |
| **GET** | `/api/users/:id` | Usuario por ID | - |
| **POST** | `/api/users` | Crear usuario | Body: datos usuario |
| **PUT** | `/api/users/:id` | Actualizar usuario | Body: datos actualizados |
| **DELETE** | `/api/users/:id` | Eliminar (soft) | - |
| **DELETE** | `/api/users/:id/permanent` | Eliminar permanente | - |
| **PATCH** | `/api/users/:id/reactivate` | Reactivar usuario | - |

## 🧪 Ejemplos de Uso

### Crear usuario completo
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana García",
    "email": "ana@ejemplo.com",
    "edad": 28,
    "telefono": "+57 300 123 4567",
    "direccion": {
      "calle": "Carrera 15 #45-67",
      "ciudad": "Bogotá",
      "codigoPostal": "110111",
      "pais": "Colombia"
    },
    "preferencias": {
      "tema": "oscuro",
      "idioma": "es",
      "notificaciones": {
        "email": true,
        "sms": false,
        "push": true
      }
    }
  }'
```

### Obtener usuarios con filtros
```bash
curl "http://localhost:5000/api/users?pagina=1&limite=5&buscar=ana&activo=true&ordenar=nombre&orden=asc"
```

### Obtener estadísticas
```bash
curl http://localhost:5000/api/users/stats
```

## 🔧 Personalización y Extensión

### Agregar nuevo modelo
1. Crear archivo en `src/models/`
2. Crear controlador en `src/controllers/`
3. Crear rutas en `src/routes/`
4. Importar rutas en `src/routes/index.js`

### Agregar middleware personalizado
1. Crear archivo en `src/middleware/`
2. Importar en `src/app.js` o en rutas específicas

### Agregar utilidades
1. Crear funciones en `src/utils/`
2. Importar donde sea necesario

## 🛡️ Mejores Prácticas Implementadas

- ✅ Estructura modular y escalable
- ✅ Validación de datos robusta
- ✅ Manejo de errores centralizado
- ✅ Respuestas API consistentes
- ✅ Configuración por variables de entorno
- ✅ Logging para debugging
- ✅ Separación de lógica de negocio
- ✅ Código reutilizable y mantenible

## 🚨 Próximos Pasos Sugeridos

1. **Autenticación JWT**
2. **Rate Limiting**
3. **Tests unitarios**
4. **Swagger Documentation**
5. **Docker**
6. **CI/CD**
7. **Logging avanzado**
8. **Caching con Redis**

¡Ahora tienes un backend completamente modular, escalable y profesional! 🎉