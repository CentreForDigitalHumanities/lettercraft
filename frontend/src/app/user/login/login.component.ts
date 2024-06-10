import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { passwordValidators, usernameValidators } from '../validation';



@Component({
  selector: 'lc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    usernameInput = new FormControl('', [
        Validators.required,
        ...usernameValidators
    ]);
    usernameErrorMessage = '';
    passwordInput = new FormControl('', [
        Validators.required,
        ...passwordValidators,
    ]);
    passwordErrorMessage = '';

    requestFailed = false;

    private returnUrl: string;

    constructor(
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {
        this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
    }

    submit() {
        const valid = this.checkValidation();
        if (valid) {
            this.authService.login(
                this.usernameInput.value as string, this.passwordInput.value as string
            ).subscribe({
                next: () => this.loginSucces(),
                error: (e: HttpErrorResponse) => this.loginFailed(e)
            });
        }
    }

    private checkValidation() {
        if (this.usernameInput.invalid) {
            if (this.usernameInput.errors?.['required']) {
                this.usernameErrorMessage = 'username is required';
            } else {
                this.usernameErrorMessage = 'invalid username';
            }
        } else {
            this.usernameErrorMessage = '';
        }

        if (this.passwordInput.invalid) {
            if (this.passwordInput.errors?.['required']) {
                this.passwordErrorMessage = 'password is required';
            } else {
                this.passwordErrorMessage = 'invalid password';
            }
        } else {
            this.passwordErrorMessage = '';
        }

        return this.usernameInput.valid && this.passwordInput.valid;
    }

    private loginSucces() {
        this.router.navigate([this.returnUrl]);
    }

    private loginFailed(error: HttpErrorResponse) {
        this.requestFailed = true;
    }
}
