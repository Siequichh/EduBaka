# Guía de Uso y Configuración - EduBaka

¡Bienvenido al proyecto EduBaka! Esta aplicación está dividida en dos partes principales:
1. **Frontend**: Desarrollado con React, Vite, y TailwindCSS.
2. **Backend**: Desarrollado con Java 21, Spring Boot, y Gradle.

A continuación, te mostramos los pasos necesarios para configurar y levantar el proyecto localmente.

---

## 🛠️ Requisitos Previos

1. **Java 21**: Asegúrate de tener el JDK 21 instalado (`java -version`).
2. **Node.js**: Se requiere Node 18 o superior (`node -v`).
3. **PostgreSQL**: Debes tener una base de datos PostgreSQL instalada y corriendo localmente en el puerto `5432` (o puedes usar un contenedor Docker).

---

## ⚙️ 1. Configuración de la Base de Datos (PostgreSQL)

1. Abre tu cliente de PostgreSQL (pgAdmin, DBeaver o la consola `psql`).
2. Crea una nueva base de datos llamada `edubaka_db`.
   ```sql
   CREATE DATABASE edubaka_db;
   ```
3. *(Opcional)* Si tu usuario y contraseña de Postgres no son `postgres`/`postgres`, asegúrate de actualizar las credenciales en el archivo `.env` del backend en el siguiente paso.

---

## 🚀 2. Configurar y Levantar el Backend (Spring Boot)

1. Navega a la carpeta del backend:
   ```bash
   cd Edubackend/Edubackend
   ```
2. **Variables de Entorno (.env)**:
   - Ya se ha generado un archivo `.env` base para ti.
   - Si tu base de datos tiene credenciales distintas, edita el archivo `Edubackend/Edubackend/.env`.
   - Si deseas usar Google Login, agrega tu `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.
   - *Nota:* Si corres la app desde tu IDE (como IntelliJ), asegúrate de tener instalado el plugin "EnvFile" o configura las variables de entorno en tu "Run Configuration". Alternativamente, Spring Boot tomará los valores por defecto configurados en `application.yaml` si no usas un plugin de `.env`.

3. Construye y ejecuta el proyecto con Gradle:
   ```bash
   # En Windows
   .\gradlew bootRun
   
   # En Mac/Linux
   ./gradlew bootRun
   ```
4. El backend estará corriendo en: **http://localhost:8080**
5. Al ejecutarse por primera vez, las tablas se crearán automáticamente (gracias a `ddl-auto: update`) y se insertarán los "Ciclos Académicos" por defecto.

---

## 🎨 3. Configurar y Levantar el Frontend (React + Vite)

1. Abre una nueva terminal y navega a la carpeta del frontend:
   ```bash
   cd EduBakaFront
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. **Variables de Entorno (.env)**:
   - Ya cuentas con un archivo `.env` base que apunta al backend en `http://localhost:8080/api`. Si cambiaste el puerto del backend, actualiza la variable `VITE_API_URL` aquí.
4. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. El frontend estará disponible en: **http://localhost:5173**

---

## 🔑 4. Probando la Aplicación

1. Ve a `http://localhost:5173/login`.
2. Como es tu primera vez, puedes probar **Registrar** un nuevo usuario usando la API. *(Nota: La interfaz actual de login no tiene un botón explícito de "Crear cuenta", pero el endpoint `/api/auth/register` ya está listo en el backend).*
3. Una vez iniciada la sesión, serás redirigido al **Dashboard**.
4. ¡Prueba el **Modo WoW**! En la barra lateral, haz clic en el botón con destellos (✨) para ver cómo la aplicación cambia de apariencia dinámica usando nuestro Theme Engine personalizado.

---

## 📚 Arquitectura y Patrones (Para Desarrolladores)

- **Auditoría JPA**: Todas las entidades heredan de `AuditableEntity`. No necesitas setear `createdAt` o `createdBy` manualmente. El backend extrae el usuario del token JWT y lo asigna automáticamente.
- **Enums Persistentes**: Utilizamos la interfaz `DisplayableEnum`. Los enums (ej. `UserRole.ADMIN`) se guardan en la DB usando su código seguro (ej. `"02"`) gracias a los JPA Converters, evitando problemas si cambia el nombre del enum.
- **Temas en Frontend**: Se usa `ThemeContext` para manejar tanto el tema clásico (`light`/`dark`) como el estado de asombro (`default`/`wow`). Esto nos permite agregar animaciones pesadas o fondos dinámicos sin ensuciar la lógica de nuestros componentes.

¡Disfruta desarrollando EduBaka!
