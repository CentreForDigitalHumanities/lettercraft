import { AfterViewInit, Component, DestroyRef, ElementRef } from '@angular/core';
import { GLOSSARY } from './glossary';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { BehaviorSubject, filter, map, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import _ from 'underscore';

@Component({
    selector: 'lc-glossary',
    templateUrl: './glossary.component.html',
    styleUrl: './glossary.component.scss',
    standalone: false,
})
export class GlossaryComponent implements AfterViewInit {
    glossary = GLOSSARY;

    breadcrumbs: Breadcrumb[] = [
        { link: '/', label: 'Lettercraft' },
        { link: '.', label: 'Glossary' },
    ];

    focus$ = new BehaviorSubject<number | null>(null);

    constructor(
        private el: ElementRef<HTMLElement>,
        private destroy: DestroyRef
    ) {}

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
