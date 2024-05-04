import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from './session.service';
import { Observable, Subject, catchError, map, of, switchMap, merge, share, startWith, withLatestFrom } from 'rxjs';
import { UserRegistration, UserResponse, UserLogin, PasswordForgotten, ResetPassword, KeyInfo, UserSettings } from '../user/models/user';
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
            this.authRoute('registration/'), registrationForm
        ).pipe(
            catchError(error => of<AuthAPIError>({ error: error.error })),
        )),
        share()
    );

    public passwordForgotten$ = new Subject<PasswordForgotten>();
    public passwordForgottenResult$ = this.passwordForgotten$.pipe(
        switchMap(form => this.http.post<AuthAPIResult>(
            this.authRoute('password/reset/'), form
        ).pipe(
            catchError(error => of<AuthAPIError>({ error: error.error }))
        )),
    );

    public resetPassword$ = new Subject<ResetPassword>();
    public resetPasswordResult$ = this.resetPassword$.pipe(
        switchMap(form => this.http.post<AuthAPIResult>(
            this.authRoute('password/reset/confirm/'), form
        ).pipe(
            catchError(error => of<AuthAPIError>({ error: error.error }))
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

    public updateSettings$ = new Subject<UserSettings>();
    public updateSettingsResult$ = this.updateSettings$.pipe(
        switchMap(update => this.http.patch<UserResponse>(
            this.authRoute('user/'),
            encodeUserData(update)
        ).pipe(
            catchError(error => of<AuthAPIError>({ error: error.error })),
        )),
        share()
    );

    public deleteUser$ = new Subject<void>();
    public deleteUserResult$ = this.deleteUser$.pipe(
        switchMap(() => this.http.delete<AuthAPIResult>(
            this.authRoute('delete/')
        ).pipe(
            catchError(error => of<AuthAPIError>({ error: error.error }))
        )),
        share()
    );

    public initialAuth$ = new Subject<void>();

    public backendUser$ = merge(
        this.loginResult$,
        this.initialAuth$
    ).pipe(
        switchMap(() => this.http.get<UserResponse>(
            this.authRoute('user/')
        ).pipe(
            catchError(() => of(null)),
            map(parseUserData),
        )),
        share()
    );

    private updateSettingsUser$ = this.updateSettingsResult$
    .pipe(
        withLatestFrom(this.backendUser$),
        map(([userData, currentUser]) => 'error' in userData ? currentUser : parseUserData(userData)),
    );

    public logout$ = new Subject<void>();
    public logoutResult$ = this.logout$.pipe(
        switchMap(() => this.http.post<AuthAPIResult>(this.authRoute('logout/'), {})),
        share()
    );

    public currentUser$ = merge(
        this.logoutResult$.pipe(map(() => null)),
        this.backendUser$,
        this.updateSettingsUser$
    ).pipe(
        startWith(undefined),
        share()
    );

    public isAuthenticated$ = this.currentUser$.pipe(
        map(_.isObject)
    );

    constructor(
        private sessionService: SessionService,
        private http: HttpClient,
    ) {
        this.sessionService.expired.pipe(
            takeUntilDestroyed()
        ).subscribe(() => this.logout$.next());
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
}
