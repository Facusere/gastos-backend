# Gestión de Gastos Backend

Este proyecto es un backend RESTful construido con Node.js y Express para la gestión de gastos, utilizando Supabase (PostgreSQL) como base de datos. Incluye endpoints para CRUD, filtrado y reportes mensuales.

## Endpoints principales
- `GET /api/expenses` — Lista todos los gastos
- `GET /api/expenses/:id` — Obtiene un gasto por ID
- `POST /api/expenses` — Crea un gasto (con validaciones)
- `PUT /api/expenses/:id` — Actualiza un gasto
- `DELETE /api/expenses/:id` — Elimina un gasto
- `GET /api/expenses?category=...&month=...` — Filtra gastos
- `GET /api/reports/monthly?month=...` — Reporte mensual

## Configuración
1. Crear un archivo `.env` con las variables de conexión a Supabase.
2. Instalar dependencias: `npm install`
3. Iniciar el servidor: `npm start`

## Despliegue
Preparado para Render.

## Estructura de la tabla `expenses`
- id (uuid, PK)
- monto (decimal)
- fecha (date)
- categoría (string)
- descripción (string)
- timestamp (datetime)

---

Para más detalles, ver el código fuente y la documentación de endpoints.
