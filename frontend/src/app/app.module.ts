import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { DataEntryModule } from './data-entry/data-entry.module';
import { UserModule } from './user/user.module';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        AppRoutingModule,
        SharedModule,
        CoreModule,
        DataEntryModule,
        UserModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
