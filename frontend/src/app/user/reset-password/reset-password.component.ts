import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResetPassword } from '../models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { identicalPasswordsValidator, passwordValidators } from '../validation';
import { controlErrorMessages$, setErrors, updateFormValidity } from '../utils';
import { filter, map } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ResetPasswordForm = {
    [key in keyof ResetPassword]: FormControl<string>;
}

const errorMessageMap: Pick<Record<keyof ResetPassword | 'form', Record<string, string>>, 'new_password1' | 'new_password2' | 'form' | 'token'> = {
    new_password1: {
        'required': 'Password is required.',
        'minlength': 'Password must be at least 8 characters long.',
    },
    new_password2: {
        'required': 'Password is required.',
        'minlength': 'Password must be at least 8 characters long.',
    },
    form: {
        'passwords': 'Passwords must be identical.',
        'invalid': 'The token is invalid. Please request a new password reset link.'
    },
    token: {
        'invalid': 'The URL is invalid. Please request a new one.'
    }
};

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

    public password1Errors$ = controlErrorMessages$('new_password1', this.form, errorMessageMap.new_password1);
    public password2Errors$ = controlErrorMessages$('new_password2', this.form, errorMessageMap.new_password2);
    public formErrors$ = this.form.statusChanges.pipe(
        map(() => {
            // We also include errors from the hidden 'uid' and 'token' controls in the form errors.
            const formErrors =
                {
                    ...this.form.errors,
                    ...this.form.controls.token.errors,
                    ...this.form.controls.uid.errors
                 } ?? {};
            const formErrorMessages = errorMessageMap.form;
            const messages: string[] = [];
            for (const errorKey in formErrors) {
                if (errorKey in formErrorMessages) {
                    messages.push(formErrorMessages[errorKey]);
                } else {
                    messages.push(formErrors[errorKey]);
                }
            }
            return messages;
        })
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
