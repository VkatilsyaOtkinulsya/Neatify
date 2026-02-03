# 🚀 Neatify Frontend - Vue 3 + TypeScript + Telegram Integration

Современное веб-приложение для управления задачами с интеграцией Telegram авторизации.

## ✨ Возможности

- ✅ **Vue 3 + Composition API** - современная разработка
- ✅ **TypeScript** - полная типизация для безопасности
- ✅ **Telegram Login Widget** - быстрая авторизация через Telegram
- ✅ **Двойная авторизация** - Email и Telegram
- ✅ **Адаптивный дизайн** - работает на всех устройствах
- ✅ **Pinia** - управление состоянием
- ✅ **Vue Router** - навигация
- ✅ **SCSS модули** - современная стилизация

## 🚀 Быстрый старт

### Предварительные требования

- **Node.js** 16+
- **npm** или **yarn**
- **Telegram бот** (для полной функциональности)

### Установка

1. **Клонируйте репозиторий**

   ```bash
   git clone <repository-url>
   cd kanban-desk
   ```

2. **Установите зависимости**

   ```bash
   npm install
   ```

3. **Настройте переменные окружения**

   ```bash
   cp .env.example .env
   ```

4. **Запустите сервер разработки**

   ```bash
   npm run dev
   ```

5. **Откройте в браузере**
   ```
   http://localhost:5173
   ```

## 🔧 Настройка Telegram авторизации

### 1. Создание Telegram бота

1. Напишите боту **@BotFather** в Telegram
2. Отправьте команду: `/newbot`
3. Выберите имя бота и username
4. Сохраните токен бота

### 2. Конфигурация фронтенда

Откройте файл `src/config/telegram.config.ts`:

```typescript
// Замените на имя вашего бота
export const TELEGRAM_BOT_USERNAME: string = 'your_bot_username';
```

### 3. Настройка домена

В @BotFather настройте домен:

```
/setdomain yourdomain.com
```

## 📱 Использование

### Регистрация пользователей

Приложение поддерживает два способа регистрации:

#### Email регистрация

- Традиционная форма с email и паролем
- Подходит для корпоративных пользователей

#### Telegram авторизация

- Быстрая авторизация через Telegram
- Автоматическая регистрация в системе
- Минимальные данные для входа

### Переключение режимов

В форме регистрации доступен переключатель:

```vue
<!-- Переключатель режимов -->
<div class="auth-mode-toggle">
  <button @click="showTelegramAuth = false">Email регистрация</button>
  <button @click="showTelegramAuth = true">Telegram вход</button>
</div>
```

## 🏗️ Структура проекта

```
src/
├── components/
│   ├── ui/                    # Базовые UI компоненты
│   │   ├── telegram-login/    # Компонент Telegram авторизации (UI)
│   │   │   ├── TelegramLoginWidget.vue  # Глупый компонент
│   │   │   └── index.ts
│   │   ├── button/
│   │   ├── input/
│   │   └── ...
│   └── Profile/
│       └── Profile.vue
│
├── config/
│   └── telegram.config.ts     # Конфигурация Telegram бота
│
├── hooks/
│   ├── auth/                  # Хуки для аутентификации
│   │   └── useTelegramAuth.ts # Бизнес-логика Telegram (умный composable)
│   └── space/                 # Хуки для рабочих пространств
│
├── services/
│   └── auth.service.ts        # Сервисы аутентификации
│
├── stores/
│   └── auth.store.ts          # Глобальное состояние аутентификации
│
├── types/
│   ├── auth.types.ts          # Типы аутентификации
│   ├── telegram.types.ts      # Типы Telegram
│   └── ...
│
├── views/
│   ├── Auth/
│   │   ├── SignIn.vue         # Форма входа
│   │   └── SignUp.vue         # Форма регистрации с Telegram
│   ├── Main/
│   └── Spaces/
│
└── App.vue                    # Корневой компонент
```

## 🔗 Интеграция с Neatify API

Проект предназначен для работы с **Neatify Backend API**:

### API endpoints

- `POST /api/telegram-users` - Создание пользователя через Telegram
- `GET /api/telegram-users/{id}` - Получение данных пользователя
- `PUT /api/telegram-users/{id}` - Обновление пользователя
- `DELETE /api/telegram-users/{id}` - Удаление пользователя

### Отправка данных

```typescript
// Пример отправки данных Telegram пользователя
const response = await fetch('/api/telegram-users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    telegramId: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
  }),
});
```

## 🎨 Кастомизация

### Стилизация Telegram виджета

Компонент использует scoped стили для легкой кастомизации:

```scss
.telegram-login-widget {
  // Кастомные стили виджета
}

.auth-mode-toggle {
  // Стили переключателя режимов
}

.telegram-config-error {
  // Стили ошибок конфигурации
}
```

### Адаптивность

Компонент полностью адаптивен и работает на:

- 📱 Мобильные устройства
- 💻 Планшеты
- 🖥️ Десктопные компьютеры

## 🔒 Безопасность

### Валидация данных

- **Проверка хеша** от Telegram
- **Валидация времени** авторизации
- **Санитизация** входных данных

### Защита от атак

- **CORS** настройки
- **CSRF** защита
- **Безопасное хранение** токенов

## 🛠️ Разработка

### Скрипты npm

```json
{
  "scripts": {
    "build": "vue-tsc && vite build",
    "dev": "vite",
    "preview": "vite preview"
  }
}
```

### Локальная разработка с Telegram

Для тестирования авторизации на localhost:

1. **Установите ngrok**:

   ```bash
   npm install -g ngrok
   ```

2. **Запустите ngrok**:

   ```bash
   ngrok http 5173
   ```

3. **Настройте домен** в @BotFather:
   ```
   /setdomain your-ngrok-domain.ngrok.io
   ```

## 📋 Чек-лист настройки

### Обязательные шаги

- [ ] ✅ Установлены зависимости
- [ ] ✅ Создан Telegram бот через @BotFather
- [ ] ✅ Настроена конфигурация в `telegram.config.ts`
- [ ] ✅ Указан домен в настройках бота
- [ ] ✅ Протестирована авторизация

### Опциональные улучшения

- [ ] 📱 Настроена PWA поддержка
- [ ] 🎨 Кастомизированы стили
- [ ] 📊 Добавлен аналитика
- [ ] 🔄 Настроен CI/CD

## 🚨 Возможные проблемы

### Проблемы с авторизацией

**Симптом:** Кнопка Telegram не реагирует

**Решения:**

1. Проверьте правильность имени бота в конфигурации
2. Убедитесь, что домен настроен в @BotFather
3. Проверьте консоль браузера на ошибки

### Ошибки конфигурации

**Симптом:** Показывается ошибка "Telegram бот не настроен"

**Решения:**

1. Проверьте файл `src/config/telegram.config.ts`
2. Убедитесь, что имя бота указано правильно
3. Перезапустите сервер разработки

## 📚 Документация

### Полезные ресурсы

- [Документация Telegram Login Widget](https://core.telegram.org/widgets/login)
- [Vue 3 документация](https://vuejs.org/)
- [TypeScript руководство](https://typescriptlang.org/)
- [Pinia документация](https://pinia.vuejs.org/)

### Дополнительные материалы

- [TELEGRAM_LOGIN_README.md](./TELEGRAM_LOGIN_README.md) - подробная документация по Telegram интеграции
- [Neatify Backend API](https://github.com/neatify/backend) - документация серверной части
