import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { catchError, filter, ignoreElements, map, merge, of, share, startWith, switchMap, take } from 'rxjs';
import _ from 'underscore';


@Component({
    selector: 'lc-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {
    private key = this.activatedRoute.snapshot.params['key'];

    public userDetails$ = this.authService.keyInfo$(this.key).pipe(share())

    public error$ = merge(
        this.userDetails$.pipe(ignoreElements()),
        this.authService.verifyEmailResult$.pipe(ignoreElements()),
    ).pipe(
        catchError((e: HttpErrorResponse) => of(e))
    );

    public success$ = this.authService.verifyEmailResult$.pipe(
        map(() => true),
        catchError(() => of(false)),
    );

    public loading$ = merge(
        this.authService.verifyEmail$.pipe(map(() => true)),
        this.authService.verifyEmailResult$.pipe(map(() => false))
    ).pipe(startWith(false));

    public directToLogin$ = this.success$.pipe(
        switchMap(() => this.authService.isAuthenticated$.pipe(
            filter(_.negate(_.isUndefined)),
            take(1))
        )
    );

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
    ) { }

    public confirm() {
        this.authService.verifyEmail$.next(this.key);
    }
}
