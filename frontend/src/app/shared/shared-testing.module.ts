import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        NoopAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,
    ], exports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        NoopAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,
    ]
})
export class SharedTestingModule { }
