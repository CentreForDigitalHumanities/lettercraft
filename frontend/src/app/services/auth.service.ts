import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from './session.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, mergeMap, of, tap } from 'rxjs';
import { User, UserResponse } from '../user/models/user';
import { encodeUserData, parseUserData } from '../user/utils';
import _ from 'underscore';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject$ = new BehaviorSubject<User | null | undefined>(undefined);

    currentUser$: Observable<User | null | undefined> = this.currentUserSubject$.pipe();
    isAuthenticated$: Observable<boolean | undefined> = this.currentUserSubject$.pipe(
        map(_.isObject)
    )

    private authRoute(route: string): string {
        return `/users/${route}`
    }

    constructor(
        private sessionService: SessionService,
        private router: Router,
        private http: HttpClient,
    ) {
        this.sessionService.expired.pipe(
            takeUntilDestroyed()
        ).subscribe(() => this.logout());
        this.setInitialAuth();
    }

    private setAuth(user: User | null): void {
        this.currentUserSubject$.next(user);
    }

    private purgeAuth(): void {
        this.currentUserSubject$.next(null);
    }

    private checkUser(): Observable<User | null> {
        return this.http.get<UserResponse>(this.authRoute('user/')).pipe(
            catchError(error => of(null)),
            map(parseUserData),
        );
    }

    private setInitialAuth(): void {
        this.checkUser()
            .pipe(takeUntilDestroyed())
            .subscribe(user =>
                this.setAuth(user),
            );
    }

    public currentUser(): User | null | undefined {
        return this.currentUserSubject$.value;
    }

    /**
     * Logs in, retrieves user response, transforms to User object
     */
    public login(username: string, password: string): Observable<User | null> {
        return this.http.post<{ key: string }>(
            this.authRoute('login/'),
            { username, password }
        ).pipe(
            mergeMap(() => this.checkUser()),
            tap(data => this.setAuth(data)),
        );
    }

    public logout(redirectToLogin: boolean = false): void {
        this.purgeAuth();
        this.http.post(
            this.authRoute('logout/'),
            {}
        ).subscribe((data) => {
            console.log(data);
            if (redirectToLogin) {
                this.showLogin();
            }
        });
    }

    public register(
        username: string, email: string, password1: string, password2: string
    ): Observable<any> {
        const data = { username, email, password1, password2 };
        return this.http.post(this.authRoute('registration/'), data);
    }

    public verifyEmail(key: string): Observable<any> {
        return this.http.post(
            this.authRoute('registration/verify-email/'),
            { key }
        );
    }

    public keyInfo(key: string): Observable<{ username: string, email: string }> {
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

    public requestResetPassword(email: string): Observable<{ detail: string }> {
        return this.http.post<{ detail: string }>(
            this.authRoute('password/reset/'),
            { email }
        );
    }

    public resetPassword(
        uid: string,
        token: string,
        newPassword1: string,
        newPassword2: string
    ): Observable<{ detail: string }> {
        return this.http.post<{ detail: string }>(
            this.authRoute('password/reset/confirm/'),
            {
                uid,
                token,
                new_password1: newPassword1,
                new_password2: newPassword2,
            }
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
