import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from './session.service';
import { catchError, map, of, switchMap, merge, share, startWith, withLatestFrom, shareReplay } from 'rxjs';
import { UserRegistration, UserResponse, UserLogin, PasswordForgotten, ResetPassword, KeyInfo, UserSettings } from '../user/models/user';
import { parseUserData } from '../user/utils';
import _ from 'underscore';
import { HttpClient } from '@angular/common/http';
import { HttpVerb, Request } from '../user/Request';

export interface AuthAPIResult {
    detail: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public login = this.createRequest<UserLogin, AuthAPIResult>(
        this.authRoute('login/'), 'get'
    );
    public registration = this.createRequest<UserRegistration, never>(
        this.authRoute('registration/'),
        'post'
    );
    public passwordForgotten = this.createRequest<PasswordForgotten, AuthAPIResult>(
        this.authRoute('password/reset/'),
        'post'
    );
    public resetPassword = this.createRequest<ResetPassword, AuthAPIResult>(
        this.authRoute('password/reset/confirm/'),
        'post'
    );
    public verifyEmail = this.createRequest<string, AuthAPIResult>(
        this.authRoute('registration/verify-email/'),
        'post'
    );
    public updateSettings = this.createRequest<Partial<UserSettings>, UserResponse>(
        this.authRoute('user/'),
        'patch'
    );
    public keyInfo = this.createRequest<string, KeyInfo>(
        this.authRoute('registration/key-info/'),
        'post'
    )
    public deleteUser = this.createRequest<void, AuthAPIResult>(
        this.authRoute('delete/'),
        'delete'
    );
    public logout = this.createRequest<void, AuthAPIResult>(
        this.authRoute('logout/'),
        'post'
    );

    public backendUser$ = this.login.result$.pipe(
        startWith(undefined),
        switchMap(() => this.http.get<UserResponse>(
            this.authRoute('user/')
        ).pipe(
            catchError(() => of(null)),
            map(parseUserData),
        )),
        share()
    );

    private updateSettingsUser$ = this.updateSettings.result$
        .pipe(
            withLatestFrom(this.backendUser$),
            map(([userData, currentUser]) => 'error' in userData ? currentUser : parseUserData(userData)),
        );

    public currentUser$ = merge(
        this.logout.result$.pipe(map(() => null)),
        this.backendUser$,
        this.updateSettingsUser$
    ).pipe(
        startWith(undefined),
        shareReplay(1)
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
        ).subscribe(() => this.logout.subject.next());
    }

    private authRoute(route: string): string {
        return `/users/${route}`;
    }

    private createRequest<Input, Result extends object | never = AuthAPIResult>(route: string, verb: HttpVerb): Request<Input, Result> {
        return new Request<Input, Result>(this.http, route, verb);
    }
}
