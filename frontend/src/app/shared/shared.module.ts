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
import { CollapsibleCardComponent } from './collapsible-card/collapsible-card.component';



@NgModule({
    declarations: [
        IconComponent,
        BreadcrumbComponent,
        ActionButtonGroupComponent,
        CollapsibleCardComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken'
        }),
        NgbModule,
        RouterModule,
        ReactiveFormsModule,
    ],
    exports: [
        IconComponent,
        BreadcrumbComponent,
        ActionButtonGroupComponent,
        CollapsibleCardComponent,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientXsrfModule,
        NgbModule,
        RouterModule,
        ReactiveFormsModule,
    ],
})
export class SharedModule {}
