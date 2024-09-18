import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from './icon/icon.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ActionButtonGroupComponent } from './action-button-group/action-button-group.component';
import { BaseModalComponent } from "./base-modal/base-modal.component";
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ContributorsComponent } from './contributors/contributors.component';



@NgModule({
    declarations: [
        IconComponent,
        BreadcrumbComponent,
        ActionButtonGroupComponent,
        BaseModalComponent,
        ConfirmationModalComponent,
        ContributorsComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: "csrftoken",
            headerName: "X-CSRFToken",
        }),
        NgbModule,
        RouterModule,
        ReactiveFormsModule,
    ],
    exports: [
        IconComponent,
        BreadcrumbComponent,
        ActionButtonGroupComponent,
        ContributorsComponent,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientXsrfModule,
        NgbModule,
        RouterModule,
        ReactiveFormsModule,
        BaseModalComponent,
    ],
})
export class SharedModule {}
