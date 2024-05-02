import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { controlErrorMessages$, updateFormValidity } from '../utils';
import { filter } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { PasswordForgotten } from '../models/user';

type PasswordForgottenForm = {
    [key in keyof PasswordForgotten]: FormControl<string>;
}

const errorMessageMap: Record<keyof PasswordForgotten, Record<string, string>> = {
    email: {
        'required': 'Email is required.',
        'email': 'Email is invalid.',
    }
}

@Component({
  selector: 'lc-password-forgotten',
  templateUrl: './password-forgotten.component.html',
  styleUrls: ['./password-forgotten.component.scss']
})
export class PasswordForgottenComponent {
    form = new FormGroup<PasswordForgottenForm>({
        email: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email]
        })
    });

    public emailErrors$ = controlErrorMessages$('email', this.form, errorMessageMap.email);

    public passwordForgottenSuccessful$ = this.authService.passwordForgottenResult$.pipe(
        filter(result => !('error' in result)),
    );

    constructor(private authService: AuthService) { }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (!this.form.valid) {
            return;
        }
        this.authService.passwordForgotten$.next(this.form.getRawValue())
    }

}
