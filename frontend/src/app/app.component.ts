import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'lc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'lettercraft';

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastService: ToastService,
        private destroyRef: DestroyRef,
    ) { }

    ngOnInit(): void {
        this.authService.logoutResult$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(result => {
            if ('error' in result) {
                this.toastService.show({
                    header: 'Sign out failed',
                    body: 'There was an error signing you out. Please try again.',
                    type: 'danger'
                });
            } else {
                this.toastService.show({
                    header: 'Sign out successful',
                    body: 'You have been successfully signed out.',
                    type: 'success'
                });
                this.router.navigate(['/']);
            }
        })
    }
}
