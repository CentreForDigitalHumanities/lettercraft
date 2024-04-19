import { Component } from '@angular/core';
import { Observable, filter, map, tap } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import * as _ from 'underscore';

@Component({
  selector: 'lc-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
    isLoading$: Observable<boolean>;
    user$: Observable<User | null>;

    constructor(private authService: AuthService) {
        this.isLoading$ = this.authService.currentUser$.pipe(
            map(_.isUndefined)
        );
        this.user$ = this.authService.currentUser$.pipe(
            filter(_.negate(_.isUndefined)),
            tap(data => console.log(data)),
        );
    }

}
