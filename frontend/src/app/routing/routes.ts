import { Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../user/login/login.component';
import { VerifyEmailComponent } from '../user/verify-email/verify-email.component';
import { RegisterComponent } from '../user/register/register.component';
import { PasswordForgottenComponent } from '../user/password-forgotten/password-forgotten.component';
import { ResetPasswordComponent } from '../user/reset-password/reset-password.component';
import { UserSettingsComponent } from '../user/user-settings/user-settings.component';
import { LoggedOnGuard } from './logged-on.guard';
import { SourcesComponent } from '../data-entry/sources/sources.component';
import { LocationFormComponent } from '../data-entry/location-form/location-form.component';
import { GiftFormComponent } from '../data-entry/gift-form/gift-form.component';
import { LetterFormComponent } from '../data-entry/letter-form/letter-form.component';
import { AgentFormComponent } from '../data-entry/agent-form/agent-form.component';
import { SourceComponent } from '../data-entry/source/source.component';
import {
    agentFormTitleResolver, agentViewTitleResolver, giftFormTitleResolver, letterFormTitleResolver, pageTitle,
    SITE_NAME, sourceFormTitleResolver, spaceFormTitleResolver
} from '../titles';
import { EpisodeFormComponent } from '../data-entry/episode-form/episode-form.component';
import { ContributorGuard } from './contributor.guard';
import { AgentViewComponent } from '../data/agent-view/agent-view.component';
import { DataOverviewComponent } from '../data/data-overview/data-overview.component';


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
        canActivate: [LoggedOnGuard],
        component: UserSettingsComponent
    },
    {
        path: 'data',
        children: [
            {
                path: 'agents/:id',
                title: agentViewTitleResolver,
                component: AgentViewComponent,
            },
            {
                path: '',
                pathMatch: 'full',
                component: DataOverviewComponent,
            }
        ],
    },
    {
        path: 'data-entry',
        canActivate: [ContributorGuard],
        children: [
            {
                path: 'agents/:id',
                title: agentFormTitleResolver,
                component: AgentFormComponent,
            },
            {
                path: 'gifts/:id',
                title: giftFormTitleResolver,
                component: GiftFormComponent,
            },
            {
                path: 'letters/:id',
                title: letterFormTitleResolver,
                component: LetterFormComponent,
            },
            {
                path: 'locations/:id',
                title: spaceFormTitleResolver,
                component: LocationFormComponent,
            },
            {
                path: 'sources',
                title: pageTitle('Data entry'),
                component: SourcesComponent
            },
            {
                path: 'sources/:id',
                title: sourceFormTitleResolver,
                component: SourceComponent
            },
            {
                path: 'episodes/:id',
                component: EpisodeFormComponent,
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
