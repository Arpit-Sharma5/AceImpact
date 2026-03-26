import { useState } from 'react';

/**
 * Toast Component
 * Displays success/error messages as floating notifications.
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const ToastComponent = toast ? (
    <div className={`toast ${toast.type}`}>
      {toast.message}
    </div>
  ) : null;

  return { showToast, ToastComponent };
}
