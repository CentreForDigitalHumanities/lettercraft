import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AgentFormService {
    id$: Observable<string>;

    constructor(private route: ActivatedRoute) {
        this.id$ = this.route.params.pipe(
            map(params => params['id'])
        );
    }
}
