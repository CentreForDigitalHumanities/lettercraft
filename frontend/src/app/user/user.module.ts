import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { VerifyEmailComponent } from './verify-email/verify-email.component';



@NgModule({
    declarations: [
        LoginComponent,
        VerifyEmailComponent
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
