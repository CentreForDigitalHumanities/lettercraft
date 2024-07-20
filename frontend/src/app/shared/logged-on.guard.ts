import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "@services/auth.service";
import { filter, map } from "rxjs";

export const LoggedOnGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
        filter((user) => user !== undefined),
        map((user) => {
            if (user === null) {
                router.navigate(["/login"], { queryParams: { next: route.url } });
                return false;
            }
            return true;
        })
    );
};
