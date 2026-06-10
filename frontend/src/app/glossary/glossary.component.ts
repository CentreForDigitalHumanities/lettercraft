import { AfterViewInit, Component, DestroyRef, ElementRef, OnInit } from '@angular/core';
import { APIGlossaryItem, APIGlossaryReference, parseGlossary, parseReferences } from './glossary';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { BehaviorSubject, filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import _ from 'underscore';
import { Request } from '../user/Request';
import { HttpClient } from '@angular/common/http';

type Section = 'glossary' | 'references';

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
    refRequest = new Request<null, APIGlossaryReference[]>(
        this.http, '/api/glossary/reference/', 'get'
    );
    references$ = this.refRequest.success$.pipe(
        map(parseReferences)
    );

    breadcrumbs: Breadcrumb[] = [
        { link: '/', label: 'Lettercraft' },
        { link: '.', label: 'Glossary' },
    ];

    focus$ = new BehaviorSubject<[Section, number] | null>(null);

    constructor(
        private http: HttpClient,
        private el: ElementRef<HTMLElement>,
        private destroy: DestroyRef
    ) {}

    ngOnInit() {
        this.itemsRequest.subject.next(null);
        this.refRequest.subject.next(null);
    }

    ngAfterViewInit(): void {
        this.focus$.pipe(
            takeUntilDestroyed(this.destroy),
            filter(_.negate(_.isNull)),
        ).subscribe((item: [Section, number]) => this.activateFocus(...item));
    }

    itemElementID(section: Section, id: number) {
        return `item-${section}-${id}`;
    }

    focusItem(section: Section, id: number) {
        this.focus$.next([section, id]);
    }

    hasFocus$(section: Section, id: number) {
        return this.focus$.pipe(
            map(value => value && value[0] == section && value[1] == id)
        );
    }

    private activateFocus(section: Section, id: number) {
        const el: HTMLElement | null = this.el.nativeElement.querySelector(
            `#${this.itemElementID(section, id)}`
        );
        if (el) {
            el.focus();
        }
    }
}
