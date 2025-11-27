import { NgModule } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from './shared.module';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { DataEntrySharedModule } from '../data-entry/shared/data-entry-shared.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


@NgModule({ exports: [
        SharedModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        ApolloTestingModule,
        DataEntrySharedModule,
    ], imports: [SharedModule,
        NoopAnimationsModule,
        RouterTestingModule,
        DataEntrySharedModule], providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()] })
export class SharedTestingModule { }
