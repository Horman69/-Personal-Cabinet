# Backend Setup Instructions

## Предварительные требования

1. **Node.js** (версия 18+)
   - Скачайте с https://nodejs.org/

2. **PostgreSQL** (версия 14+)
   - Windows: https://www.postgresql.org/download/windows/
   - Или используйте Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

## Установка и запуск

### 1. Установите зависимости

```bash
cd backend
npm install
```

### 2. Настройте базу данных

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Отредактируйте `.env` и укажите ваши данные:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/personal_cabinet?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

### 3. Создайте базу данных

```bash
# Подключитесь к PostgreSQL
psql -U postgres

# Создайте базу данных
CREATE DATABASE personal_cabinet;

# Выйдите
\q
```

### 4. Примените миграции

```bash
npx prisma migrate dev --name init
```

Эта команда:
- Создаст таблицы в БД
- Сгенерирует Prisma Client

### 5. (Опционально) Откройте Prisma Studio

Для просмотра данных в БД:

```bash
npx prisma studio
```

Откроется http://localhost:5555

### 6. Запустите сервер

```bash
# Development режим (с hot reload)
npm run start:dev

# Production режим
npm run build
npm run start:prod
```

Сервер запустится на http://localhost:3001

## Тестирование API

### Используйте Postman, Insomnia или curl

**Регистрация:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Вход:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Получить профиль:**
```bash
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Полезные команды

```bash
# Форматирование кода
npm run format

# Линтинг
npm run lint

# Тесты
npm run test

# Генерация Prisma Client (после изменения schema.prisma)
npx prisma generate

# Создание новой миграции
npx prisma migrate dev --name migration_name

# Сброс БД (ОСТОРОЖНО! Удалит все данные)
npx prisma migrate reset
```

## Структура проекта

```
backend/
├── src/
│   ├── auth/              # Модуль аутентификации
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── guards/        # JWT Guards
│   │   ├── strategies/    # Passport стратегии
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/             # Модуль пользователей
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── prisma/            # Prisma сервис
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts      # Корневой модуль
│   └── main.ts            # Точка входа
├── prisma/
│   └── schema.prisma      # Схема БД
├── .env                   # Переменные окружения (НЕ коммитить!)
├── .env.example           # Пример переменных
└── package.json
```

## Troubleshooting

### Ошибка подключения к БД

```
Error: P1001: Can't reach database server
```

**Решение:**
- Убедитесь, что PostgreSQL запущен
- Проверьте DATABASE_URL в `.env`
- Проверьте, что база данных создана

### Ошибка миграции

```
Error: P3009: migrate found failed migrations
```

**Решение:**
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Порт уже занят

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Решение:**
- Измените PORT в `.env`
- Или остановите процесс на порту 3001

## Следующие шаги

После запуска backend:
1. Перейдите к настройке frontend
2. Протестируйте все endpoints
3. Добавьте дополнительные функции (email верификация, 2FA и т.д.)
