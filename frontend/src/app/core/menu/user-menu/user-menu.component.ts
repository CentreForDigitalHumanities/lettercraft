import { Component } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Observable, map } from 'rxjs';
import { User } from 'src/app/user/models/user';
import { AuthService } from '@services/auth.service';
import _ from 'underscore';

@Component({
  selector: 'lc-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
    isLoading$: Observable<boolean>;
    user$: Observable<User | null | undefined>;
    showSignIn$: Observable<boolean>;

    icons = {
        user: faUser,
    };

    constructor(private authService: AuthService) {
        this.isLoading$ = this.authService.currentUser$.pipe(
            map(_.isUndefined)
        );
        this.user$ = this.authService.currentUser$;
        this.showSignIn$ = this.authService.currentUser$.pipe(
            map(_.isNull)
        );
    }

    logout() {
        this.authService.logout(false);
    }

}
