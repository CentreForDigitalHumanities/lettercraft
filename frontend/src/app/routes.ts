import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { VerifyEmailComponent } from './user/verify-email/verify-email.component';
import { RegisterComponent } from './user/register/register.component';

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
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];

export { routes };
