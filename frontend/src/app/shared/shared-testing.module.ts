import { NgModule } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from './shared.module';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { DataEntrySharedModule } from '../data-entry/shared/data-entry-shared.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';



@NgModule({
    exports: [
        SharedModule,
        RouterTestingModule,
        ApolloTestingModule,
        DataEntrySharedModule,
    ],
    imports: [
        SharedModule,
        RouterTestingModule,
        DataEntrySharedModule
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()
    ]
})
export class SharedTestingModule { }
