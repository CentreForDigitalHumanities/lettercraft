import { Component, Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { Observable } from 'rxjs';
import _ from 'underscore';
import { NOT_FOUND_BREADCRUMBS } from '../utils/breadcrumbs';

@Component({
    template: `
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    `
})
export class DataLoadingComponent {}

@Component({
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
export class DataPageWrapperDirective<Data extends object> implements OnInit {
    @Input({ required: true }) lcDataPageWrapperFrom!: Observable<Data>;
    @Input({ required: true }) lcDataPageWrapperGet!: string;

    constructor(
        private templateRef: TemplateRef<Element>,
        private viewContainerRef: ViewContainerRef,
    ) { }

    ngOnInit() {
        this.viewContainerRef.createComponent(DataLoadingComponent);
        this.lcDataPageWrapperFrom.subscribe(data => {
            this.viewContainerRef.clear();
            const instance =  _.get(data, this.lcDataPageWrapperGet);
            if (instance) {
                this.viewContainerRef.createEmbeddedView(this.templateRef, {
                    $implicit: instance
                } as any);
            } else {
                this.viewContainerRef.createComponent(DataNotFoundComponent);
            }
        });
    }
}
