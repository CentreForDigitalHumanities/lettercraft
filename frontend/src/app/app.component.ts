import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'lc-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    public title = 'lettercraft';

    public fullWidth$ = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute.firstChild?.snapshot.data['fullWidth'] === true)
    );
}
