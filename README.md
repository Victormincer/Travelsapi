# 🚀 TravelsAPI

TravelsAPI es una API REST construida con Node.js y Express, diseñada para manejar información de rutas, usuarios, localización por coordenadas y estadísticas de viaje. Es parte del ecosistema de la aplicación **TravelTdea**.

---

## 📌 Características

- CRUD de rutas con información geográfica.
- Gestión de usuarios con autenticación.
- Búsqueda de rutas por coordenadas y nombre.
- Generación de estadísticas (usuarios, viajes, distancias, etc.).
- Compatible con bases de datos como MongoDB o SQL Server.
- Estructura basada en controladores, rutas y modelos.

---

## 🛠️ Tecnologías utilizadas

- **Node.js**
- **Express.js**
- **MongoDB / Mongoose**
- **JWT** para autenticación
- **Multer** (si hay subida de archivos)
- **Dotenv**, **Cors**, **Bcrypt**, etc.

---
## 🧱 Estructura del proyecto
Travelsapi/
├── routes/ # Rutas de la API
├── controllers/ # Lógica de negocio
├── models/ # Modelos de datos (Mongoose o SQL)
├── middleware/ # Validaciones y autenticaciones
├── config/ # Conexiones a base de datos y variables
├── utils/ # Funciones auxiliares
├── .env # Variables de entorno
└── server.js # Punto de entrada del servidor
