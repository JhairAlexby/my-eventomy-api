# Eventomy API

Una API REST completa para una aplicación móvil de calendario de eventos, construida con NestJS, TypeORM y PostgreSQL.

## Características

- **Autenticación JWT**: Sistema completo de registro y login de usuarios
- **Gestión de Eventos**: CRUD completo para eventos con validación de datos
- **Filtros Avanzados**: Búsqueda por fechas, eventos próximos, eventos por mes
- **Recordatorios**: Sistema de recordatorios configurables para eventos
- **Documentación API**: Swagger/OpenAPI integrado
- **Validación Global**: Validación automática de datos de entrada
- **Manejo de Errores**: Sistema global de manejo de errores
- **CORS**: Configuración flexible de CORS

## Tecnologías

- **Framework**: NestJS
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT con Passport
- **Validación**: class-validator
- **Documentación**: Swagger/OpenAPI
- **Lenguaje**: TypeScript

## Estructura del Proyecto

```
src/
├── auth/                   # Módulo de autenticación
│   ├── dto/               # DTOs para login y registro
│   ├── guards/            # Guards de autenticación
│   ├── strategies/        # Estrategias de Passport
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/                 # Módulo de usuarios
│   ├── entities/
│   ├── users.service.ts
│   └── users.module.ts
├── events/                # Módulo de eventos
│   ├── dto/               # DTOs para eventos
│   ├── entities/
│   ├── events.controller.ts
│   ├── events.service.ts
│   └── events.module.ts
├── common/                # Utilidades compartidas
│   ├── filters/           # Filtros de excepción
│   └── interceptors/      # Interceptores
├── config/                # Configuración
│   └── database.config.ts
├── app.module.ts
└── main.ts
```

## Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- pnpm (recomendado) o npm

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd my-eventomy-api
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar el archivo `.env` con tus configuraciones:
   ```env
   # Application Configuration
   PORT=3000
   NODE_ENV=development
   API_PREFIX=api/v1
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=eventomy_db
   
   # JWT Configuration
   JWT_SECRET=tu-clave-secreta-jwt-muy-segura
   JWT_EXPIRES_IN=7d
   ```

4. **Configurar la base de datos**
   ```bash
   # Crear la base de datos en PostgreSQL
   createdb eventomy_db
   ```

5. **Ejecutar migraciones** (cuando estén disponibles)
   ```bash
   pnpm run migration:run
   ```

## Uso

### Desarrollo

```bash
# Modo desarrollo con hot-reload
pnpm run start:dev

# Modo desarrollo con debug
pnpm run start:debug
```

### Producción

```bash
# Construir la aplicación
pnpm run build

# Ejecutar en producción
pnpm run start:prod
```

### Testing

```bash
# Tests unitarios
pnpm run test

# Tests e2e
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

## Documentación de la API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:3000/api/docs
```

### Endpoints Principales

#### Autenticación

- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `POST /api/v1/auth/login` - Iniciar sesión

#### Eventos (Requiere autenticación)

- `GET /api/v1/events` - Obtener todos los eventos del usuario
- `POST /api/v1/events` - Crear nuevo evento
- `GET /api/v1/events/:id` - Obtener evento específico
- `PATCH /api/v1/events/:id` - Actualizar evento
- `DELETE /api/v1/events/:id` - Eliminar evento
- `GET /api/v1/events/upcoming` - Obtener eventos próximos
- `GET /api/v1/events/date-range` - Obtener eventos en rango de fechas
- `GET /api/v1/events/month/:year/:month` - Obtener eventos por mes

## Modelos de Datos

### Usuario

```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Evento

```typescript
{
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  reminders?: ReminderType[];
  isAllDay: boolean;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Tipos de Recordatorio

```typescript
enum ReminderType {
  FIVE_MINUTES = 'FIVE_MINUTES',
  FIFTEEN_MINUTES = 'FIFTEEN_MINUTES',
  THIRTY_MINUTES = 'THIRTY_MINUTES',
  ONE_HOUR = 'ONE_HOUR',
  TWO_HOURS = 'TWO_HOURS',
  ONE_DAY = 'ONE_DAY',
  ONE_WEEK = 'ONE_WEEK'
}
```

## Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a los endpoints protegidos:

1. Registra un usuario o inicia sesión
2. Incluye el token en el header `Authorization`:
   ```
   Authorization: Bearer <tu-jwt-token>
   ```

## Validación de Datos

La API incluye validación automática para todos los endpoints:

- **Emails**: Formato válido requerido
- **Contraseñas**: Mínimo 6 caracteres
- **Fechas**: Formato ISO 8601
- **Colores**: Formato hexadecimal válido
- **Campos requeridos**: Validación automática

## Manejo de Errores

La API retorna errores en formato JSON consistente:

```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/events",
  "method": "POST",
  "message": "Validation failed"
}
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para reportar bugs o solicitar nuevas características, por favor abre un issue en el repositorio.
