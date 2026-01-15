# Frontend Setup Instructions

## Предварительные требования

1. **Node.js** (версия 18+)
   - Скачайте с https://nodejs.org/

2. **Backend должен быть запущен**
   - См. `../backend/SETUP.md`
   - Backend должен работать на http://localhost:3001

## Установка и запуск

### 1. Установите зависимости

```bash
cd frontend
npm install
```

### 2. Настройте переменные окружения

Создайте файл `.env.local` на основе `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Содержимое `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Запустите dev сервер

```bash
npm run dev
```

Приложение откроется на http://localhost:3000

### 4. (Production) Сборка

```bash
npm run build
npm run start
```

## Структура проекта

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── login/              # Страница входа
│   │   ├── register/           # Страница регистрации
│   │   ├── profile/            # Личный кабинет
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Главная страница
│   │   └── globals.css         # Глобальные стили
│   └── lib/                    # Утилиты
│       ├── api.ts              # Axios клиент
│       └── auth.ts             # API методы
├── public/                     # Статические файлы
├── .env.local                  # Переменные окружения (НЕ коммитить!)
├── .env.local.example          # Пример переменных
├── next.config.js              # Конфигурация Next.js
├── tailwind.config.js          # Конфигурация TailwindCSS
├── tsconfig.json               # Конфигурация TypeScript
└── package.json
```

## Основные страницы

### Главная страница
- URL: http://localhost:3000
- Описание: Приветственная страница с ссылками на вход/регистрацию

### Регистрация
- URL: http://localhost:3000/register
- Поля: email, пароль, имя, фамилия
- Валидация: минимум 6 символов для пароля

### Вход
- URL: http://localhost:3000/login
- Поля: email, пароль
- После входа редирект на /profile

### Профиль
- URL: http://localhost:3000/profile
- Требует авторизации
- Функции: просмотр и редактирование профиля, выход

## Как это работает

### Аутентификация

1. **Регистрация/Вход:**
   - Пользователь вводит данные
   - Запрос на backend `/api/auth/register` или `/api/auth/login`
   - Backend возвращает `accessToken` и `refreshToken`
   - Токены сохраняются в `localStorage`

2. **Автоматическое обновление токенов:**
   - При каждом запросе `accessToken` добавляется в заголовок
   - Если `accessToken` истек (401 ошибка), автоматически используется `refreshToken`
   - Получаются новые токены и запрос повторяется
   - Если `refreshToken` тоже истек, редирект на `/login`

3. **Защищенные страницы:**
   - Страница `/profile` проверяет наличие токена
   - Если токена нет, редирект на `/login`

### API клиент

Файл `src/lib/api.ts` содержит настроенный axios с:
- Автоматическим добавлением токена к запросам
- Автоматическим обновлением токенов
- Обработкой ошибок

Файл `src/lib/auth.ts` содержит типизированные методы:
- `authApi.register()` - регистрация
- `authApi.login()` - вход
- `authApi.logout()` - выход
- `usersApi.getProfile()` - получить профиль
- `usersApi.updateProfile()` - обновить профиль

## Полезные команды

```bash
# Development сервер
npm run dev

# Production сборка
npm run build

# Запуск production
npm run start

# Линтинг
npm run lint
```

## Troubleshooting

### Ошибка подключения к API

```
Error: Network Error
```

**Решение:**
- Убедитесь, что backend запущен на http://localhost:3001
- Проверьте `NEXT_PUBLIC_API_URL` в `.env.local`
- Проверьте CORS настройки в backend

### Токены не сохраняются

**Решение:**
- Проверьте консоль браузера на ошибки
- Убедитесь, что localStorage доступен
- Проверьте, что backend возвращает токены

### Редирект на /login после входа

**Решение:**
- Проверьте, что токены сохраняются в localStorage
- Проверьте консоль на ошибки API
- Убедитесь, что backend возвращает правильный формат данных

## Следующие шаги

1. **Добавить смену пароля:**
   - Создать страницу `/profile/change-password`
   - Использовать `usersApi.changePassword()`

2. **Добавить загрузку аватара:**
   - Endpoint для загрузки файлов
   - Компонент для выбора и загрузки изображения

3. **Улучшить UX:**
   - Добавить loading состояния
   - Улучшить обработку ошибок
   - Добавить валидацию форм (react-hook-form + zod)

4. **Добавить тесты:**
   - Unit тесты для компонентов
   - E2E тесты с Playwright
