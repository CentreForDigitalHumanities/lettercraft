import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
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

    constructor(private authService: AuthService) {
        this.isLoading$ = this.authService.currentUser$.pipe(
            map(_.isUndefined)
        )

    }

}
