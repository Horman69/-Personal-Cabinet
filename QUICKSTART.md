# 🚀 Быстрый старт

Полное руководство по запуску проекта "Личный кабинет".

## Предварительные требования

- **Node.js** 18+ ([скачать](https://nodejs.org/))
- **PostgreSQL** 14+ ([скачать](https://www.postgresql.org/download/))
- **Git** ([скачать](https://git-scm.com/))

## Шаг 1: Клонирование проекта

```bash
cd C:\Users\poker\.gemini\antigravity\scratch\personal-cabinet
```

## Шаг 2: Настройка Backend

### 2.1 Установка зависимостей

```bash
cd backend
npm install
```

### 2.2 Настройка базы данных

Создайте базу данных PostgreSQL:

```bash
# Откройте PostgreSQL
psql -U postgres

# Создайте БД
CREATE DATABASE personal_cabinet;

# Выйдите
\q
```

### 2.3 Настройка переменных окружения

Создайте файл `.env`:

```bash
cp .env.example .env
```

Отредактируйте `.env` (замените `username` и `password` на свои):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/personal_cabinet?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

### 2.4 Применение миграций

```bash
npx prisma migrate dev --name init
```

### 2.5 Запуск backend

```bash
npm run start:dev
```

✅ Backend запущен на http://localhost:3001

---

## Шаг 3: Настройка Frontend

Откройте **новый терминал**.

### 3.1 Установка зависимостей

```bash
cd frontend
npm install
```

### 3.2 Настройка переменных окружения

Создайте файл `.env.local`:

```bash
cp .env.local.example .env.local
```

Содержимое `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3.3 Запуск frontend

```bash
npm run dev
```

✅ Frontend запущен на http://localhost:3000

---

## Шаг 4: Тестирование

Откройте браузер: http://localhost:3000

### Регистрация нового пользователя

1. Нажмите "Регистрация"
2. Заполните форму:
   - Email: `test@example.com`
   - Пароль: `password123`
   - Имя: `Иван`
   - Фамилия: `Иванов`
3. Нажмите "Зарегистрироваться"

### Вход в систему

1. Нажмите "Войти"
2. Введите:
   - Email: `test@example.com`
   - Пароль: `password123`
3. Нажмите "Войти"

### Личный кабинет

После входа вы попадете в личный кабинет, где можете:
- Просмотреть свой профиль
- Редактировать имя и фамилию
- Выйти из системы

---

## Структура проекта

```
personal-cabinet/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── auth/              # Аутентификация
│   │   ├── users/             # Пользователи
│   │   ├── prisma/            # База данных
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma      # Схема БД
│   ├── .env                   # Переменные окружения
│   └── SETUP.md               # Подробная инструкция
│
├── frontend/                   # Next.js приложение
│   ├── src/
│   │   ├── app/               # Страницы
│   │   │   ├── login/         # Вход
│   │   │   ├── register/      # Регистрация
│   │   │   └── profile/       # Профиль
│   │   └── lib/               # API клиент
│   ├── .env.local             # Переменные окружения
│   └── SETUP.md               # Подробная инструкция
│
└── README.md                   # Этот файл
```

---

## Полезные команды

### Backend

```bash
cd backend

# Development режим
npm run start:dev

# Просмотр БД (Prisma Studio)
npx prisma studio

# Создание миграции
npx prisma migrate dev --name migration_name

# Сброс БД (ОСТОРОЖНО!)
npx prisma migrate reset
```

### Frontend

```bash
cd frontend

# Development режим
npm run dev

# Production сборка
npm run build
npm run start
```

---

## Troubleshooting

### Backend не запускается

**Ошибка:** `Can't reach database server`

**Решение:**
1. Убедитесь, что PostgreSQL запущен
2. Проверьте `DATABASE_URL` в `.env`
3. Проверьте, что база данных создана

### Frontend не подключается к backend

**Ошибка:** `Network Error`

**Решение:**
1. Убедитесь, что backend запущен на http://localhost:3001
2. Проверьте `NEXT_PUBLIC_API_URL` в `.env.local`
3. Проверьте CORS настройки в backend

### Порт уже занят

**Ошибка:** `EADDRINUSE: address already in use`

**Решение:**
- Измените `PORT` в `backend/.env` (например, на 3002)
- Или остановите процесс на этом порту

---

## Что дальше?

### Версия 1.1 (следующие функции)

- [ ] Email верификация
- [ ] Восстановление пароля
- [ ] Загрузка аватара

### Версия 1.2

- [ ] 2FA (двухфакторная аутентификация)
- [ ] История активности
- [ ] Управление сессиями

### Улучшения

- [ ] Добавить тесты (Jest, Playwright)
- [ ] Улучшить UI/UX
- [ ] Добавить валидацию форм (react-hook-form + zod)
- [ ] Деплой на production

---

## Технологии

### Backend
- **NestJS** - фреймворк для Node.js
- **TypeScript** - типизированный JavaScript
- **PostgreSQL** - реляционная база данных
- **Prisma** - ORM для работы с БД
- **JWT** - токены для аутентификации
- **bcrypt** - хеширование паролей

### Frontend
- **Next.js 14** - React фреймворк
- **TypeScript** - типизированный JavaScript
- **TailwindCSS** - утилитарный CSS
- **Axios** - HTTP клиент

---

## Документация

- [Backend Setup](./backend/SETUP.md) - подробная инструкция по backend
- [Frontend Setup](./frontend/SETUP.md) - подробная инструкция по frontend
- [Полный анализ ЛК](../personal-cabinet-guide/personal-cabinet-analysis.md) - теория и best practices

---

## Поддержка

Если возникли вопросы или проблемы:
1. Проверьте секцию Troubleshooting выше
2. Посмотрите подробные SETUP.md в папках backend и frontend
3. Проверьте логи в консоли

---

**Готово! Ваш личный кабинет работает! 🎉**
