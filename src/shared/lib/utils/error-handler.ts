import type { NotificationComponent } from '@/shared/types/notification';
import { AxiosError } from 'axios';

type ErrorHandlerOptions = {
  silent?: boolean;
  context?: string;
  retry?: boolean;
  maxRetries?: number;
};

type HttpStatusHandler = {
  status: number;
  message: string;
  shouldRetry?: boolean;
  retryDelay?: number;
};

/**
 * Обработчики для конкретных HTTP статусов
 */
const HTTP_STATUS_HANDLERS: Record<number, HttpStatusHandler> = {
  400: {
    status: 400,
    message: 'Неверный запрос. Проверьте введенные данные.',
    shouldRetry: false,
  },
  401: {
    status: 401,
    message: 'Необходима авторизация. Пожалуйста, войдите в систему.',
    shouldRetry: false,
  },
  403: {
    status: 403,
    message: 'Доступ запрещен. У вас нет прав для выполнения этого действия.',
    shouldRetry: false,
  },
  404: {
    status: 404,
    message: 'Запрашиваемый ресурс не найден.',
    shouldRetry: false,
  },
  408: {
    status: 408,
    message: 'Время ожидания запроса истекло. Попробуйте еще раз.',
    shouldRetry: true,
    retryDelay: 2000,
  },
  429: {
    status: 429,
    message: 'Слишком много запросов. Попробуйте через некоторое время.',
    shouldRetry: true,
    retryDelay: 5000,
  },
  500: {
    status: 500,
    message: 'Внутренняя ошибка сервера. Попробуйте позже.',
    shouldRetry: true,
    retryDelay: 3000,
  },
  502: {
    status: 502,
    message: 'Сервер временно недоступен. Попробуйте позже.',
    shouldRetry: true,
    retryDelay: 5000,
  },
  503: {
    status: 503,
    message: 'Сервис временно недоступен. Попробуйте позже.',
    shouldRetry: true,
    retryDelay: 3000,
  },
  504: {
    status: 504,
    message: 'Время ожидания ответа сервера истекло. Попробуйте позже.',
    shouldRetry: true,
    retryDelay: 3000,
  },
};

/**
 * Обработка сетевых ошибок
 */
const NETWORK_ERROR_HANDLERS: Record<string, HttpStatusHandler> = {
  NetworkError: {
    status: 0,
    message: 'Ошибка сети. Проверьте подключение к интернету.',
    shouldRetry: true,
    retryDelay: 2000,
  },
  TimeoutError: {
    status: 0,
    message: 'Превышено время ожидания. Попробуйте еще раз.',
    shouldRetry: true,
    retryDelay: 2000,
  },
};

/**
 * Логирование ошибок в зависимости от окружения
 */
function logError(error: unknown, context: string, status?: number): void {
  const isDevelopment = import.meta.env.DEV;

  if (isDevelopment) {
    console.group(`🚨 API Error ${status ? `[${status}]` : ''} - ${context}`);
    console.error('Error details:', error);
    console.groupEnd();
  } else {
    // В продакшене отправляем ошибки в сервис мониторинга
    console.error(`API Error [${status || 'unknown'}]:`, {
      context,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Показ уведомления пользователю
 */
function showUserNotification(message: string, type: 'error' | 'success' = 'error'): void {
  if (import.meta.env.DEV) {
    console[type === 'error' ? 'error' : 'log'](`Notification: ${message}`);
  }
  showNotification(message, type);
}

/**
 * Обработка конкретных HTTP статусов
 */
function handleHttpStatusError(
  status: number,
  error: AxiosError
): { message: string; shouldRetry: boolean; retryDelay?: number } {
  const handler = HTTP_STATUS_HANDLERS[status];

  if (handler) {
    return {
      message: handler.message,
      shouldRetry: handler.shouldRetry || false,
      retryDelay: handler.retryDelay,
    };
  }

  // Обработка неизвестных статусов
  const serverMessage =
    error.response?.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
      ? (error.response.data as { message: string }).message
      : error.message;
  return {
    message: `Ошибка сервера (${status}): ${serverMessage}`,
    shouldRetry: false,
  };
}

/**
 * Обработка сетевых ошибок
 */
function handleNetworkError(error: AxiosError): {
  message: string;
  shouldRetry: boolean;
  retryDelay?: number;
} {
  const code = error.code || 'Unknown';
  const handler = NETWORK_ERROR_HANDLERS[code];

  if (handler) {
    return {
      message: handler.message,
      shouldRetry: handler.shouldRetry || false,
      retryDelay: handler.retryDelay,
    };
  }

  return {
    message: 'Ошибка сети. Проверьте подключение к интернету.',
    shouldRetry: true,
    retryDelay: 2000,
  };
}

/**
 * Основная функция обработки ошибок API
 */
export function handleApiError(error: unknown, options: ErrorHandlerOptions = {}): void {
  const { silent = false, context = '', retry = false, maxRetries = 3 } = options;

  // Логируем ошибку
  if (!silent) {
    logError(error, context);
  }

  if (silent) return;

  let message = 'Произошла неожиданная ошибка';
  let shouldRetry = false;
  let retryDelay = 2000;

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const isNetworkError = !status && error.code;

    if (isNetworkError) {
      // Обработка сетевых ошибок
      const networkResult = handleNetworkError(error);
      message = networkResult.message;
      shouldRetry = networkResult.shouldRetry;
      retryDelay = networkResult.retryDelay || 2000;
    } else if (status) {
      // Обработка HTTP ошибок
      const statusResult = handleHttpStatusError(status, error);
      message = statusResult.message;
      shouldRetry = statusResult.shouldRetry;
      retryDelay = statusResult.retryDelay || 2000;
    } else {
      // Обработка других Axios ошибок
      message = `Ошибка запроса: ${error.message}`;
    }
  } else if (error instanceof AxiosError && error.response?.data) {
    // Безопасное получение сообщения из ответа сервера
    const serverMessage = (error.response.data as { message?: string })?.message;
    message = `Ошибка сервера: ${serverMessage || error.message}`;
  } else if (error instanceof Error) {
    message = `${context}: ${error.message}`;
  }

  // Добавляем контекст к сообщению
  if (context) {
    message = `${context}: ${message}`;
  }

  showUserNotification(message, 'error');

  // Автоматический retry для некоторых ошибок
  if (retry && shouldRetry && maxRetries > 0) {
    setTimeout(() => {
      showUserNotification(`Повторная попытка... (${maxRetries} осталось)`, 'error');
      // Здесь можно вызвать callback для повторного запроса
    }, retryDelay);
  }
}

let notificationComponent: NotificationComponent | null;

export function registerNotificationComponent(component: NotificationComponent) {
  notificationComponent = component;
}

export function showNotification(message: string, type: 'error' | 'success' = 'error') {
  if (notificationComponent) {
    notificationComponent.show(message, type);
  } else {
    console.warn('Notification component is not registered');
    console[type === 'error' ? 'error' : 'log'](message);
  }
}

export const handleErrorResponse = (error: AxiosError) => {
  const status = error.response?.status;
  const url = error.config?.url;

  switch (status) {
    case 403:
      console.error('Access forbidden:', error.response?.data);
      break;
    case 404:
      console.error(`Resource not found: ${url}`);
      break;
    case 500:
      console.error('Server error:', error.response?.data);
      break;
    default:
      console.error(`HTTP Error ${status}:`, error.response?.data);
  }
};
