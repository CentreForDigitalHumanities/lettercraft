import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from './icon/icon.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ActionButtonGroupComponent } from './action-button-group/action-button-group.component';
import { BaseModalComponent } from "./base-modal/base-modal.component";
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ContributorsComponent } from './contributors/contributors.component';
import { CollapsibleCardComponent } from './collapsible-card/collapsible-card.component';
import { OrderButtonGroupComponent } from './order-button-group/order-button-group.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SentenceCasePipe } from './sentence-case.pipe';
import { NotFoundComponent } from './not-found/not-found.component';



@NgModule({
    declarations: [
        IconComponent,
        BreadcrumbComponent,
        ActionButtonGroupComponent,
        BaseModalComponent,
        ConfirmationModalComponent,
        ContributorsComponent,
        CollapsibleCardComponent,
        OrderButtonGroupComponent,
        SentenceCasePipe,
        NotFoundComponent,
    ],
    exports: [
        IconComponent,
        BreadcrumbComponent,
        BaseModalComponent,
        ConfirmationModalComponent,
        ActionButtonGroupComponent,
        ContributorsComponent,
        CollapsibleCardComponent,
        OrderButtonGroupComponent,
        NotFoundComponent,
        SentenceCasePipe,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        NgbModule,
        RouterModule,
        ReactiveFormsModule,
        FontAwesomeModule,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        NgbModule,
        RouterModule,
        ReactiveFormsModule,
        FontAwesomeModule
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi(), withXsrfConfiguration({
            cookieName: "csrftoken",
            headerName: "X-CSRFToken",
        })),
    ]
})
export class SharedModule { }
