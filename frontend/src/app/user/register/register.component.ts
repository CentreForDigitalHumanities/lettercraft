import { Component } from '@angular/core';
import { UserRegistration } from '../models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { usernameValidators, passwordValidators, identicalPasswordsValidator } from '../validation';
import { AuthService } from '@services/auth.service';

type RegisterForm = {
    [key in keyof UserRegistration]: FormControl<string>;
}

@Component({
  selector: 'lc-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
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
        ]}),
    }, {
        validators: identicalPasswordsValidator
    });

    registrationResult$ = this.authService.registration$;

    constructor(private authService: AuthService) { }

    public submit(): void {
        this.form.updateValueAndValidity();
        this.form.markAllAsTouched();
        if (!this.form.valid) {
            return;
        }
        this.authService.newRegistration$.next(this.form.getRawValue());
    }

}
