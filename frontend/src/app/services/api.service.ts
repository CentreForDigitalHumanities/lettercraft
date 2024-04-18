import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { UserResponse } from '../models/user';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(protected http: HttpClient) { }

    private apiRoute(route: string): string {
        return `${this.apiUrl}/${route}`;
    }

    // authentication

    login(username: string, password: string): Observable<{ key: string }> {
        return this.http.post<{ key: string }>(
            this.apiRoute('users/login'),
            { username, password }
        );
    }

    logout(): Observable<{ detail: string }> {
        return this.http.post<{ detail: string }>(
            this.apiRoute('users/logout'),
            {}
        );
    }

    getUser(): Observable<UserResponse> {
        return this.http.get<UserResponse>(this.apiRoute('users/user/'));
    }

    public register(details: {
        username: string;
        email: string;
        password1: string;
        password2: string;
    }): Observable<any> {
        return this.http.post<any>(this.apiRoute('users/registration'), details);
    }

    public verifyEmail(key: string) {
        return this.http.post<any>(
            this.apiRoute('users/registration/verify-email'),
            { key }
        );
    }

    public keyInfo(key: string): Observable<{ username: string, email: string }> {
        return this.http.post<{ username: string; email: string }>(
            this.apiRoute('users/registration/key-info'),
            { key }
        );
    }

    public requestResetPassword(email: string): Observable<{ detail: string }> {
        return this.http.post<{ detail: string }>(
            this.apiRoute('users/password/reset'),
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
            this.apiRoute('users/password/reset/confirm'),
            {
                uid,
                token,
                new_password1: newPassword1,
                new_password2: newPassword2,
            }
        );
    }

    /** send PATCH request to update settings for the user */
    public updateUserSettings(
        details: Partial<UserResponse>
    ): Observable<UserResponse> {
        return this.http.patch<UserResponse>(
            this.apiRoute('user'),
            details
        );
    }
}
