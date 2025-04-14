import { useState, useCallback } from 'react';

interface ConfirmationOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'success' | 'error' | 'info';
}

interface ConfirmationState extends ConfirmationOptions {
  isVisible: boolean;
  resolve?: (value: boolean) => void;
}

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    isVisible: false,
    message: '',
  });

  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setState({
        isVisible: true,
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel,
        cancelLabel: options.cancelLabel,
        type: options.type,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((prev) => ({ ...prev, isVisible: false }));
  }, [state]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState((prev) => ({ ...prev, isVisible: false }));
  }, [state]);

  return {
    ConfirmationDialog: state.isVisible ? {
      visible: state.isVisible,
      title: state.title || '',
      message: state.message,
      confirmLabel: state.confirmLabel,
      cancelLabel: state.cancelLabel,
      type: state.type,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    } : null,
    confirm,
  };
}
