import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { controlErrorMessages$, updateFormValidity } from '../utils';
import { filter, map, merge, startWith } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { PasswordForgotten } from '../models/user';

type PasswordForgottenForm = {
    [key in keyof PasswordForgotten]: FormControl<string>;
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

    public emailErrors$ = controlErrorMessages$(this.form, 'email');

    public success$ = this.authService.passwordForgottenResult$.pipe(
        filter(result => !('error' in result)),
    );

    public loading$ = merge(
        this.authService.passwordForgotten$.pipe(map(() => true)),
        this.authService.passwordForgottenResult$.pipe(map(() => false))
    ).pipe(startWith(false));

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
