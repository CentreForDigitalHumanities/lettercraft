import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SourcesComponent } from './data-entry/sources/sources.component';
import { SourceComponent } from './data-entry/source/source.component';
import { AgentComponent } from './data-entry/agent/agent.component';
import { SpaceComponent } from './data-entry/space/space.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'data-entry',
        children: [
            {
                path: 'source/:sourceID/agent/:agentID',
                component: AgentComponent,
            },
            {
                path: 'source/:sourceID/space/:spaceID',
                component: SpaceComponent,
            },
            {
                path: 'source/:sourceID',
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
