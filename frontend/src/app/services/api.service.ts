import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

interface RerouteConfig<T> {
    data: T | null;
    targetRoute: string[];
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private router: Router, private toastService: ToastService) {}

    public rerouteIfEmpty<T>(config: RerouteConfig<T>): void {
        if (!config.data) {
            this.toastService.show({
                type: "danger",
                header: "Not Found",
                body: config.message ?? "The requested resource could not be found.",
            });
            this.router.navigate(config.targetRoute, {
                replaceUrl: true,
            });
        }
    }
}
