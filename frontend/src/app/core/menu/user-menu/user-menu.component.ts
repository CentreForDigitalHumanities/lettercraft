import { Component } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { map, merge, startWith } from 'rxjs';
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

    public loading$ = merge(
        this.authService.logout$.pipe(map(() => true)),
        this.authService.logoutResult$.pipe(map(() => false)),
    ).pipe(startWith(false));

    constructor(public authService: AuthService) { }

    public logout(): void {
        this.authService.logout$.next();
    }

}
