import { Injectable } from '@angular/core';

type ToastType = 'success' | 'info' | 'warning' | 'danger';

interface Toast {
    header: string;
    body: string;
    className: string;
    delay?: number;
}

const TOAST_STYLES: Record<ToastType, string> = {
    success: 'bg-success text-light',
    info: 'bg-info text-dark',
    warning: 'bg-warning text-dark',
    danger: 'bg-danger text-light',
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    public toasts: Toast[] = [];

    public show(header: string, body: string, type: ToastType = 'info', delay?: number) {
        const className = TOAST_STYLES[type];
        this.toasts.push({ header, body, delay, className });
    }

    public remove(toast: Toast): void {
        this.toasts = this.toasts.filter(t => t !== toast);
    }

    public clear(): void {
        this.toasts = [];
    }
}
