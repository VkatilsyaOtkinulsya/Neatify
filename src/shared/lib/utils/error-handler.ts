import type { NotificationComponent } from '@/shared/types/notification';
import { AxiosError } from 'axios';

type ErrorHandlerOptions = {
  silent?: boolean;
  context?: string;
  retry?: boolean;
  retryCallback?: () => void;
  maxRetries?: number;
};

type ErrorConfig = {
  message: string;
  shouldRetry?: boolean;
  retryDelay?: number;
};

const HTTP_STATUS_CONFIGS: Record<number, ErrorConfig> = {
  400: {
    message: 'Неверный запрос. Проверьте введенные данные.',
    shouldRetry: false,
  },
  401: {
    message: 'Необходима авторизация. Пожалуйста, войдите в систему.',
    shouldRetry: false,
  },
  403: {
    message: 'Доступ запрещен. У вас нет прав для выполнения этого действия.',
    shouldRetry: false,
  },
  404: {
    message: 'Запрашиваемый ресурс не найден.',
    shouldRetry: false,
  },
  408: {
    message: 'Время ожидания запроса истекло. Попробуйте еще раз.',
    shouldRetry: true,
    retryDelay: 2000,
  },
  429: {
    message: 'Слишком много запросов. Попробуйте через некоторое время.',
    shouldRetry: true,
    retryDelay: 5000,
  },
  500: {
    message: 'Внутренняя ошибка сервера. Попробуйте позже.',
    shouldRetry: true,
    retryDelay: 3000,
  },
  502: {
    message: 'Сервер временно недоступен. Попробуйте позже.',
    shouldRetry: true,
    retryDelay: 5000,
  },
  503: {
    message: 'Сервис временно недоступен. Попробуйте позже.',
    shouldRetry: true,
    retryDelay: 3000,
  },
  504: {
    message: 'Время ожидания ответа сервера истекло. Попробуйте позже.',
    shouldRetry: true,
    retryDelay: 3000,
  },
};

const NETWORK_ERROR_CONFIGS: Record<string, ErrorConfig> = {
  NetworkError: {
    message: 'Ошибка сети. Проверьте подключение к интернету.',
    shouldRetry: true,
    retryDelay: 2000,
  },
  TimeoutError: {
    message: 'Превышено время ожидания. Попробуйте еще раз.',
    shouldRetry: true,
    retryDelay: 2000,
  },
};

function logError(error: unknown, context: string, status?: number): void {
  const isDevelopment = import.meta.env.DEV;
  const statusStr = status ? `[${status}]` : '';
  const contextStr = context ? `- ${context}` : '';

  if (isDevelopment) {
    console.group(`🚨 API Error ${statusStr} ${contextStr}`);
    console.error('Error details:', error);
    console.groupEnd();
  } else {
    console.error(`API Error [${status || 'unknown'}]:`, {
      context,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}

function showUserNotification(message: string, type: 'error' | 'success' = 'error'): void {
  if (import.meta.env.DEV) {
    console[type === 'error' ? 'error' : 'log'](`Notification: ${message}`);
  }
  showNotification(message, type);
}

function getServerMessage(error: AxiosError): string {
  const data = error.response?.data;
  if (data && typeof data === 'object' && 'message' in data) {
    return (data as { message: string }).message;
  }
  return error.message;
}

function handleHttpStatusError(status: number, error: AxiosError): ErrorConfig {
  const config = HTTP_STATUS_CONFIGS[status];

  if (config) {
    return config;
  }

  return {
    message: `Ошибка сервера (${status}): ${getServerMessage(error)}`,
    shouldRetry: false,
  };
}

function handleNetworkError(error: AxiosError): ErrorConfig {
  const code = error.code || 'Unknown';
  const config = NETWORK_ERROR_CONFIGS[code];

  if (config) {
    return config;
  }

  return {
    message: 'Ошибка сети. Проверьте подключение к интернету.',
    shouldRetry: true,
    retryDelay: 2000,
  };
}

export function handleApiError(error: unknown, options: ErrorHandlerOptions = {}): void {
  const { silent = false, context = '', retry = false, retryCallback, maxRetries = 3 } = options;

  if (!silent) {
    let status: number | undefined;
    if (error instanceof AxiosError) {
      status = error.response?.status;
    }
    logError(error, context, status);
  }

  if (silent) return;

  let message = 'Произошла неожиданная ошибка';
  let shouldRetry = false;
  let retryDelay = 2000;

  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status) {
      const config = handleHttpStatusError(status, error);
      message = config.message;
      shouldRetry = config.shouldRetry || false;
      retryDelay = config.retryDelay || 2000;
    } else if (error.code) {
      const config = handleNetworkError(error);
      message = config.message;
      shouldRetry = config.shouldRetry || false;
      retryDelay = config.retryDelay || 2000;
    } else {
      message = `Ошибка запроса: ${error.message}`;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  if (context) {
    message = `${context}: ${message}`;
  }

  showUserNotification(message, 'error');

  if (retry && shouldRetry && maxRetries > 0 && retryCallback) {
    setTimeout(() => {
      showUserNotification(`Повторная попытка... (${maxRetries - 1} осталось)`, 'error');
      retryCallback();
    }, retryDelay);
  }
}

let notificationComponent: NotificationComponent | null;

export function registerNotificationComponent(component: NotificationComponent): void {
  notificationComponent = component;
}

export function showNotification(message: string, type: 'error' | 'success' = 'error'): void {
  if (notificationComponent) {
    notificationComponent.show(message, type);
  } else {
    console.warn('Notification component is not registered');
    console[type === 'error' ? 'error' : 'log'](message);
  }
}
