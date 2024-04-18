import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from './session.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, mergeMap, tap } from 'rxjs';
import { User, UserResponse } from '../models/user';
import { encodeUserData, parseUserData } from '../utils/user';
import * as _ from 'underscore';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject$ = new BehaviorSubject<User | null | undefined>(undefined);

    currentUser$: Observable<User | null | undefined> = this.currentUserSubject$.pipe();
    isAuthenticated$: Observable<boolean | undefined> = this.currentUserSubject$.pipe(
        map(user => _.isUndefined(user) ? undefined : !_.isNull(user))
    )

    constructor(
        private sessionService: SessionService,
        private apiService: ApiService,
        private router: Router,
    ) {
        this.sessionService.expired.pipe(
            takeUntilDestroyed()
        ).subscribe(() => this.logout());
    }

    private setAuth(user: User): void {
        this.currentUserSubject$.next(user);
    }

    private purgeAuth(): void {
        this.currentUserSubject$.next(null);
    }

    private checkUser(): Observable<UserResponse> {
        return this.apiService.getUser();
    }

    public currentUser(): User | null | undefined {
        return this.currentUserSubject$.value;
    }

    /**
     * Logs in, retrieves user response, transforms to User object
     */
    public login(username: string, password: string): Observable<UserResponse> {
        const loginRequest$ = this.apiService.login(username, password);
        return loginRequest$.pipe(
            mergeMap(() => this.checkUser()),
            tap((res) => this.setAuth(parseUserData(res)))
        );
    }

    public logout(redirectToLogin: boolean = false): Observable<any> {
        this.purgeAuth();
        return this.apiService.logout().pipe(
            tap(() => {
                if (redirectToLogin) {
                    this.showLogin();
                }
            })
        );
    }

    public register(
        username: string, email: string, password1: string, password2: string
    ): Observable<any> {
        return this.apiService.register({
            username,
            email,
            password1,
            password2,
        });
    }

    public verifyEmail(key: string) {
        return this.apiService.verifyEmail(key);
    }

    public keyInfo(key: string) {
        return this.apiService.keyInfo(key);
    }

    public showLogin(returnUrl?: string) {
        this.router.navigate(
            ['/login'],
            returnUrl ? { queryParams: { returnUrl } } : undefined
        );
    }

    public requestResetPassword(email: string): Observable<any> {
        return this.apiService.requestResetPassword(email);
    }

    public resetPassword(
        uid: string,
        token: string,
        newPassword1: string,
        newPassword2: string
    ): Observable<any> {
        return this.apiService.resetPassword(
            uid,
            token,
            newPassword1,
            newPassword2
        );
    }

    public updateSettings(update: Partial<User>): Observable<any> {
        const data = encodeUserData(update);
        return this.apiService.updateUserSettings(data).pipe(
            tap((res) => this.setAuth(parseUserData(res)))
        );
    }

}
