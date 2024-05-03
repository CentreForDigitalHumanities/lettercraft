import { Component } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { AuthService } from '@services/auth.service';
import _ from 'underscore';

@Component({
  selector: 'lc-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
    public isLoading$ = this.authService.currentUser$.pipe(
        map(_.isUndefined)
    );

    public user$ = this.authService.currentUser$;

    public showSignIn$ = this.authService.currentUser$.pipe(
        map(_.isNull)
    );

    public icons = {
        user: faUser,
    };

    constructor(public authService: AuthService) { }

    logout(): void {
        this.authService.logout$.next();
    }

}
