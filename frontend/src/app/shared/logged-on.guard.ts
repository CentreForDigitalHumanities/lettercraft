import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "@services/auth.service";
import { filter, map } from "rxjs";

export const LoggedOnGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.currentUser$.pipe(
        filter((user) => user !== undefined),
        map((user) => {
            if (user === null) {
                router.navigate(["/login"]);
                return false;
            }
            return true;
        })
    );
};
