import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Observable, map } from 'rxjs';
import _ from 'underscore';

@Component({
    selector: 'lc-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
    burgerActive = false;

    isLoggedIn$: Observable<boolean>;

    constructor(private authService: AuthService) {
        this.isLoggedIn$ = this.authService.currentUser$.pipe(
            map(user => !!user)
        );
    }


    toggleBurger() {
        this.burgerActive = !this.burgerActive;
    }
}
