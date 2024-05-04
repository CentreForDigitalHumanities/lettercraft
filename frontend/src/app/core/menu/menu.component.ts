import { Component } from '@angular/core';

@Component({
    selector: 'lc-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
    burgerActive = false;

    toggleBurger() {
        this.burgerActive = !this.burgerActive;
    }
}
