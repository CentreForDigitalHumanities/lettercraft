import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
    selector: 'lc-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
    public burgerActive = false;
    public isAuthenticated$ = this.authService.isAuthenticated$;

    constructor(private authService: AuthService) {}

    toggleBurger(): void {
        this.burgerActive = !this.burgerActive;
    }
}
