import { Injectable, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from './session.service';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, map, of, switchMap, tap, merge, share } from 'rxjs';
import { UserRegistration, User, UserResponse, UserLogin, PasswordForgotten, ResetPassword, KeyInfo } from '../user/models/user';
import { encodeUserData, parseUserData } from '../user/utils';
import _ from 'underscore';
import { HttpClient } from '@angular/common/http';

interface AuthAPIResult {
    detail: string;
}

interface AuthAPIError {
    error: Record<string, string>;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public login$ = new Subject<UserLogin>();
    public loginResult$ = this.login$.pipe(
        switchMap(loginForm => this.http.post<AuthAPIResult>(
            this.authRoute('login/'), loginForm
        ).pipe(
            catchError(error => of<AuthAPIError>({ error: error.error })),
        )),
        share()
    );

    public registration$ = new Subject<UserRegistration>();
    public registrationResult$ = this.registration$.pipe(
        switchMap(registrationForm => this.http.post<void>(
            this.authRoute('registration/'), registrationForm).pipe(
                catchError(error => of<AuthAPIError>({ error: error.error })),
            ),
        ),
        share()
    );

    public passwordForgotten$ = new Subject<PasswordForgotten>()
    public passwordForgottenResult$ = this.passwordForgotten$.pipe(
        switchMap(form => this.http.post<AuthAPIResult>(
            this.authRoute('password/reset/'), form
        ).pipe(
            catchError(error => of<AuthAPIError>({ error: error.error}))
        )),
    );

    public resetPassword$ = new Subject<ResetPassword>();
    public resetPasswordResult$ = this.resetPassword$.pipe(
        switchMap(form => this.http.post<AuthAPIResult>(
            this.authRoute('password/reset/confirm/'), form
        ).pipe(
            catchError(error => of<AuthAPIError>({ error: error.error}))
        )),
        share()
    );

    public verifyEmail$ = new Subject<string>();
    public verifyEmailResult$ = this.verifyEmail$.pipe(
        switchMap(key => this.http.post<AuthAPIResult>(
            this.authRoute('registration/verify-email/'),
            { key }
        )),
        share()
    );

    public initialAuth$ = new Subject<void>();

    public backendUser$ = merge(
        this.loginResult$.pipe(tap(() => console.log('Login!'))),
        this.initialAuth$.pipe(tap(() => console.log('Init auth!')))
    ).pipe(
        switchMap(() => this.http.get<UserResponse>(
            this.authRoute('user/')
        ).pipe(
            catchError(error => of(null)),
            map(parseUserData),
        )),
    );

    // Used to reset the user manually.
    private purgeAuth$ = new Subject<void>();

    public currentUser$: Observable<User | null> = merge(
        this.purgeAuth$.pipe(map(() => null)),
        this.backendUser$
    );

    public isAuthenticated$ = this.currentUser$.pipe(
        map(_.isObject)
    );


    constructor(
        private sessionService: SessionService,
        private router: Router,
        private http: HttpClient,
    ) {
        this.sessionService.expired.pipe(
            takeUntilDestroyed()
        ).subscribe(() => this.logout());

        this.backendUser$.subscribe(user => console.log('New user received!', user));
    }

    public keyInfo$(key: string): Observable<KeyInfo> {
        return this.http.post<KeyInfo>(
            this.authRoute('registration/key-info/'),
            { key }
        );
    }

    private authRoute(route: string): string {
        return `/users/${route}`;
    }

    public logout(redirectToLogin = false): void {
        this.purgeAuth$.next();
        this.http.post(
            this.authRoute('logout/'),
            {}
            // Subscribe in component
        ).subscribe((data) => {
            if (redirectToLogin) {
                this.showLogin();
            }
        });
    }

    public showLogin(returnUrl?: string) {
        this.router.navigate(
            ['/login'],
            returnUrl ? { queryParams: { returnUrl } } : undefined
        );
    }

    public updateSettings(update: Partial<User>): Observable<any> {
        const data = encodeUserData(update);
        return this.http.patch<UserResponse>(
            this.authRoute('user/'),
            data
        ).pipe(
            // tap(res => this.setAuth(parseUserData(res))),
        );
    }

}
