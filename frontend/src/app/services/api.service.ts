import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(protected http: HttpClient) { }

    private apiRoute(route: string): string {
        return `${this.apiUrl}/${route}`;
    }

}
