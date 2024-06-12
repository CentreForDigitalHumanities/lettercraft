import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SourcesComponent } from './data-entry/sources/sources.component';
import { SourceComponent } from './data-entry/source/source.component';
import { AgentComponent } from './data-entry/agent/agent.component';
import { SpaceComponent } from './data-entry/space/space.component';
import { ObjectComponent } from './data-entry/object/object.component';
import { EventComponent } from './data-entry/event/event.component';
import { SourceAltComponent } from './data-entry/source-alt/source-alt.component';
import { EpisodeAltComponent } from './data-entry/episode-alt/episode-alt.component';
import { AgentAltComponent } from './data-entry/agent-alt/agent-alt.component';
import { LoginComponent } from './user/login/login.component';
import { VerifyEmailComponent } from './user/verify-email/verify-email.component';
import { LocationComponent } from './data-entry/location/location.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'data-entry',
        children: [
            {
                path: 'source/1',
                children: [
                    {
                        path: 'agent/:agentID',
                        component: AgentComponent,
                    },
                    {
                        path: 'space/:spaceID',
                        component: SpaceComponent,
                    },
                    {
                        path: 'object/:objectID',
                        component: ObjectComponent,
                    },
                    {
                        path: 'event/:eventID',
                        component: EventComponent,
                    },
                    {
                        path: '',
                        component: SourceComponent,
                    }
                ]
            },
            {
                path: 'source/2',
                children: [
                    {
                        path: 'episode/:episodeID',
                        component: EpisodeAltComponent,
                    },
                    {
                        path: 'agent/:agentID',
                        component: AgentAltComponent,
                    },
                    {
                        path: 'location/:locationID',
                        component: LocationComponent,
                    },
                    {
                        path: '',
                        component: SourceAltComponent,
                    },
                ]
            },
            {
                path: '',
                component: SourcesComponent,
            },
        ],
    },
    {
        path: 'login',
        component: LoginComponent,
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
