import { Component, DestroyRef, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { AuthService } from '@services/auth.service';
import _ from 'underscore';
import { ToastService } from '@services/toast.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrentPathService } from '@shared/current-path.service';

@Component({
  selector: 'lc-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
    public authLoading$ = this.authService.currentUser$.pipe(
        map(_.isUndefined)
    );

    public user$ = this.authService.currentUser$;

    public showSignIn$ = this.authService.currentUser$.pipe(map(_.isNull));

    public icons = {
        user: faUser,
    };

    public logoutLoading$ = this.authService.logout.loading$;

    public currentPath$ = this.currentPath.path$;
    public onLoginPage$ = this.currentPath.onLoginPage$;

    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private router: Router,
        private currentPath: CurrentPathService,
        private destroyRef: DestroyRef
    ) {}

    ngOnInit(): void {
        this.authService.logout.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastService.show({
                    header: 'Sign out failed',
                    body: 'There was an error signing you out. Please try again.',
                    type: 'danger'
                });
            });

        this.authService.logout.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastService.show({
                    header: 'Sign out successful',
                    body: 'You have been successfully signed out.',
                    type: 'success'
                });
                this.router.navigate(['/']);
            });
    }

    public logout(): void {
        this.authService.logout.subject.next();
    }
}
