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
import { LocationFormComponent } from './data-entry/location-form/location-form.component';
import { GiftFormComponent } from './data-entry/gift-form/gift-form.component';
import { LetterFormComponent } from './data-entry/letter-form/letter-form.component';
import { AgentFormComponent } from './data-entry/agent-form/agent-form.component';
import { SourceComponent } from './data-entry/source/source.component';

const SITE_NAME = 'Lettercraft & Epistolary Performance in Medieval Europe';
const pageTitle = (name: string) => `${name} - ${SITE_NAME}`

const routes: Routes = [
    {
        path: 'home',
        title: SITE_NAME,
        component: HomeComponent,
    },
    {
        path: 'login',
        title: pageTitle('Sign in'),
        component: LoginComponent,
    },
    {
        path: 'register',
        title: pageTitle('Registration'),
        component: RegisterComponent,
    },
    {
        path: 'confirm-email/:key',
        title: pageTitle('Confirm email'),
        component: VerifyEmailComponent,
    },
    {
        path: 'password-forgotten',
        title: pageTitle('Forgot password'),
        component: PasswordForgottenComponent
    },
    {
        path: 'reset-password/:uid/:token',
        title: pageTitle('Reset password'),
        component: ResetPasswordComponent
    },
    {
        path: 'user-settings',
        title: pageTitle('Settings'),
        component: UserSettingsComponent
    },
    {
        path: 'data-entry',
        canActivate: [LoggedOnGuard],
        children: [
            {
                path: 'agents/:id',
                title: pageTitle('Edit agent'),
                component: AgentFormComponent,
            },
            {
                path: 'gifts/:id',
                title: pageTitle('Edit gift'),
                component: GiftFormComponent,
            },
            {
                path: 'letters/:id',
                title: pageTitle('Edit letter'),
                component: LetterFormComponent,
            },
            {
                path: 'locations/:id',
                title: pageTitle('Edit location'),
                component: LocationFormComponent,
            },
            {
                path: 'sources',
                title: pageTitle('Sources'),
                component: SourcesComponent
            },
            {
                path: 'sources/:id',
                title: pageTitle('View source'),
                component: SourceComponent
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'sources'
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
