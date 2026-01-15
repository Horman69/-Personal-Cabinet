# Личный кабинет - Современный стек

Полноценный модуль личного кабинета на современном стеке технологий.

## 🛠 Технологии

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **React 18**
- **TailwindCSS** (стилизация)
- **Zod** (валидация)

### Backend
- **NestJS** (TypeScript)
- **PostgreSQL** (база данных)
- **Prisma** (ORM)
- **JWT** (аутентификация)
- **bcrypt** (хеширование паролей)

## 📁 Структура проекта

```
personal-cabinet/
├── frontend/          # Next.js приложение
│   ├── src/
│   │   ├── app/      # App Router страницы
│   │   ├── components/
│   │   ├── lib/      # Утилиты и API клиент
│   │   └── types/
│   └── package.json
│
├── backend/           # NestJS API
│   ├── src/
│   │   ├── auth/     # Модуль аутентификации
│   │   ├── users/    # Модуль пользователей
│   │   └── common/   # Общие компоненты
│   ├── prisma/       # Схема БД
│   └── package.json
│
└── README.md
```

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Настройка базы данных

```bash
cd backend
cp .env.example .env
# Отредактируйте .env (укажите DATABASE_URL)

# Создайте БД
npx prisma migrate dev --name init
```

### 3. Запуск

```bash
# Backend (терминал 1)
cd backend
npm run start:dev

# Frontend (терминал 2)
cd frontend
npm run dev
```

Откройте http://localhost:3000

## 📚 Функционал

### MVP (Версия 1.0)
- ✅ Регистрация пользователя
- ✅ Вход в систему
- ✅ Просмотр профиля
- ✅ Редактирование профиля
- ✅ Смена пароля
- ✅ Выход из системы

### Версия 1.1 (планируется)
- ⏳ Email верификация
- ⏳ Восстановление пароля
- ⏳ Загрузка аватара

### Версия 1.2 (планируется)
- ⏳ 2FA (двухфакторная аутентификация)
- ⏳ История активности
- ⏳ Управление сессиями

## 🔒 Безопасность

- Пароли хешируются с помощью bcrypt
- JWT токены с коротким сроком жизни (15 мин)
- Refresh токены (7 дней)
- HttpOnly cookies
- CORS настроен
- Валидация всех входных данных

## 📖 API Документация

### Auth Endpoints

**POST** `/auth/register`
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**POST** `/auth/login`
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**POST** `/auth/refresh`
```json
{
  "refreshToken": "..."
}
```

**POST** `/auth/logout`
```
Headers: Authorization: Bearer <token>
```

### User Endpoints

**GET** `/users/me`
```
Headers: Authorization: Bearer <token>
```

**PATCH** `/users/me`
```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**POST** `/users/change-password`
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

## 🧪 Тестирование

```bash
# Backend тесты
cd backend
npm run test

# E2E тесты
npm run test:e2e
```

## 📝 Лицензия

MIT
