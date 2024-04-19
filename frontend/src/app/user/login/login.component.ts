import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'lc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    usernameInput = new FormControl();
    passwordInput = new FormControl();

    constructor(private authService: AuthService) { }

    submit() {
        this.authService.login(
            this.usernameInput.value, this.passwordInput.value
        ).subscribe(result => {
            console.log(result)
        });
    }
}
