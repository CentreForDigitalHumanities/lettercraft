import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/app-routing.module';

import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from './graphql.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DataEntryModule } from './data-entry/data-entry.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataModule } from './data/data.module';
import { CaseStudiesModule } from './case-studies/case-studies.module';
import { ContributorsModule } from './contributors/contributors.module';
import { OmnibrowseComponent } from './data/omnibrowse/omnibrowse.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        OmnibrowseComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        AppRoutingModule,
        SharedModule,
        CoreModule,
        UserModule,
        GraphQLModule,
        DataEntryModule,
        FontAwesomeModule,
        DataModule,
        CaseStudiesModule,
        ContributorsModule,
    ],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }
