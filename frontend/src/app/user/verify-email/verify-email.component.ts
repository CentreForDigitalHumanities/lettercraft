import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';
import { map, merge, share, startWith } from 'rxjs';


@Component({
    selector: 'lc-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
    private key = this.activatedRoute.snapshot.params['key'];

    private keyInfo$ = this.authService.keyInfo$(this.key);

    private keyInfoError$ = this.keyInfo$.pipe(
        map(results => 'error' in results ? results : null),
    );

    public userDetails$ = this.keyInfo$.pipe(
        map(results => 'error' in results ? null : results),
        share()
    );

    public loading$ = merge(
        this.authService.verifyEmail$.pipe(map(() => true)),
        this.authService.verifyEmailResult$.pipe(map(() => false))
    ).pipe(startWith(false));

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private toastService: ToastService,
        private destroyRef: DestroyRef
    ) { }

    ngOnInit(): void {
        this.keyInfoError$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(result => {
            if (!result) {
                return;
            }
            this.toastService.show({
                header: 'Email address verification failed.',
                body: 'Failed to verify email address.',
                type: 'danger'
            });
        });

        this.authService.verifyEmailResult$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(result => {
            if ('error' in result) {
                this.toastService.show({
                    header: 'Email verification failed',
                    body: 'Failed to verify email address.',
                    type: 'danger',
                })
            } else {
                this.toastService.show({
                    header: 'Email verified',
                    body: 'Email address has been verified.',
                    type: 'success',
                });
            }
        });
    }

    public confirm(): void {
        this.authService.verifyEmail$.next(this.key);
    }
}
