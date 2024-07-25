import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { SourcesComponent } from './data-entry/sources/sources.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SourcesComponent,
        BreadcrumbComponent,
    ],
    imports: [
        AppRoutingModule,
        SharedModule,
        CoreModule,
        UserModule,
        GraphQLModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
