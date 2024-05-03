import { Component, DestroyRef, OnInit } from '@angular/core';
import { UserRegistration } from '../models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { usernameValidators, passwordValidators, identicalPasswordsValidator } from '../validation';
import { AuthService } from '@services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { controlErrorMessages$, setErrors, updateFormValidity } from '../utils';

type RegisterForm = {
    [key in keyof UserRegistration]: FormControl<string>;
}

const errorMessageMap: Record<keyof UserRegistration | 'form', Record<string, string>> = {
    username: {
        'required': 'Username is required.',
        'minlength': 'Username must be at least 3 characters long.',
        'maxlength': 'Username must be at most 150 characters long.',
    },
    email: {
        'required': 'Email is required.',
        'email': 'Email is invalid.',
    },
    password1: {
        'required': 'Password is required.',
        'minlength': 'Password must be at least 8 characters long.',
    },
    password2: {
        'required': 'Password is required.',
        'minlength': 'Password must be at least 8 characters long.',
    },
    form: {
        'passwords': 'Passwords must be identical.',
    }
};

@Component({
    selector: 'lc-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    form = new FormGroup<RegisterForm>({
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

    userErrors$ = controlErrorMessages$('username', this.form, errorMessageMap.username);
    emailErrors$ = controlErrorMessages$('email', this.form, errorMessageMap.email);
    password1Errors$ = controlErrorMessages$('password1', this.form, errorMessageMap.password1);
    password2Errors$ = controlErrorMessages$('password2', this.form, errorMessageMap.password2);
    formErrors$ = this.form.statusChanges.pipe(
        map(() => {
            const formErrors = this.form.errors ?? {};
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

    registrationSuccessful$ = this.authService.registrationResult$.pipe(
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
