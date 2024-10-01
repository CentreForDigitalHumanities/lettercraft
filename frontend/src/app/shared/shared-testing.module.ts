import { NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from './shared.module';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { DataEntrySharedModule } from '../data-entry/shared/data-entry-shared.module';


@NgModule({
    imports: [
        SharedModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        DataEntrySharedModule
    ], exports: [
        SharedModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        ApolloTestingModule,
        DataEntrySharedModule,
    ]
})
export class SharedTestingModule { }
