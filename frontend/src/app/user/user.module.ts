import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
    declarations: [
        LoginComponent,
        VerifyEmailComponent,
        RegisterComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        LoginComponent,
        VerifyEmailComponent,
    ]
})
export class UserModule { }
