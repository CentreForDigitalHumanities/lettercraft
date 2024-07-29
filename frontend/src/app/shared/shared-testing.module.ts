import { NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from './shared.module';



@NgModule({
    imports: [
        SharedModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
    ], exports: [
        SharedModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
    ]
})
export class SharedTestingModule { }
