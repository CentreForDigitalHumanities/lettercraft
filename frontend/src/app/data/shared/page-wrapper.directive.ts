import { Component, Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { Observable } from 'rxjs';
import _ from 'underscore';
import { NOT_FOUND_BREADCRUMBS } from '../utils/breadcrumbs';

@Component({
    selector: 'lc-loading',
    template: `
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    `
})
export class DataLoadingComponent {}

@Component({
    selector: 'lc-loading',
    template: `
    <lc-breadcrumb [breadcrumbs]="breadcrumbs" />
    <lc-not-found />
    `
})
export class DataNotFoundComponent {
    breadcrumbs = NOT_FOUND_BREADCRUMBS;
}


@Directive({
    selector: '[lcDataPageWrapper]',
})
export class DataPageWrapperDirective implements OnInit {
    @Input({ required: true }) lcDataPageWrapperFrom!: Observable<any>;
    @Input({ required: true }) lcDataPageWrapperGet!: string;

    constructor(
        private templateRef: TemplateRef<Element>,
        private viewContainerRef: ViewContainerRef,
    ) { }

    ngOnInit() {
        this.viewContainerRef.createComponent(DataLoadingComponent);
        this.lcDataPageWrapperFrom.subscribe(data => {
            this.viewContainerRef.clear();
            if (_.get(data, this.lcDataPageWrapperGet)) {
                this.viewContainerRef.createEmbeddedView(this.templateRef, {
                    $implicit: data[this.lcDataPageWrapperGet]
                } as any);
            } else {
                this.viewContainerRef.createComponent(DataNotFoundComponent);
            }
        });
    }
}
