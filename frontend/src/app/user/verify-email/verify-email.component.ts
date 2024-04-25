import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Observable, Subject, catchError, filter, of, switchMap, take } from 'rxjs';
import _ from 'underscore';

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
    directToLogin: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private destroyRef: DestroyRef,
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
            switchMap(() => this.authService.isAuthenticated$.pipe(
                filter(_.negate(_.isUndefined)),
                take(1))
            ),
            takeUntilDestroyed(),
        ).subscribe(isLoggedIn => this.directToLogin = !isLoggedIn);
    }

    confirm() {
        this.authService.verifyEmail(this.key).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: () => this.success$.next(true),
            error: (e) => this.error$.next(e),
        })
    }
}
