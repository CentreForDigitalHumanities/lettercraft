import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { UserLogin } from '../models/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, ignoreElements, of } from 'rxjs';
import { updateFormValidity } from '../utils';

type LoginForm = {
    [key in keyof UserLogin]: FormControl<string>;
}

@Component({
  selector: 'lc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form = new FormGroup<LoginForm>({
        username: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        password: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
    });

    returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';

    loginReturn$ = this.authService.login$;
    loginReturnError$ = this.authService.login$.pipe(
        ignoreElements(),
        catchError(error => of(error))
    );

    constructor(
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private destroyRef: DestroyRef,
    ) { }

    ngOnInit(): void {
        this.loginReturn$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(() => {
            this.router.navigate([this.returnUrl]);
        })
    }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (!this.form.valid) {
            return;
        }
        this.authService.newLogin$.next(this.form.getRawValue());
    }
}
