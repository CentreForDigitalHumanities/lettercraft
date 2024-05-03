import { Injectable, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from './session.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, catchError, map, of, switchMap, tap, merge, share } from 'rxjs';
import { UserRegistration, User, UserResponse, UserLogin, PasswordForgotten, ResetPassword } from '../user/models/user';
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
    private currentUserSubject$ = new BehaviorSubject<User | null>(null);

    public currentUser = computed(() => this.currentUserSubject$.value);

    currentUser$ = this.currentUserSubject$.pipe();
    isAuthenticated$ = this.currentUserSubject$.pipe(
        map(_.isObject)
    );

    public initialAuth$ = new Subject<void>();

    public registration$ = new Subject<UserRegistration>();
    public registrationResult$ = this.registration$.pipe(
        switchMap(registrationForm => this.http.post<void>(
            this.authRoute('registration/'), registrationForm).pipe(
                catchError(error => of<AuthAPIError>({ error: error.error })),
            ),
        ),
        share()
    );

    public login$ = new Subject<UserLogin>();
    public loginResult$ = this.login$.pipe(
        switchMap(loginForm => this.http.post<AuthAPIResult>(
            this.authRoute('login/'), loginForm
        ).pipe(
            catchError(error => of<AuthAPIError>({ error: error.error })),
        )),
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


    public user$ = merge([
        this.loginResult$,
        this.initialAuth$
    ]).pipe(
        switchMap(() => this.http.get<UserResponse>(
            this.authRoute('user/')
        ).pipe(
            catchError(error => of(null)),
            map(parseUserData),
        )),
    );


    /**
     * Logs in, retrieves user response, transforms to User object
     */
    // public loginOld$(loginForm: UserLogin): Observable<User | null> {
    //     return this.http.post<{ key: string }>(
    //         this.authRoute('login/'),
    //         loginForm
    //     ).pipe(
    //         switchMap(() => this.checkUser$()),
    //         tap(data => this.setAuth(data)),
    //     );
    // }

    constructor(
        private sessionService: SessionService,
        private router: Router,
        private http: HttpClient,
    ) {
        this.sessionService.expired.pipe(
            takeUntilDestroyed()
        ).subscribe(() => this.logout());
        // this.setInitialAuth();
    }

    private authRoute(route: string): string {
        return `/users/${route}`;
    }

    private setAuth(user: User | null): void {
        this.currentUserSubject$.next(user);
    }

    private purgeAuth(): void {
        this.currentUserSubject$.next(null);
    }


    // TODO: this belongs in the app component.
    // private setInitialAuth(): void {
    //     this.checkUser$
    //         .pipe(takeUntilDestroyed())
    //         .subscribe(user =>
    //             this.setAuth(user),
    //         );
    // }

    public logout(redirectToLogin = false): void {
        this.purgeAuth();
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



    public keyInfo$(key: string): Observable<{ username: string, email: string }> {
        return this.http.post<{ username: string; email: string }>(
            this.authRoute('registration/key-info/'),
            { key }
        );
    }

    public showLogin(returnUrl?: string) {
        this.currentUser$
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
            tap(res => this.setAuth(parseUserData(res))),
        );
    }

}
