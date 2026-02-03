# 🚀 Telegram Login Widget - Интеграция с Neatify Frontend

## 📋 Содержание

- [Обзор](#-обзор)
- [Возможности](#-возможности)
- [Установка и настройка](#-установка-и-настройка)
- [Использование](#-использование)
- [Структура компонентов](#-структура-компонентов)
- [Настройка бота](#-настройка-бота)
- [API интеграция](#-api-интеграция)
- [Примеры](#-примеры)

## 🎯 Обзор

**Telegram Login Widget** - это готовый Vue 3 компонент для интеграции авторизации через Telegram в ваш Neatify фронтенд проект.

### ✨ Возможности

- ✅ **Vue 3 Composition API** - современный подход к разработке
- ✅ **TypeScript поддержка** - полная типизация для безопасности
- ✅ **Автоматическая загрузка** скрипта Telegram
- ✅ **Обработка ошибок** - graceful error handling
- ✅ **Адаптивный дизайн** - работает на всех устройствах
- ✅ **Настраиваемые размеры** - small, medium, large
- ✅ **Проверка конфигурации** - валидация настроек бота

## 🚀 Установка и настройка

### 1. Создание Telegram бота

1. **Перейдите к @BotFather в Telegram**
2. **Отправьте команду** `/newbot`
3. **Выберите имя** для вашего бота
4. **Скопируйте username** бота (без @)

### 2. Настройка конфигурации

Откройте файл `src/config/telegram.config.ts`:

```typescript
// Замените 'YourBotUsername' на реальное имя вашего бота
export const TELEGRAM_BOT_USERNAME: string = 'your_bot_username';
```

**Пример правильной настройки:**

```typescript
export const TELEGRAM_BOT_USERNAME: string = 'neatify_auth_bot';
```

### 3. Настройка домена для авторизации

В @BotFather настройте домен для вашего бота:

1. Отправьте команду `/setdomain`
2. Укажите ваш домен: `@BotFather setdomain yourdomain.com`

## 💻 Использование

### Базовое использование

```vue
<template>
  <div>
    <TelegramLoginWidget
      :bot-username="TELEGRAM_BOT_USERNAME"
      size="large"
      :request-access="true"
      @auth="handleTelegramAuth"
      @error="handleTelegramError"
    />
  </div>
</template>

<script setup lang="ts">
import { TelegramLoginWidget } from '@/components/ui/telegram-login';
import { TELEGRAM_BOT_USERNAME } from '@/config/telegram.config';

const handleTelegramAuth = (user) => {
  console.log('Пользователь авторизован:', user);
  // Отправляем данные на сервер
};

const handleTelegramError = (error) => {
  console.error('Ошибка авторизации:', error);
};
</script>
```

### В форме регистрации

Компонент уже интегрирован в форму регистрации `src/views/Auth/SignUp.vue`:

```vue
<!-- Переключатель между режимами авторизации -->
<div class="auth-mode-toggle">
  <button @click="showTelegramAuth = false">Email регистрация</button>
  <button @click="showTelegramAuth = true">Telegram вход</button>
</div>

<!-- Telegram авторизация -->
<TelegramLoginWidget
  :bot-username="TELEGRAM_BOT_USERNAME"
  size="large"
  :request-access="true"
  @auth="handleTelegramAuth"
  @error="handleTelegramError"
/>
```

## 🏗️ Структура компонентов

```
src/
├── components/ui/telegram-login/
│   ├── TelegramLoginWidget.vue    # UI компонент (глупый)
│   └── index.ts                   # Экспорт компонента
├── hooks/auth/
│   └── useTelegramAuth.ts         # Бизнес-логика (умный composable)
├── config/
│   └── telegram.config.ts         # Конфигурация бота
├── stores/
│   └── auth.store.ts              # Глобальное состояние
└── types/
    └── telegram.types.ts          # TypeScript типы
```

### Архитектура: Разделение ответственности

#### 🎯 UI Компонент (`TelegramLoginWidget.vue`)

**"Глупый" компонент** - отвечает только за отображение:

```typescript
interface Props {
  size?: 'large' | 'medium' | 'small'; // Размер виджета
}

// Использует composable для всей логики
const telegramAuth = useTelegramAuth();
```

#### 🧠 Бизнес-логика (`useTelegramAuth.ts`)

**"Умный" composable** - содержит всю логику:

```typescript
export function useTelegramAuth() {
  // Состояние
  const isScriptLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Методы
  const initializeWidget = async (container: HTMLElement) => {
    /* ... */
  };
  const handleTelegramResponse = async (user: TelegramUser | false) => {
    /* ... */
  };

  return {
    // Состояние
    isScriptLoaded,
    isLoading,
    error,
    telegramUser,

    // Методы
    initializeWidget,
    checkConfiguration,
    getConfigurationError,
  };
}
```

### Типы данных

**`TelegramUser`** - интерфейс данных пользователя:

```typescript
interface TelegramUser {
  id: number; // Уникальный ID пользователя
  first_name: string; // Имя пользователя
  last_name?: string; // Фамилия (опционально)
  username?: string; // @username (опционально)
  photo_url?: string; // Ссылка на аватар
  auth_date: number; // Дата авторизации (Unix timestamp)
  hash: string; // Хеш для верификации
}
```

## 🔧 Настройка бота

### Шаг 1: Создание бота

1. Напишите в Telegram боту **@BotFather**
2. Отправьте команду: `/newbot`
3. Введите имя бота (отображается в чатах)
4. Введите username бота (заканчивается на \_bot)

### Шаг 2: Получение токена

После создания бота вы получите токен в формате:

```
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

**⚠️ Важно:** Сохраните токен в безопасном месте!

### Шаг 3: Настройка домена

Для работы Login Widget нужно указать домен:

1. В @BotFather отправьте: `/setdomain`
2. Укажите ваш домен: `yourdomain.com`

**Поддерживаемые домены:**

- `https://yourdomain.com`
- `https://www.yourdomain.com`
- Для localhost разработки: используйте ngrok или аналогичный сервис

## 🌐 API интеграция

### Отправка данных на сервер

После успешной авторизации данные отправляются на ваш Neatify API:

```typescript
const handleTelegramAuth = async (user: TelegramUser) => {
  try {
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

    if (response.ok) {
      const result = await response.json();
      console.log('Пользователь создан:', result.user);
    }
  } catch (error) {
    console.error('Ошибка создания пользователя:', error);
  }
};
```

### Обработка ошибок

```typescript
const handleTelegramError = (error: string) => {
  // Показываем уведомление пользователю
  showNotification({
    type: 'error',
    message: 'Ошибка авторизации через Telegram: ' + error,
  });
};
```

## 📱 Адаптивность и стилизация

### Поддерживаемые размеры

```vue
<TelegramLoginWidget
  :bot-username="'my_bot'"
  size="small"    <!-- Маленький размер -->
  size="medium"   <!-- Средний размер -->
  size="large"    <!-- Большой размер (по умолчанию) -->
/>
```

### Кастомные стили

Компонент использует scoped стили с CSS переменными:

```scss
.telegram-login-widget {
  // Кастомные стили
}

.telegram-login-placeholder {
  // Стили для загрузочного состояния
}

.telegram-config-error {
  // Стили для ошибок конфигурации
}
```

## 🔒 Безопасность

### Валидация данных

Компонент автоматически валидирует данные пользователя:

- **Проверка подписи** - верификация хеша от Telegram
- **Валидация полей** - проверка обязательных полей
- **Обработка ошибок** - graceful error handling

### Защита от CSRF

```typescript
// Сервер должен валидировать хеш
const isValidTelegramData = (userData: TelegramUser): boolean => {
  // Валидация хеша и времени авторизации
  const authDate = userData.auth_date;
  const now = Math.floor(Date.now() / 1000);

  // Проверяем, что авторизация не старше 24 часов
  return now - authDate < 86400;
};
```

## 🛠️ Разработка

### Локальная разработка

Для тестирования на localhost используйте:

1. **ngrok** для проброса порта:

   ```bash
   ngrok http 3000
   ```

2. **Настройте домен** в @BotFather:
   ```
   /setdomain your-ngrok-domain.ngrok.io
   ```

### Дебаг авторизации

```typescript
const handleTelegramAuth = (user: TelegramUser) => {
  console.log('Полные данные пользователя:', {
    id: user.id,
    first_name: user.first_name,
    username: user.username,
    auth_date: new Date(user.auth_date * 1000),
    hash: user.hash,
  });
};
```

## 📋 Чек-лист настройки

- [ ] ✅ Создан Telegram бот через @BotFather
- [ ] ✅ Скопирован username бота в конфигурацию
- [ ] ✅ Настроен домен в @BotFather
- [ ] ✅ Протестирована авторизация
- [ ] ✅ Настроена обработка ошибок
- [ ] ✅ Добавлена валидация данных

## 🚨 Возможные проблемы

### Бот не отвечает

**Проблема:** Кнопка авторизации не реагирует на клик

**Решения:**

1. Проверьте правильность имени бота в конфигурации
2. Убедитесь, что бот не заблокирован
3. Проверьте настройки домена в @BotFather

### Ошибка конфигурации

**Проблема:** Показывается сообщение "Telegram бот не настроен"

**Решения:**

1. Проверьте файл `src/config/telegram.config.ts`
2. Убедитесь, что имя бота указано правильно
3. Перезапустите сервер разработки

### Проблемы с доменом

**Проблема:** Авторизация работает локально, но не на продакшене

**Решения:**

1. Настройте домен в @BotFather: `/setdomain yourdomain.com`
2. Убедитесь, что используете HTTPS
3. Проверьте настройки CORS

## 📞 Полезные ресурсы

- [Документация Telegram Login Widget](https://core.telegram.org/widgets/login)
- [Создание ботов в Telegram](https://core.telegram.org/bots)
- [Vue 3 Composition API](https://vuejs.org/guide/typescript/composition-api.html)
