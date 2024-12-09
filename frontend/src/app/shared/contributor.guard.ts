import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "@services/auth.service";
import { ToastService } from "@services/toast.service";
import { filter, map } from "rxjs";


export const ContributorGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const toastService = inject(ToastService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
        filter((user) => user !== undefined),
        map((user) => {
            if (user?.isContributor) {
                return true;
            } else {
                let body = 'You do not have permission to view this page.';
                if (!user) { body += ' Do you need to sign in?'; }
                toastService.show({
                    type: 'danger',
                    header: 'Not authorised',
                    body,
                });
                return router.createUrlTree(['/']);
            }
        }),
    );
};
