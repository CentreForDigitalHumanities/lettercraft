import { Component, DestroyRef, OnInit } from '@angular/core';
import { UserRegistration } from '../models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { usernameValidators, passwordValidators, identicalPasswordsValidator } from '../validation';
import { AuthService } from '@services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { controlErrorMessages$, formErrorMessages$, setErrors, updateFormValidity } from '../utils';

type RegisterForm = {
    [key in keyof UserRegistration]: FormControl<string>;
}

@Component({
    selector: 'lc-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    public form = new FormGroup<RegisterForm>({
        username: new FormControl<string>('', {
            nonNullable: true,
            validators: [
                Validators.required,
                ...usernameValidators
            ]
        }),
        email: new FormControl<string>('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.email,
            ]
        }),
        password1: new FormControl<string>('', {
            nonNullable: true,
            validators: [
                Validators.required,
                ...passwordValidators,
            ]
        }),
        password2: new FormControl<string>('', {
            nonNullable: true,
            validators: [
                Validators.required,
                ...passwordValidators,
            ]
        }),
    }, {
        validators: identicalPasswordsValidator<keyof RegisterForm>('password1', 'password2')
    });

    public usernameErrors$ = controlErrorMessages$(this.form, 'username');
    public emailErrors$ = controlErrorMessages$(this.form, 'email');
    public password1Errors$ = controlErrorMessages$(this.form, 'password1', 'password');
    public password2Errors$ = controlErrorMessages$(this.form, 'password2', 'password');
    public formErrors$ = formErrorMessages$(this.form);

    public registrationSuccessful$ = this.authService.registrationResult$.pipe(
        filter(result => !(result?.error)),
        map(() => true),
    );

    constructor(
        private authService: AuthService,
        private destroyRef: DestroyRef,
    ) { }

    ngOnInit(): void {
        this.authService.registrationResult$
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(result => {
                if (result?.error) {
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
        this.authService.registration$.next(this.form.getRawValue());
    }
}
