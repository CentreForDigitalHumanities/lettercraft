import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResetPassword } from '../models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { identicalPasswordsValidator, passwordValidators } from '../validation';
import { controlErrorMessages$, formErrorMessages$, setErrors, updateFormValidity } from '../utils';
import { filter, map, merge } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ResetPasswordForm = {
    [key in keyof ResetPassword]: FormControl<string>;
}

@Component({
  selector: 'lc-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    private uid = this.activatedRoute.snapshot.params['uid'];
    private token = this.activatedRoute.snapshot.params['token'];

    public form = new FormGroup<ResetPasswordForm>({
        uid: new FormControl<string>(this.uid, {
            nonNullable: true }),
        token: new FormControl<string>(this.token, { nonNullable: true }),
        new_password1: new FormControl<string>('', {
            nonNullable: true,
            validators: [
                Validators.required,
                ...passwordValidators
            ]
        }),
        new_password2: new FormControl<string>('', {
            nonNullable: true,
            validators: [
                Validators.required,
                ...passwordValidators
            ]
        }),
    }, {
        validators: identicalPasswordsValidator<keyof ResetPassword>('new_password1', 'new_password2')
    });

    public password1Errors$ = controlErrorMessages$(this.form, 'new_password1', 'password');
    public password2Errors$ = controlErrorMessages$(this.form, 'new_password2', 'password');
    public formErrors$ = merge(
        formErrorMessages$(this.form),
        controlErrorMessages$(this.form, 'token'),
        controlErrorMessages$(this.form, 'uid')
    );

    public resetPasswordSuccesful$ = this.authService.resetPasswordResult$.pipe(
        filter(result => !('error' in result)),
        map(() => true)
    );

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private destroyRef: DestroyRef
    ) { }

    ngOnInit(): void {
        this.authService.resetPasswordResult$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(result => {
                if ('error' in result) {
                    setErrors(result.error, this.form);
                }
            });
    }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (!this.form.valid) {
            return;
        }
        this.authService.resetPassword$.next(this.form.getRawValue());
    }
}
