import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { map } from 'rxjs';

@Component({
    selector: 'lc-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: false
})
export class MenuComponent {
    public burgerActive = false;
    public isContributor$ = this.authService.currentUser$.pipe(
        map(user => user?.isContributor || false)
    );

    constructor(private authService: AuthService) {}

    toggleBurger(): void {
        this.burgerActive = !this.burgerActive;
    }
}
