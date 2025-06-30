# Gestión de Gastos Backend

Este proyecto es un backend RESTful construido con Node.js y Express para la gestión de gastos personales, utilizando Supabase (PostgreSQL) como base de datos. Incluye endpoints para autenticación, CRUD, filtrado y reportes mensuales.

## Endpoints principales
- `POST /api/auth/register` — Registro de usuario
- `POST /api/auth/login` — Inicio de sesión
- `GET /api/expenses` — Lista todos los gastos (soporta filtros por `category` y `month`)
- `GET /api/expenses/:id` — Obtiene un gasto por ID
- `POST /api/expenses` — Crea un gasto (valida categoría permitida)
- `PUT /api/expenses/:id` — Actualiza un gasto (valida categoría permitida)
- `DELETE /api/expenses/:id` — Elimina un gasto
- `GET /api/expenses/reports/monthly?month=YYYY-MM` — Reporte mensual por categoría

## Validaciones
- La categoría de gasto debe ser una de: `Alimentación`, `Transporte`, `Compras`, `Salud`, `Otra`.
- Todos los campos requeridos son validados en backend.

## Configuración
1. Crear un archivo `.env` con las variables de conexión a Supabase.
2. Instalar dependencias: `npm install`
3. Iniciar el servidor: `npm start`

## Despliegue
Preparado para Render o cualquier servicio Node.js compatible.

## Estructura de la tabla `expenses`
- id (uuid, PK)
- monto (decimal)
- fecha (date)
- categoría (string)
- descripción (string)
- timestamp (datetime)

---

Para más detalles, ver el código fuente y la documentación de endpoints.
