export interface NotificationComponent {
  show: (message: string, type: 'error' | 'success') => void;
  hide: () => void;
}
