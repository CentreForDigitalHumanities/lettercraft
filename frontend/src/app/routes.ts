import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SourcesComponent } from './data-entry/sources/sources.component';
import { SourceComponent } from './data-entry/source/source.component';
import { AgentComponent } from './data-entry/agent/agent.component';
import { BrowseComponent } from './browse/browse.component';
import { AgentDetailComponent } from './browse/agent-detail/agent-detail.component';
import { AgentsComponent } from './browse/agents/agents.component';

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
        path: 'browse',
        children: [
            {
                path: 'agents/:agentID',
                component: AgentDetailComponent,
            },
            {
                path: 'agents',
                component: AgentsComponent,
            },
            {
                path: '',
                component: BrowseComponent,
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
