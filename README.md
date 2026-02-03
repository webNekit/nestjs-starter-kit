# 📘 NestJS Senior Starter Kit

> Профессиональный шаблон для разработки масштабируемых серверных приложений (REST API).  
> Включает настроенную архитектуру, Cookie-based аутентификацию, Prisma ORM, валидацию файлов и стандарты кода уровня Middle+/Senior.

---

## 📑 Оглавление (Table of Contents)

### **Глава 1. Введение**
*   [1.1 О проекте](#11-о-проекте) — *Философия и цели стартер-кита.*
*   [1.2 Стек технологий](#12-стек-технологий) — *NestJS, Prisma, Passport, Swagger, Docker.*
*   [1.3 Ключевые возможности](#13-ключевые-возможности) — *Список готовых фич (Auth, Uploads, Global Filters).*

### **Глава 2. Установка и Запуск**
*   [2.1 Предварительные требования](#21-предварительные-требования) — *Node.js, NPM, Docker.*
*   [2.2 Установка зависимостей](#22-установка-зависимостей) — *Клонирование и npm install.*
*   [2.3 Настройка окружения (.env)](#23-настройка-окружения-env) — *Описание всех переменных конфигурации.*
*   [2.4 Запуск приложения](#24-запуск-приложения) — *Режимы: Dev, Debug, Production.*
*   [2.5 Запуск через Docker](#25-запуск-через-docker) — *Поднятие инфраструктуры одной командой.*

### **Глава 3. Архитектура и Структура**
*   [3.1 Структура папок](#31-структура-папок) — *Подробный разбор `src/common` и `src/modules`.*
*   [3.2 Модуль `Common` (Ядро)](#32-модуль-common-ядро) — *Глобальные гарды, фильтры исключений, интерсепторы.*
*   [3.3 Принципы разработки](#33-принципы-разработки) — *Thin Controllers, Fat Services, DTO Validation.*
*   [3.4 Жизненный цикл запроса](#34-жизненный-цикл-запроса) — *Middleware -> Guard -> Interceptor -> Controller.*

### **Глава 4. Аутентификация и Безопасность**
*   [4.1 Механизм Cookie-Based Auth](#41-механизм-cookie-based-auth) — *Почему Cookies, а не LocalStorage? Безопасность и SSR.*
*   [4.2 JWT Стратегии](#42-jwt-стратегии) — *Access Token (Short) и Refresh Token (Long).*
*   [4.3 Управление доступом (RBAC)](#43-управление-доступом-rbac) — *Декоратор `@Roles` и защита маршрутов.*
*   [4.4 Защита приложения](#44-защита-приложения) — *Helmet, CORS, Rate Limiting.*

### **Глава 5. Работа с Данными (Prisma ORM)**
*   [5.1 Схема базы данных](#51-схема-базы-данных) — *Модели, связи и enum.*
*   [5.2 Миграции](#52-миграции) — *Workflow работы с `prisma migrate`.*
*   [5.3 Prisma Studio](#53-prisma-studio) — *GUI для просмотра данных.*

### **Глава 6. Файловая система**
*   [6.1 Загрузка файлов](#61-загрузка-файлов) — *Конфигурация Multer и валидация типов/размеров.*
*   [6.2 Раздача статики](#62-раздача-статики) — *Доступ к загруженным файлам через API.*

### **Глава 7. Cookbook: Создание нового модуля (Гайд)**
> *Пошаговая инструкция для разработчиков по добавлению новой сущности.*
*   [7.1 Шаг 1: Проектирование схемы и DTO](#71-шаг-1-проектирование-схемы-и-dto)
*   [7.2 Шаг 2: Реализация Сервиса](#72-шаг-2-реализация-сервиса) — *Бизнес-логика, маппинг данных.*
*   [7.3 Шаг 3: Реализация Контроллера](#73-шаг-3-реализация-контроллера) — *Swagger документация, Guards.*
*   [7.4 Шаг 4: Регистрация модуля](#74-шаг-4-регистрация-модуля)
*   [7.5 Чек-лист качества модуля](#75-чек-лист-качества-модуля)

### **Глава 8. Инструменты качества**
*   [8.1 Линтинг и Форматирование](#81-линтинг-и-форматирование) — *ESLint, Prettier.*
*   [8.2 Swagger документация](#82-swagger-документация) — *Как описывать API.*
*   [8.3 Git Hooks](#83-git-hooks) — *Автоматические проверки (Husky).*

### **Глава 9. Деплой и Production**
*   [9.1 Сборка проекта](#91-сборка-проекта) — *npm run build.*
*   [9.2 Рекомендации по серверу](#92-рекомендации-по-серверу) — *Nginx, SSL, PM2.*

---
### **Глава 1. Введение**

#### 1.1 О проекте

**NestJS Senior Starter Kit** — это надежный фундамент для создания масштабируемых REST API приложений корпоративного уровня.

В отличие от стандартного `nest new project`, этот стартер-кит решает главные проблемы, с которыми сталкиваются разработчики при росте проекта:
1.  **Хаос в архитектуре:** Здесь реализована строгая модульная структура с выделенным ядром (`Common`).
2.  **Безопасность:** Настроены `Helmet`, `CORS`, валидация данных и защита от брутфорса.
3.  **Аутентификация для SSR:** Реализована безопасная система на базе **HttpOnly Cookies**, идеально подходящая для связки с **Next.js (Server Actions / SSR)**, где работа с LocalStorage невозможна или небезопасна.
4.  **Стандартизация:** Единый формат ответов API и ошибок, преднастроенный Swagger и Linter.

Цель этого проекта — сэкономить 40-60 часов на начальной настройке и сразу перейти к разработке бизнес-логики.

---

#### 1.2 Стек технологий

Мы используем только проверенные и актуальные библиотеки. Ниже приведен список основных зависимостей с объяснением, **зачем** они нужны.

**Core & Framework:**
*   **`@nestjs/core` / `common` / `platform-express`**: Основной фреймворк. Выбран за строгую архитектуру, DI (Dependency Injection) и поддержку TypeScript.
*   **`@nestjs/config`**: Управление переменными окружения (`.env`). Позволяет конфигурировать приложение под разные среды (Dev/Prod).

**Database (ORM):**
*   **`prisma` / `@prisma/client`**: Современная ORM. Обеспечивает полную типобезопасность (Type-safe) запросов к БД. В разы удобнее TypeORM.

**Authentication & Security:**
*   **`@nestjs/passport` + `passport-jwt`**: Стандарт де-факто для аутентификации в Node.js.
*   **`@nestjs/jwt`**: Генерация и верификация JSON Web Tokens.
*   **`argon2`**: Библиотека для хеширования паролей. Работает быстрее и безопаснее, чем устаревший `bcrypt`.
*   **`cookie-parser`**: Позволяет серверу читать куки из входящих запросов (критично для Refresh Token).
*   **`helmet`**: Проставляет безопасные HTTP-заголовки (защита от XSS, Clickjacking и др.).

**Validation & Transformation:**
*   **`class-validator`**: Декораторы для проверки входящих данных (`@IsEmail`, `@MinLength`).
*   **`class-transformer`**: Преобразование JSON-объектов в экземпляры классов DTO и обратно.
*   **`joi`**: Используется для валидации самого `.env` файла при старте (чтобы сервер не запустился без важных ключей).

**Files & Utilities:**
*   **`multer`** (встроен в Nest): Обработка `multipart/form-data` для загрузки файлов.
*   **`compression`**: Gzip-сжатие HTTP-ответов для ускорения работы API.
*   **`nestjs-pino` / `pino-http`** *(опционально)*: Высокопроизводительный JSON-логгер.

**Documentation:**
*   **`@nestjs/swagger` + `swagger-ui-express`**: Автоматическая генерация интерактивной документации API (`/api/docs`).

---

#### 1.3 Ключевые возможности

Здесь описаны все кастомные решения, внедренные в папку `src/common` и основные модули.

##### 🛡️ Безопасность и Аутентификация
*   **Cookie-Based Auth:** Токены не передаются в Body, а устанавливаются в `HttpOnly` Cookies. Это защищает от XSS-атак (скрипты на клиенте не могут украсть токен).
*   **Dual Token System:**
    *   `Access Token` (15 мин) — для доступа к ресурсам.
    *   `Refresh Token` (7 дней) — для обновления пары токенов. Хеш рефреш-токена хранится в БД для возможности принудительного разлогина (Logout).
*   **Guards (Защитники):**
    *   `JwtAuthGuard` — Проверяет наличие валидного Access-токена в куках.
    *   `JwtRefreshGuard` — Проверяет Refresh-токен (только для роута `/refresh`).
    *   `RolesGuard` — Реализует RBAC (Role-Based Access Control). Проверяет, есть ли у юзера права (например, `ADMIN`).
*   **Decorators:**
    *   `@CurrentUser()` — Извлекает пользователя из запроса (типизированный).
    *   `@Roles(Role.ADMIN)` — Навешивает требование роли на эндпоинт.
    *   `@Public()` — Открывает доступ к эндпоинту без авторизации (обход глобального гарда).

##### ⚙️ Ядро (Common Core)
*   **Global Exception Filter (`AllExceptionsFilter`):** Перехватывает любые ошибки приложения и отдает их в едином JSON-формате:
    ```json
    { "statusCode": 400, "message": "...", "timestamp": "..." }
    ```
*   **Global Response Interceptor (`TransformInterceptor`):** Оборачивает любой успешный ответ в стандартную структуру:
    ```json
    { "success": true, "data": { ... }, "timestamp": "..." }
    ```
*   **Logging Interceptor:** Логирует время выполнения каждого запроса в консоль (полезно для отладки производительности).
*   **Configuration:**
    *   `env.validation.ts` — Строгая схема валидации переменных окружения через Joi.
    *   `multer.config.ts` — Централизованная настройка загрузки файлов (папка, генерация имен).
    *   `swagger.config.ts` — Настройки документации.

##### 🛠️ Утилиты и Хелперы
*   **`hash.util.ts`**: Обертка над `argon2` для хеширования и сверки паролей/токенов.
*   **`url.util.ts` (`getFileUrl`)**: Формирует полный публичный URL к загруженному файлу, учитывая текущий домен сервера.
*   **`validation.constant.ts` (`IMAGE_VALIDATION`)**: Готовая конфигурация `ParseFilePipe` для валидации изображений (проверка расширения и размера) — используется в контроллерах.

##### 📦 Модули (Modules)
*   **AuthModule**: Полностью автономный модуль. Реализует регистрацию, логин, выход и обновление токенов. Не зависит от UsersModule напрямую.
*   **UsersModule**:
    *   Полный CRUD для администратора.
    *   Фильтрация списка (по ролям, сортировка).
    *   Пагинация (через `PaginationDto`).
    *   Загрузка и обновление аватарок с автоматическим удалением старых файлов с диска.
    *   Строгая типизация входных данных (DTO) и выходных (sanitize user).
---
### **Глава 2. Установка и Запуск**

#### 2.1 Предварительные требования

Перед началом работы убедитесь, что на вашем компьютере установлены:

*   **Node.js**: Версия `v18.x` или выше (рекомендуется `v20` LTS).
*   **NPM**: (Обычно идет в комплекте с Node.js) или **Yarn** / **PNPM**.
*   **Docker & Docker Compose**: (Опционально, но рекомендуется) для запуска базы данных PostgreSQL/MySQL в контейнере.
*   **Git**: Для клонирования репозитория.

---

#### 2.2 Установка зависимостей

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/webNekit/nestjs-starter-kit.git
    cd nestjs-senior-starter
    ```

2.  **Установите зависимости:**
    ```bash
    npm install
    ```
    > **Примечание:** После установки автоматически сработает `postinstall` скрипт Prisma (`prisma generate`), который сгенерирует TypeScript-типы для базы данных.

---

#### 2.3 Настройка окружения (.env)

Проект использует строгую валидацию переменных окружения. Приложение **не запустится**, пока не будет создан корректный файл `.env`.

1.  Скопируйте пример конфигурации:
    ```bash
    cp .env.example .env
    ```
    *(Если файла .env.example нет, создайте .env вручную).*

2.  **Заполните `.env` следующими значениями:**

```dotenv
# --- Основные настройки ---
NODE_ENV=development
PORT=9000
BASE_URL=http://localhost:9000
# Разрешенные домены (CORS). Для Next.js укажите адрес фронтенда:
CORS_ORIGIN=http://localhost:3000

# --- База данных (Prisma) ---
# Для локальной разработки по умолчанию используется SQLite (файл dev.db создастся сам)
DATABASE_URL="file:./dev.db"
# Для Production (PostgreSQL пример):
# DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# --- Безопасность (JWT) ---
# Генерируйте сложные случайные строки для продакшена!
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# --- Cookies (Важно для Next.js SSR) ---
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false           # Ставьте true, если используете HTTPS (в продакшене)
COOKIE_SAMESITE=lax           # lax или strict

# --- Загрузка файлов ---
UPLOAD_DIR=uploads
UPLOAD_MAX_SIZE=5242880       # 5 MB в байтах
UPLOAD_ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp

# --- Лимиты и Документация ---
RATE_LIMIT_WINDOW_MS=900000   # 15 минут
RATE_LIMIT_MAX=100            # 100 запросов с одного IP
SWAGGER_ENABLED=true
```

---

#### 2.4 База данных (Prisma)

Если вы используете **SQLite** (по умолчанию), база данных инициализируется автоматически при первой миграции.

1.  **Примените миграции (создание таблиц):**
    ```bash
    npx prisma migrate dev --name init
    ```

2.  **Генерация типов из базы данных:**
    ```bash
    npx prisma generate
    ```
    or
    ```bash
    nest start
    ```

3.  **(Опционально) Запустите Prisma Studio** (GUI для просмотра базы данных):
    ```bash
    npx prisma studio
    ```
    Доступно по адресу: `http://localhost:5555`.

---

#### 2.5 Запуск приложения

Приложение поддерживает несколько режимов запуска через `package.json`:

*   **Режим разработки (Watch Mode):**
    Автоматически перезагружается при изменении файлов.
    ```bash
    npm run start:dev
    ```
    *Сервер запустится на: `http://localhost:9000`*
    *Документация Swagger: `http://localhost:9000/api/docs`*

*   **Режим отладки (Debug Mode):**
    ```bash
    npm run start:debug
    ```

*   **Продакшен режим:**
    Сборка проекта в папку `dist` и запуск оптимизированной версии.
    ```bash
    npm run build
    npm run start:prod
    ```
---
Отлично. Третья глава — это «мозг» документации. Здесь мы объясняем архитектурные решения, чтобы разработчик понимал не только *как* писать код, но и *почему* именно так.

Я использовал реальные примеры из нашего кода (`AuthModule`, `TransformInterceptor`, `CreateUserDto`), чтобы всё было наглядно.

Вот текст **Главы 3**.

---
### **Глава 3. Архитектура и Структура**

Проект построен по принципу **Модульного Монолита (Modular Monolith)** с четким разделением ответственности. Мы избегаем "спагетти-кода", изолируя бизнес-логику в модулях, а общую инфраструктуру — в ядре `Common`.

#### 3.1 Структура папок

Ниже приведена структура проекта с пояснением назначения ключевых директорий:

```text
src/
├── common/                     # ЯДРО ПРОЕКТА (Shared Kernel)
│   ├── config/                 # Конфигурация (Multer, Swagger, валидация .env)
│   ├── constants/              # Константы (валидация картинок, ключи метаданных)
│   ├── decorators/             # Кастомные декораторы (@CurrentUser, @Public, @Roles)
│   ├── dto/                    # Общие DTO (PaginationDto, IdParamDto)
│   ├── filters/                # Глобальная обработка ошибок (AllExceptionsFilter)
│   ├── guards/                 # Защита маршрутов (JwtAuth, RolesGuard)
│   ├── interceptors/           # Перехватчики (TransformInterceptor, Logging)
│   ├── pipes/                  # (Опционально) Глобальные пайпы
│   ├── types/                  # Глобальные интерфейсы (JwtPayload, RequestWithUser)
│   └── utils/                  # Утилиты (Hash, URL generator)
│
├── modules/                    # БИЗНЕС-ЛОГИКА
│   ├── auth/                   # Аутентификация (Login, Register, Cookies)
│   ├── users/                  # Управление пользователями (CRUD, Admin)
│   └── prisma/                 # Подключение к БД (Global Module)
│
├── app.module.ts               # Точка сборки приложения
└── main.ts                     # Точка входа (Bootstrap)
```

---

#### 3.2 Модуль `Common` (Ядро)

Это фундамент приложения. Всё, что находится здесь, используется глобально.

**1. Единый формат ответа (`TransformInterceptor`)**
Все успешные ответы API автоматически оборачиваются в стандартную структуру. Вам не нужно писать это вручную в контроллере.

*   **Код в контроллере:**
    ```typescript
    return user; // Просто возвращаем объект
    ```
*   **Ответ клиенту (JSON):**
    ```json
    {
      "success": true,
      "data": {
        "id": "uuid...",
        "email": "admin@example.com"
      },
      "timestamp": "2026-02-03T12:00:00.000Z"
    }
    ```

**2. Единый формат ошибок (`AllExceptionsFilter`)**
Если выбросить любое исключение (например, `throw new NotFoundException('User not found')`), клиент получит:

*   **Ответ клиенту (JSON):**
    ```json
    {
      "statusCode": 404,
      "timestamp": "...",
      "path": "/api/users/123",
      "message": "User not found"
    }
    ```

**3. Валидация файлов (`validation.constant.ts`)**
Мы не дублируем логику проверки картинок. Используется константа `IMAGE_VALIDATION`:
```typescript
// В любом контроллере:
@UploadedFile(IMAGE_VALIDATION) file: Express.Multer.File
```

---

#### 3.3 Принципы разработки

Мы придерживаемся строгих правил, чтобы код оставался чистым и поддерживаемым.

##### 1. Thin Controllers, Fat Services (Тонкие контроллеры, Толстые сервисы)
Контроллер отвечает **только** за прием HTTP-запроса, валидацию и отправку ответа. Вся бизнес-логика (обращение к БД, хеширование, проверки) находится в Сервисе.

*   ❌ **Плохо:** Писать `prisma.user.findMany(...)` внутри контроллера.
*   ✅ **Хорошо:**
    ```typescript
    // users.controller.ts
    @Get()
    findAll(@Query() query: FilterUserDto) {
        return this.usersService.findAll(query);
    }
    ```

##### 2. Explicit DTO (Явные DTO)
Мы никогда не принимаем "сырые" объекты `any`. Все входные данные описываются через классы DTO с валидацией (`class-validator`).

*   **Пример (`create-user.dto.ts`):**
    ```typescript
    export class CreateUserDto {
      @IsEmail()
      email: string; // Автоматически проверит формат email

      @MinLength(6)
      password: string; // Автоматически проверит длину
    }
    ```

##### 3. Strict Typing & Sanitization
Мы не отдаем на фронтенд объект пользователя целиком (с паролем и refresh-токеном).
В `UsersService` и `AuthService` используется метод `sanitizeUser()`, который возвращает чистый объект:
```typescript
private sanitizeUser(user: User) {
  return {
    id: user.id,
    email: user.email, // Пароля здесь нет!
    avatar: getFileUrl(user.avatar, ...), // URL генерируется автоматически
  };
}
```

##### 4. Слабая связность (Loose Coupling)
Модули должны быть максимально независимы.
*   **Пример:** Наш `AuthModule` **не импортирует** `UsersModule`. Он работает с базой данных напрямую через `PrismaService`. Это позволяет легко вынести Auth в отдельный микросервис в будущем.

---

#### 3.4 Жизненный цикл запроса

Понимание того, как запрос проходит через приложение, помогает при отладке.

1.  **Incoming Request** (`POST /api/auth/login`)
2.  ⬇️ **Middleware**:
    *   `Helmet` (Headers security)
    *   `Cors` (Origin check)
    *   `CookieParser` (Parses cookies)
3.  ⬇️ **Global Guard**:
    *   `JwtAuthGuard` (Проверяет токен, если метод не помечен `@Public`)
4.  ⬇️ **Interceptors (Pre-Controller)**:
    *   `LoggingInterceptor` (Засекает время старта)
5.  ⬇️ **Global Pipes**:
    *   `ValidationPipe` (Проверяет DTO, отсекает лишние поля)
6.  ⬇️ **Controller**:
    *   `AuthController.login()`
7.  ⬇️ **Service**:
    *   `AuthService.login()` -> Prisma DB -> Hash Check -> Token Generation
8.  ⬇️ **Interceptors (Post-Controller)**:
    *   `TransformInterceptor` (Оборачивает результат в `{ data: ... }`)
    *   `LoggingInterceptor` (Выводит время выполнения в консоль: `POST ... - 15ms`)
9.  ⬇️ **Response sent to Client**
---
### **Глава 4. Аутентификация и Безопасность**

В этом проекте реализована **Cookie-based аутентификация** с использованием JWT (JSON Web Tokens). Это архитектурное решение выбрано специально для совместимости с **SSR (Server Side Rendering)** в Next.js и повышения безопасности.

#### 4.1 Механизм Cookie-Based Auth

Мы **не храним** токены в `localStorage` на клиенте, так как это уязвимо для XSS-атак (любой вредоносный скрипт может прочитать локальное хранилище).

Вместо этого мы используем **HttpOnly Cookies**:
1.  **HttpOnly:** Куки не видны JS-скриптам в браузере.
2.  **Secure:** В продакшене передаются только по HTTPS.
3.  **SameSite:** Защита от CSRF-атак.

**Пример реализации в `AuthController`:**
Контроллер устанавливает куки автоматически. Фронтенду не нужно ничего сохранять вручную.

```typescript
// src/modules/auth/auth.controller.ts

private setCookies(res: Response, tokens: TokenPair) {
  // Access Token (живет 15 минут)
  res.cookie('access_token', tokens.accessToken, {
    httpOnly: true,
    secure: this.configService.get<boolean>('COOKIE_SECURE'), // true on Prod
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60 * 1000,
  });

  // Refresh Token (живет 7 дней)
  res.cookie('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    path: '/api/auth', // Доступен ТОЛЬКО для эндпоинтов авторизации
    maxAge: 7 * 24 * 3600 * 1000,
  });
}
```

---

#### 4.2 Двойная система токенов (Access + Refresh)

Для баланса между безопасностью и удобством используется пара токенов:

1.  **Access Token:** Короткоживущий токен. Используется для всех запросов к API.
    *   *Стратегия:* `src/modules/auth/strategies/jwt.strategy.ts`
2.  **Refresh Token:** Долгоживущий токен. Используется **только** для получения новой пары токенов, когда Access истек.
    *   *Стратегия:* `src/modules/auth/strategies/jwt-refresh.strategy.ts`

**🔄 Алгоритм обновления (Refresh Flow):**
1.  У пользователя истек Access Token -> API возвращает `401 Unauthorized`.
2.  Клиент (Next.js) делает запрос на `POST /api/auth/refresh`.
3.  Сервер проверяет Refresh Token из куки.
4.  **ВАЖНО:** Сервер сверяет токен с **хешем в базе данных** (`user.refreshToken`).
    > Это "Senior" подход: если Refresh Token украдут, мы можем отозвать его, просто очистив поле в БД (logout). В обычном JWT это невозможно без "черных списков".

---

#### 4.3 Управление доступом (RBAC)

Мы используем декларативный подход для защиты маршрутов с помощью декораторов.

**Как защитить роут?**

1.  **Требование авторизации (Любой пользователь):**
    Используйте `JwtAuthGuard`. В нашем проекте он включен глобально, но если нужно точечно:
    ```typescript
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile() { ... }
    ```

2.  **Требование конкретной роли (Например, ADMIN):**
    Используйте декоратор `@Roles` вместе с `RolesGuard`.

    *Пример из `UsersController`:*
    ```typescript
    import { Roles } from '../../common/decorators/roles.decorator';
    import { Role } from '@prisma/client';

    @Delete(':id')
    @Roles(Role.ADMIN) // <--- Только админ может удалить
    @UseGuards(JwtAuthGuard, RolesGuard)
    remove(@Param('id') id: string) {
      return this.usersService.remove(id);
    }
    ```

3.  **Публичный доступ (Отключить защиту):**
    Если контроллер защищен глобально, используйте `@Public()` для открытия отдельных методов.

    *Пример из `AuthController`:*
    ```typescript
    @Public() // <--- Доступно всем
    @Post('login')
    login(...) { ... }
    ```

---

#### 4.4 Дополнительные меры безопасности

*   **Argon2 Hashing:** Мы используем алгоритм Argon2id для паролей и токенов. Это современный стандарт, устойчивый к GPU-брутфорсу (в отличие от Bcrypt).
    *   *См. файл:* `src/common/utils/hash.util.ts`
*   **Helmet:** Автоматически проставляет заголовки `X-Content-Type-Options`, `X-Frame-Options` и др. в `main.ts`.
*   **CORS:** Настроен на работу только с доверенными доменами (указанными в `.env`), но с поддержкой `credentials: true` для передачи кук.

---
### **Глава 5. Работа с Данными (Prisma ORM)**

В качестве ORM мы используем **Prisma**. Она обеспечивает строгую типизацию запросов к базе данных (Type Safety) и автоматическую генерацию TypeScript-интерфейсов.

#### 5.1 Схема базы данных

Файл схемы находится в `prisma/schema.prisma`. Это единственный источник истины для структуры вашей БД.

**Особенности нашей схемы:**
Мы придерживаемся стандарта SQL для именования таблиц и колонок (`snake_case`), но в коде JavaScript/TypeScript используем привычный `camelCase`. Prisma делает этот маппинг автоматически благодаря декораторам `@map`.

*Пример модели User:*

```prisma
model User {
  id           String  @id @default(uuid())
  email        String  @unique
  password     String
  
  // В коде: fullName, в БД: full_name
  fullName     String  @map("full_name")
  
  // Хранит только имя файла (например, "avatar-123.jpg")
  avatar       String? 
  
  refreshToken String? @map("refresh_token")
  role         Role    @default(USER)

  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users") // Таблица в БД будет называться "users"
}

enum Role {
  USER
  ADMIN
}
```

---

#### 5.2 Миграции (Workflow)

Мы не создаем таблицы вручную через SQL. Все изменения делаются через миграции.

**Алгоритм работы при изменении БД:**

1.  **Измените файл** `prisma/schema.prisma` (например, добавьте поле `phone` в модель `User`).
2.  **Создайте миграцию (в режиме разработки):**
    ```bash
    npx prisma migrate dev --name add_phone_field
    ```
    *Что произойдет:*
    *   Создастся SQL-файл в папке `prisma/migrations`.
    *   Миграция применится к локальной базе.
    *   Обновятся типы `@prisma/client` (node_modules).

3.  **Применение миграций на Продакшене:**
    В CI/CD или на сервере используется другая команда, которая *только* применяет готовые миграции, но не создает новые:
    ```bash
    npx prisma migrate deploy
    ```

---

#### 5.3 Использование в коде (PrismaService)

Для работы с БД используется глобальный модуль `PrismaModule` и сервис `PrismaService`.
Сервис уже настроен на **правильное логирование** подключений и **корректное завершение** соединений (`onModuleDestroy`).

**Как делать запросы (Пример из `UsersService`):**

```typescript
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    // Prisma подсказывает все поля и методы!
    return this.prisma.user.findMany({
      where: {
        role: 'ADMIN', // Автодополнение enum Role
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        // Мы можем выбирать только нужные поля на уровне БД
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
```

---

#### 5.4 Prisma Studio

Проект включает в себя встроенный GUI для управления данными. Это удобно для отладки, чтобы вручную создать первого админа или посмотреть токены.

**Запуск:**
```bash
npx prisma studio
```
Интерфейс откроется по адресу `http://localhost:5555`.

> **Совет:** Если вы хотите сделать пользователя администратором, найдите его в Prisma Studio и измените поле `role` с `USER` на `ADMIN`.
---
### **Глава 6. Работа с Файлами**

В проекте настроена полноценная система для загрузки и раздачи статических файлов (изображений). Мы используем библиотеку `Multer` (стандарт для Node.js), обернутую в "Senior" архитектуру для удобства и безопасности.

#### 6.1 Конфигурация загрузки

Логика того, **куда** и **как** сохранять файлы, инкапсулирована в `src/common/config/multer.config.ts`.

**Основные особенности конфигурации:**
1.  **Disk Storage:** Файлы сохраняются локально в папку, указанную в `.env` (по умолчанию `uploads/`).
2.  **Unique Naming:** Чтобы избежать конфликтов имен (когда два юзера грузят `avatar.jpg`), мы автоматически переименовываем файлы в UUID: `f47ac10b-58cc-4372-a567.jpg`.
3.  **Auto Creation:** Если папка `uploads` не существует, она создается автоматически при старте.

#### 6.2 Валидация (Безопасность)

Мы не пишем валидацию файлов в каждом контроллере вручную. Вместо этого используется готовая константа `IMAGE_VALIDATION`.

*Файл:* `src/common/constants/validation.constant.ts`

Она проверяет:
*   **Тип файла:** Разрешены только изображения (jpg, jpeg, png, webp).
*   **Размер:** Максимум 5 MB (настраивается).

#### 6.3 Пример использования в Контроллере

Чтобы добавить загрузку файла в любой метод, нужно всего 3 шага:

1.  Добавить `@UseInterceptors(FileInterceptor('file'))`.
2.  Описать формат для Swagger (`@ApiConsumes`).
3.  Использовать `@UploadedFile(IMAGE_VALIDATION)` для получения проверенного файла.

```typescript
// users.controller.ts

import { IMAGE_VALIDATION } from '../../common/constants/validation.constant';

@Post('avatar')
@ApiConsumes('multipart/form-data') // 1. Для Swagger
@UseInterceptors(FileInterceptor('file')) // 2. Читаем поле 'file' из формы
async uploadAvatar(
  @UploadedFile(IMAGE_VALIDATION) file: Express.Multer.File // 3. Валидация
) {
  // Если код дошел сюда - файл точно валидный и уже сохранен на диске
  console.log(file.filename); // "uuid-example.jpg"
}
```

#### 6.4 Раздача статики и Генерация ссылок

Файлы, сохраненные в папку `uploads`, автоматически доступны по HTTP благодаря `ServeStaticModule` в `app.module.ts`.

**URL доступа:**
`http://localhost:9000/uploads/<filename>`

**Хелпер `getFileUrl`:**
Мы не храним полный домен в базе данных (только имя файла). Чтобы отдать фронтенду готовую ссылку, используется утилита `src/common/utils/url.util.ts`.

```typescript
// users.service.ts
import { getFileUrl } from '../../common/utils/url.util';

// ... внутри метода
return {
  ...user,
  // Превращает "abc.jpg" в "http://localhost:9000/uploads/abc.jpg"
  avatar: getFileUrl(user.avatar, this.configService), 
};
```
---
### **Глава 7. Cookbook: Создание сложного модуля (Гайд)**

В этой главе мы создадим полноценную систему **Блога** с нуля.
Это продемонстрирует взаимодействие всех систем стартер-кита: Prisma Relations, RBAC (Роли), File Uploads и защиту прав доступа (Ownership).

**Задача:**
1.  **Категории:** Полный CRUD. Управлять ими (создавать, менять, удалять) может **только ADMIN**. Читать — все.
2.  **Посты:** Пользователи могут создавать, **редактировать** и удалять посты.
3.  **Безопасность:** Пользователь может редактировать/удалять только **свои** посты. Админ — любые.
4.  **Файлы:** При обновлении поста можно заменить обложку (старая должна удалиться).

---

#### 7.1 Шаг 1: Схема Базы Данных (Prisma)

Опишем модели и свяжем их.

**1. Измените `prisma/schema.prisma`:**

```prisma
model Category {
  id        String   @id @default(uuid())
  title     String   @unique
  slug      String   @unique // Для URL (например "tech-news")
  
  posts     Post[]   // Связь: Одна категория -> Много постов

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("categories")
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  image     String?  // Имя файла обложки
  published Boolean  @default(false)

  // Связь с Автором
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String   @map("author_id")

  // Связь с Категорией
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String   @map("category_id")

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("posts")
}
```

**2. Создайте миграцию:**
```bash
npx prisma migrate dev --name create_blog_system
```

---

#### 7.2 Шаг 2: Модуль Категорий (Admin CRUD)

Категории — это справочник. Полный контроль у админа.

**1. DTO (`src/modules/categories/dto/`):**

*create-category.dto.ts*
```typescript
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Технологии' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'tech', required: false })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
```

*update-category.dto.ts*
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
```

**2. Контроллер (`src/modules/categories/categories.controller.ts`):**

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Получить все категории' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN) // Create: Admin Only
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Создать категорию' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN) // Update: Admin Only
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Обновить категорию' })
  update(@Param() params: IdParamDto, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(params.id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN) // Delete: Admin Only
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Удалить категорию' })
  remove(@Param() params: IdParamDto) {
    return this.categoriesService.remove(params.id);
  }
}
```

---

#### 7.3 Шаг 3: Модуль Постов (Full CRUD + Files)

Здесь мы реализуем проверку прав ("Это мой пост?") и замену файлов.

**1. DTO (`src/modules/posts/dto/`):**

*create-post.dto.ts*
```typescript
import { IsString, IsNotEmpty, IsUUID, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({ example: 'NestJS Tutorial' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Content here...' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'ID категории', example: 'uuid...' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  // Превращаем строку "true"/"false" из FormData в boolean
  @Transform(({ value }) => value === 'true' || value === true) 
  published?: boolean;
}
```

*update-post.dto.ts*
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
```

**2. Сервис (`src/modules/posts/posts.service.ts`):**

```typescript
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ConfigService } from '@nestjs/config';
import { getFileUrl } from '../../common/utils/url.util';
import { Role, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // --- CREATE ---
  async create(authorId: string, dto: CreatePostDto, file?: Express.Multer.File) {
    // Проверка существования категории
    const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException('Категория не найдена');

    const post = await this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        published: dto.published ?? false,
        image: file ? file.filename : null,
        author: { connect: { id: authorId } },
        category: { connect: { id: dto.categoryId } },
      },
      include: { category: true, author: { select: { fullName: true } } },
    });

    return this.mapPost(post);
  }

  // --- UPDATE (Важно: проверка прав и удаление старой картинки) ---
  async update(id: string, userId: string, role: Role, dto: UpdatePostDto, file?: Express.Multer.File) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Пост не найден');

    // 1. Проверка прав (Автор или Админ)
    if (post.authorId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('Нет прав на редактирование этого поста');
    }

    // 2. Подготовка данных
    const data: Prisma.PostUpdateInput = {};
    if (dto.title) data.title = dto.title;
    if (dto.content) data.content = dto.content;
    if (dto.published !== undefined) data.published = dto.published;
    if (dto.categoryId) data.category = { connect: { id: dto.categoryId } };

    // 3. Обработка файла
    if (file) {
      this.deleteFileFromDisk(post.image); // Удаляем старую обложку
      data.image = file.filename;          // Записываем новую
    }

    const updated = await this.prisma.post.update({
      where: { id },
      data,
      include: { category: true, author: { select: { fullName: true } } },
    });

    return this.mapPost(updated);
  }

  // --- DELETE ---
  async remove(id: string, userId: string, role: Role) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Пост не найден');

    if (post.authorId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('Нет прав на удаление этого поста');
    }

    this.deleteFileFromDisk(post.image); // Чистим диск

    return this.prisma.post.delete({ where: { id } });
  }

  // --- FIND ALL ---
  async findAll() {
    const posts = await this.prisma.post.findMany({
      include: { category: true, author: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return posts.map(p => this.mapPost(p));
  }

  // --- HELPERS ---
  private mapPost(post: any) {
    return {
      ...post,
      image: getFileUrl(post.image, this.configService),
    };
  }

  private deleteFileFromDisk(filename: string | null) {
    if (!filename) return;
    const pathToFile = path.join(process.cwd(), this.configService.get('UPLOAD_DIR') || 'uploads', filename);
    if (fs.existsSync(pathToFile)) fs.unlinkSync(pathToFile);
  }
}
```

**3. Контроллер (`src/modules/posts/posts.controller.ts`):**

```typescript
import { 
  Controller, Get, Post, Body, Patch, Delete, Param, 
  UseGuards, UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiCookieAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IMAGE_VALIDATION } from '../../common/constants/validation.constant';
import { IdParamDto } from '../../common/dto/id-param.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все посты' })
  findAll() {
    return this.postsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Создать пост' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        categoryId: { type: 'string', format: 'uuid' },
        published: { type: 'boolean' },
        file: { type: 'string', format: 'binary' },
      }
    } 
  })
  create(
    @Body() dto: CreatePostDto,
    @CurrentUser('userId') userId: string,
    @UploadedFile(IMAGE_VALIDATION) file: Express.Multer.File
  ) {
    return this.postsService.create(userId, dto, file);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Обновить пост (только автор или админ)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        categoryId: { type: 'string', format: 'uuid' },
        published: { type: 'boolean' },
        file: { type: 'string', format: 'binary' },
      }
    } 
  })
  update(
    @Param() params: IdParamDto,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: any,
    @UploadedFile(IMAGE_VALIDATION) file: Express.Multer.File
  ) {
    return this.postsService.update(params.id, user.userId, user.role, dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Удалить пост' })
  remove(@Param() params: IdParamDto, @CurrentUser() user: any) {
    return this.postsService.remove(params.id, user.userId, user.role);
  }
}
```

---

#### 7.4 Итоги

В этой главе мы реализовали полноценную CRUD-логику со связями:
1.  **Create:** Связываем пост с автором (из токена) и категорией. Сохраняем файл.
2.  **Read:** Получаем посты с вложенными (include) данными автора и категории.
3.  **Update:** Проверяем права ("Мой ли это пост?"), обновляем поля и, если загружена новая картинка, удаляем старую.
4.  **Delete:** Удаляем запись из БД и файл с диска.

Этот модуль — эталон для создания любых сущностей в вашем проекте (Товары, Комментарии, Заказы).

---
### **Глава 8. Инструменты качества (Quality Assurance)**

Senior Starter Kit включает настроенный набор инструментов для поддержания чистоты кода и автоматизации рутины. Мы следуем философии: *"Не заставляй думать человека о том, что может проверить машина"*.

#### 8.1 Линтинг и Форматирование

Мы используем стандартную связку **ESLint** + **Prettier**.

*   **ESLint:** Отвечает за поиск логических ошибок и неиспользуемых переменных.
*   **Prettier:** Отвечает за визуальный стиль (отступы, запятые, кавычки).

**Команды:**

1.  **Проверить код (без исправления):**
    ```bash
    npm run lint
    ```

2.  **Отформатировать весь проект:**
    ```bash
    npm run format
    ```

**Конфигурация:**
Настройки находятся в файлах `.eslintrc.js` (или `eslint.config.mjs`) и `.prettierrc`.
> **Совет:** Настройте вашу IDE (VS Code / WebStorm) на автоматический запуск Prettier при сохранении файла ("Format on Save").

---

#### 8.2 Swagger Документация (OpenAPI)

Проект автоматически генерирует интерактивную документацию API.
Конфигурация вынесена в `src/common/config/swagger.config.ts`.

**Доступ:**
При запущенном сервере: `http://localhost:9000/api/docs`

**Как документировать новый модуль:**

1.  **DTO:** Используйте декораторы `@ApiProperty`.
    ```typescript
    export class CreatePostDto {
      @ApiProperty({ 
        example: 'Как выучить NestJS', 
        description: 'Заголовок статьи' 
      })
      @IsString()
      title: string;
    }
    ```

2.  **Контроллер:** Используйте `@ApiTags`, `@ApiOperation` и `@ApiResponse`.
    ```typescript
    @ApiTags('Posts') // Группировка в Swagger UI
    @Controller('posts')
    export class PostsController {
    
      @ApiOperation({ summary: 'Создать новую статью' })
      @ApiResponse({ status: 201, description: 'Статья успешно создана' })
      @Post()
      create(...) { ... }
    }
    ```

3.  **Загрузка файлов:**
    Для эндпоинтов с файлами обязательно указывайте `@ApiConsumes`:
    ```typescript
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: { type: 'string', format: 'binary' },
        },
      },
    })
    ```

---

#### 8.3 Git Hooks (Husky & Commitlint)

Чтобы "грязный" или нерабочий код не попадал в репозиторий, мы используем **Husky**. Это инструмент, который запускает скрипты перед тем, как вы сделаете коммит (`pre-commit`).

**Как это работает:**
Когда вы пишете `git commit -m "feat: new module"`, автоматически запускается команда `npm run lint`. Если линтер находит ошибки — коммит отменяется.

**Настройка (один раз при старте):**

Если вы клонировали репозиторий, инициализируйте Husky:
```bash
npm run prepare
```

**Создание хука (пример):**
Мы настроим запуск `lint-staged` (проверяет только измененные файлы, чтобы не ждать проверки всего проекта).

1.  Установите зависимости (если еще нет):
    ```bash
    npm install --save-dev husky lint-staged
    ```

2.  Добавьте в `package.json`:
    ```json
    "lint-staged": {
      "*.ts": [
        "npm run format",
        "npm run lint"
      ]
    }
    ```

3.  Добавьте хук:
    ```bash
    npx husky add .husky/pre-commit "npx lint-staged"
    ```

Теперь ваш код всегда будет идеальным перед отправкой на GitHub.

---

#### 8.4 Тестирование

NestJS предоставляет мощную среду для тестирования на базе **Jest**.

1.  **Unit Tests (Юнит-тесты):**
    Лежат рядом с файлами (например, `users.service.spec.ts`). Проверяют логику в изоляции.
    ```bash
    npm run test
    ```

2.  **E2E Tests (Сквозные тесты):**
    Лежат в папке `test/`. Поднимают всё приложение и делают реальные HTTP-запросы.
    ```bash
    npm run test:e2e
    ```

> **Senior Tip:** При написании критического функционала (например, подсчет денег или прав доступа) всегда пишите хотя бы один E2E тест.
