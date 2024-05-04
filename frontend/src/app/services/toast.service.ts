import { Injectable } from '@angular/core';

type ToastType = 'success' | 'info' | 'warning' | 'danger';

interface Toast {
    header: string;
    body: string;
    className: string;
    delay: number;
}

interface ToastInput {
    header?: string;
    body: string;
    type?: ToastType;
    delay?: number;
}

const TOAST_STYLES: Record<ToastType, string> = {
    success: 'bg-success text-light',
    info: 'bg-info text-dark',
    warning: 'bg-warning text-dark',
    danger: 'bg-danger text-light',
};

const TOAST_DEFAULT_HEADERS: Record<ToastType, string> = {
    success: 'Success',
    info: 'Info',
    warning: 'Warning',
    danger: 'Error',
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    public toasts: Toast[] = [];

    public show(toastInput: ToastInput): Toast {
        const type = toastInput.type || 'info';
        const toast: Toast = {
            className: TOAST_STYLES[type],
            header: toastInput.header || TOAST_DEFAULT_HEADERS[type],
            body: toastInput.body,
            delay: toastInput.delay || 5000,
        }
        this.toasts.push(toast);
        return toast;
    }

    public remove(toast: Toast): void {
        this.toasts = this.toasts.filter(t => t !== toast);
    }

    public clear(): void {
        this.toasts = [];
    }
}
