import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SourcesComponent } from './data-entry/sources/sources.component';
import { SourceComponent } from './data-entry/source/source.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'data-entry',
        children: [
            {
                path: 'source/:id',
                component: SourceComponent,
            },
            {
                path: '',
                component: SourcesComponent,
            },
        ]
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];

export { routes };
