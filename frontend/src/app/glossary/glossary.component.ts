import { AfterViewInit, Component, DestroyRef, ElementRef, OnInit } from '@angular/core';
import { APIGlossaryItem, parseGlossary } from './glossary';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { BehaviorSubject, filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import _ from 'underscore';
import { Request } from '../user/Request';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'lc-glossary',
    templateUrl: './glossary.component.html',
    styleUrl: './glossary.component.scss',
    standalone: false,
})
export class GlossaryComponent implements OnInit, AfterViewInit {

    itemsRequest = new Request<null, APIGlossaryItem[]>(
        this.http, '/api/glossary/item/', 'get'
    );
    glossary$ = this.itemsRequest.success$.pipe(
        map(parseGlossary),
    );

    breadcrumbs: Breadcrumb[] = [
        { link: '/', label: 'Lettercraft' },
        { link: '.', label: 'Glossary' },
    ];

    focus$ = new BehaviorSubject<number | null>(null);

    constructor(
        private http: HttpClient,
        private el: ElementRef<HTMLElement>,
        private destroy: DestroyRef
    ) {}

    ngOnInit() {
        this.itemsRequest.subject.next(null);
    }

    ngAfterViewInit(): void {
        this.focus$.pipe(
            takeUntilDestroyed(this.destroy),
            filter(_.negate(_.isNull)),
        ).subscribe((item) => this.activateFocus(item));
    }

    itemElementID(id: number) {
        return `item-${id}`;
    }

    focusItem(id: number) {
        this.focus$.next(id);
    }

    hasFocus$(id: number) {
        return this.focus$.pipe(
            map(value => value == id)
        );
    }

    private activateFocus(id: number) {
        const el: HTMLElement | null = this.el.nativeElement.querySelector(
            `#${this.itemElementID(id)}`
        );
        if (el) {
            el.focus();
        }
    }
}
