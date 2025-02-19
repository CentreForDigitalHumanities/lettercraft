import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/app-routing.module';

import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { DataEntryModule } from './data-entry/data-entry.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataModule } from './data/data.module';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
    ],
    imports: [
        AppRoutingModule,
        SharedModule,
        CoreModule,
        UserModule,
        GraphQLModule,
        HttpClientModule,
        DataEntryModule,
        FontAwesomeModule,
        DataModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
