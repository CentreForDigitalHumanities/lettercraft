import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { VerifyEmailComponent } from './user/verify-email/verify-email.component';
import { RegisterComponent } from './user/register/register.component';
import { PasswordForgottenComponent } from './user/password-forgotten/password-forgotten.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { UserSettingsComponent } from './user/user-settings/user-settings.component';
import { LoggedOnGuard } from '@shared/logged-on.guard';
import { SourcesComponent } from './data-entry/sources/sources.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'confirm-email/:key',
        component: VerifyEmailComponent,
    },
    {
        path: 'password-forgotten',
        component: PasswordForgottenComponent
    },
    {
        path: 'reset-password/:uid/:token',
        component: ResetPasswordComponent
    },
    {
        path: 'user-settings',
        component: UserSettingsComponent
    },
    {
        path: 'data-entry',
        canActivate: [LoggedOnGuard],
        children: [
            {
                path: '',
                component: SourcesComponent
            }
        ]
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];

export { routes };
