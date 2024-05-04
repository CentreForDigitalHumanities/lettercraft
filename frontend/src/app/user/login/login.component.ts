import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { UserLogin } from '../models/user';
import { filter, map, merge, startWith } from 'rxjs';
import { updateFormValidity } from '../utils';

type LoginForm = {
    [key in keyof UserLogin]: FormControl<string>;
}

@Component({
  selector: 'lc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public form = new FormGroup<LoginForm>({
        username: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        password: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
    });

    public loginError$ = this.authService.loginResult$.pipe(
        filter(response => 'error' in response),
    );

    public loading$ = merge(
        this.authService.login$.pipe(map(() => true)),
        this.authService.loginResult$.pipe(map(() => false)),
    ).pipe(startWith(false));

    constructor(private authService: AuthService) { }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (!this.form.valid) {
            return;
        }
        this.authService.login$.next(this.form.getRawValue());
    }
}
