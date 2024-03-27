import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { DataEntryModule } from './data-entry/data-entry.module';
import { BrowseComponent } from './browse/browse.component';
import { AgentsComponent } from './browse/agents/agents.component';
import { AgentDetailComponent } from './browse/agent-detail/agent-detail.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        BrowseComponent,
        AgentsComponent,
        AgentDetailComponent
    ],
    imports: [
        AppRoutingModule,
        SharedModule,
        CoreModule,
        DataEntryModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
