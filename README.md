# 🚀 Neatify Frontend

Современное веб-приложение для управления проектамии персональной эффективностью.'

## ✨ Возможности

- **Vue 3 + Composition API** - современная разработка
- **TypeScript** - полная типизация для безопасности
- **Двойная авторизация** - Email и Telegram
- **Адаптивный дизайн** - работает на всех устройствах
- **Pinia** - управление состоянием
- **Vue Router** - навигация
- **SCSS модули** - современная стилизация

## 🚀 Быстрый старт

### Предварительные требования

- **Node.js** 16+
- **npm** или **yarn**

### Установка

1. **Клонируйте репозиторий**

   ```bash
   git clone <repository-url>
   cd neatify
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

## 📚 Документация

- [Neatify Backend API](https://gitverse.ru/romanov_vue/Neatify-backend) - документация серверной части
