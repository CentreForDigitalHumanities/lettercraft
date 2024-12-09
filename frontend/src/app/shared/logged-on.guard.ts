import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "@services/auth.service";
import { ToastService } from "@services/toast.service";
import { filter, map } from "rxjs";

export const LoggedOnGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const toastService = inject(ToastService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
        filter((user) => user !== undefined),
        map((user) => {
            toastService.show({
                type: 'danger',
                header: 'Not signed in',
                body: 'You must be signed in to view this page.'
            });
            if (user === null) {
                return router.createUrlTree(['/login'], {
                    queryParams: { next: route.url }
                });
            }
            return true;
        })
    );
};
