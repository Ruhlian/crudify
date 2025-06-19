# STATUS 3.0 - Sistema de Monitoreo de Cámaras

<div align="center">
  <h3>🎥 Sistema Full Stack de Monitoreo de Cámaras con Notificaciones WhatsApp 📱</h3>
  <p>
    <img src="https://img.shields.io/badge/Python-3.8+-blue.svg" alt="Python">
    <img src="https://img.shields.io/badge/Flask-3.0.3-green.svg" alt="Flask">
    <img src="https://img.shields.io/badge/React-19.0.0-cyan.svg" alt="React">
    <img src="https://img.shields.io/badge/Node.js-18+-brightgreen.svg" alt="Node.js">
    <img src="https://img.shields.io/badge/SQLite-3-orange.svg" alt="SQLite">
    <img src="https://img.shields.io/badge/WhatsApp-Bot-25D366.svg" alt="WhatsApp">
  </p>
</div>

## 📋 Descripción

**STATUS 3.0** es un sistema integral de monitoreo de cámaras desarrollado con arquitectura full stack que permite:

- ✅ **Monitoreo en tiempo real** de estado de cámaras
- ✅ **Dashboard web interactivo** con React
- ✅ **Notificaciones automáticas** via WhatsApp
- ✅ **API REST completa** para gestión de datos
- ✅ **Base de datos SQLite** con ORM SQLAlchemy
- ✅ **Interfaz responsive** con Tailwind CSS

## 🏗️ Arquitectura del Sistema

```
STATUS 3.0/
├── 📁 back/                 # Backend Flask
│   ├── 🐍 app.py
│   ├── 📷 camera_manager.py
│   ├── 💾 data_manager.py
│   ├── 🔍 monitor.py
│   ├── 🔔 notification.py
│   ├── 🛣️ routes.py
│   ├── 🗄️ database.py
│   └── ⚙️ config.py
├── 📁 front/               # Frontend React
│   ├── 📁 src/
│   ├── 📁 public/
│   └── 📦 package.json
└── 📁 whatsapp-bot/        # Bot WhatsApp
    ├── 🤖 index.js
    ├── 📁 node_modules/
    └── 📦 package.json
```

## 🚀 Tecnologías Utilizadas

### Backend (Flask)
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Flask | 3.0.3 | Framework web principal |
| SQLAlchemy | 2.0.34 | ORM para base de datos |
| Flask-Cors | 4.0.0 | Manejo de CORS |
| Alembic | 1.13.2 | Migraciones de BD |
| Gunicorn | 21.2.0 | Servidor WSGI |
| Werkzeug | 3.0.3 | Toolkit WSGI |
| Python-dotenv | 1.0.1 | Variables de entorno |
| Requests | 2.31.0 | Cliente HTTP |

### Frontend (React)
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.0.0 | Framework frontend |
| Tailwind CSS | 4.0.9 | Framework CSS |
| Axios | 1.8.1 | Cliente HTTP |
| Socket.io-client | 4.8.1 | WebSockets tiempo real |
| React Feather | 2.0.10 | Iconografía |
| React Toastify | 11.0.5 | Notificaciones UI |
| Testing Library | 16.2.0 | Pruebas unitarias |

### WhatsApp Bot (Node.js)
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| @whiskeysockets/baileys | 6.7.16 | Cliente WhatsApp |
| whatsapp-web.js | 1.26.0 | API WhatsApp Web |
| Express | 4.21.2 | Servidor web |
| qrcode-terminal | 0.12.0 | Generación QR |

## 📋 Prerrequisitos

- **Python 3.8+**
- **Node.js 18+**
- **npm** o **yarn**
- **Git**

## ⚡ Instalación Rápida

### 1️⃣ Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd STATUS-3.0
```

### 2️⃣ Configurar Backend (Flask)
```bash
cd back/
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

### 3️⃣ Configurar Frontend (React)
```bash
cd ../front/
npm install
```

### 4️⃣ Configurar WhatsApp Bot
```bash
cd ../whatsapp-bot/
npm install
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en la carpeta `back/`:
```env
# Configuración Flask
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=tu_clave_secreta_aqui
DATABASE_URL=sqlite:///status.db

# Configuración de notificaciones
NOTIFICATION_ENABLED=true
WHATSAPP_BOT_URL=http://localhost:3001
```

### Base de Datos

Inicializar la base de datos:
```bash
cd back/
python init_db.py
# o usando Alembic
alembic upgrade head
```

## 🚀 Ejecución

### Modo Desarrollo

**Terminal 1 - Backend:**
```bash
cd back/
source venv/bin/activate
python app.py
# Servidor corriendo en http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd front/
npm start
# Aplicación corriendo en http://localhost:3000
```

**Terminal 3 - WhatsApp Bot:**
```bash
cd whatsapp-bot/
npm run dev
# Bot corriendo en http://localhost:3001
```

### Modo Producción

**Backend con Gunicorn:**
```bash
cd back/
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

**Frontend (Build):**
```bash
cd front/
npm run build
# Servir desde build/ con servidor web
```

**WhatsApp Bot:**
```bash
cd whatsapp-bot/
npm start
```

## 📱 Uso del Sistema

### 1. Dashboard Web
- Acceder a `http://localhost:3000`
- Visualizar estado de cámaras en tiempo real
- Configurar parámetros de monitoreo
- Ver historial de eventos

### 2. API REST
```bash
# Obtener estado de todas las cámaras
GET http://localhost:5000/api/cameras

# Obtener estado de cámara específica
GET http://localhost:5000/api/cameras/1

# Actualizar estado de cámara
PUT http://localhost:5000/api/cameras/1
```

### 3. Bot WhatsApp
- Escanear código QR mostrado en la consola
- Comandos disponibles:
  - `/status` - Estado general
  - `/camera [id]` - Estado de cámara específica
  - `/help` - Ayuda

## 🧪 Pruebas

### Backend
```bash
cd back/
python -m pytest tests/
```

### Frontend
```bash
cd front/
npm test
```

## 📊 Funcionalidades Principales

### 🎯 Backend Features
- [x] API REST completa con Flask
- [x] ORM con SQLAlchemy 2.0.34
- [x] Sistema de migraciones con Alembic
- [x] Gestión de cámaras y eventos
- [x] Sistema de notificaciones
- [x] Monitoreo continuo
- [x] Configuración con variables de entorno

### 🎨 Frontend Features
- [x] Dashboard responsive con React 19
- [x] Diseño moderno con Tailwind CSS 4.0.9
- [x] Comunicación tiempo real con Socket.io
- [x] Notificaciones UI con React Toastify
- [x] Iconografía con React Feather
- [x] Pruebas unitarias con Testing Library

### 🤖 WhatsApp Bot Features
- [x] Autenticación con QR code
- [x] Notificaciones automáticas
- [x] Comandos de consulta
- [x] Integración con backend
- [x] Soporte para múltiples sessiones

## 📂 Estructura de Archivos Backend

```
back/
├── app.py                 # Aplicación Flask principal
├── camera_manager.py      # Gestión de cámaras
├── data_manager.py        # Manejo de datos
├── database.py           # Configuración de BD
├── monitor.py            # Sistema de monitoreo
├── notification.py       # Sistema de notificaciones
├── routes.py             # Rutas de la API
├── config.py             # Configuración
├── init_db.py            # Inicialización BD
├── prueba.py             # Archivo de pruebas
├── whatsapp.py           # Integración WhatsApp
└── requirements.txt      # Dependencias Python
```

## 🔄 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/cameras` | Listar todas las cámaras |
| GET | `/api/cameras/<id>` | Obtener cámara específica |
| POST | `/api/cameras` | Crear nueva cámara |
| PUT | `/api/cameras/<id>` | Actualizar cámara |
| DELETE | `/api/cameras/<id>` | Eliminar cámara |
| GET | `/api/status` | Estado general del sistema |
| POST | `/api/notifications` | Enviar notificación |

## 🚨 Troubleshooting

### Problemas Comunes

**Error de CORS:**
```bash
# Verificar Flask-Cors configurado en app.py
from flask_cors import CORS
CORS(app)
```

**Bot WhatsApp no conecta:**
```bash
# Limpiar sesión y regenerar QR
rm -rf whatsapp-bot/.wwebjs_auth/
npm start
```

**Base de datos no inicializa:**
```bash
# Recrear base de datos
rm back/status.db
python back/init_db.py
```

## 📈 Monitoreo y Logs

### Logs del Sistema
```bash
# Backend logs
tail -f back/logs/app.log

# WhatsApp Bot logs
tail -f whatsapp-bot/logs/bot.log
```

### Métricas de Rendimiento
- Tiempo de respuesta de API
- Uso de memoria del sistema
- Conexiones activas WebSocket
- Estado de conexión WhatsApp

## 🔒 Seguridad

- ✅ Variables de entorno para datos sensibles
- ✅ Validación de entrada en API
- ✅ CORS configurado correctamente
- ✅ Autenticación de sesiones WhatsApp
- ✅ Logs de seguridad habilitados

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 👥 Equipo de Desarrollo

- **Desarrollador Full Stack** - Desarrollo principal

<div align="center">
  <p><strong>STATUS</strong> - Sistema de Monitoreo de Cámaras Full Stack</p>
  <p>Desarrollado con Flask, React y Node.js</p>
</div>
