import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';



@Component({
  selector: 'lc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    usernameInput = new FormControl();
    passwordInput = new FormControl();

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
        this.authService.login(
            this.usernameInput.value, this.passwordInput.value
        ).subscribe({
            next: () => this.loginSucces(),
            error: (e: HttpErrorResponse) => this.loginFailed(e)
        });
    }

    loginSucces() {
        this.router.navigate([this.returnUrl]);
    }

    loginFailed(error: HttpErrorResponse) {
        this.requestFailed = true;
    }
}
