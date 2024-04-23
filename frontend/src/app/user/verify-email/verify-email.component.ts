import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Observable, Subject, catchError, delay, filter, of, switchMap, take, tap, timer } from 'rxjs';
import * as _ from 'underscore';

@Component({
    selector: 'lc-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {
    key: string;
    userDetails$: Observable<{ username: string, email: string } | undefined>;
    error$ = new Subject<HttpErrorResponse>();
    success$ = new Subject<boolean>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private router: Router,
    ) {
        this.key = this.activatedRoute.snapshot.params['key'];
        this.userDetails$ = this.authService.keyInfo(this.key).pipe(
            takeUntilDestroyed(),
            catchError((e: HttpErrorResponse) => {
                this.error$.next(e);
                return of(undefined);
            })
        );
        this.success$.pipe(
            delay(3000),
            switchMap(() => this.authService.isAuthenticated$.pipe(
                filter(_.negate(_.isUndefined)),
                take(1))
            ),
            takeUntilDestroyed(),
        ).subscribe(isLoggedIn => this.redirect(isLoggedIn));
    }

    confirm() {
        this.authService.verifyEmail(this.key).subscribe({
            next: () => this.success$.next(true),
            error: (e) => this.error$.next(e),
        })
    }

    private redirect(isLoggedIn: boolean): void {
        if (isLoggedIn) {
            this.router.navigate(['/']);
        } else {
            this.authService.showLogin();
        }
    }
}
