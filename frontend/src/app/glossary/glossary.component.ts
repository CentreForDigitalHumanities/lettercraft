import { Component, ElementRef } from '@angular/core';
import { GLOSSARY } from './glossary';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';

@Component({
    selector: 'lc-glossary',
    templateUrl: './glossary.component.html',
    styleUrl: './glossary.component.scss',
    standalone: false,
})
export class GlossaryComponent {
    glossary = GLOSSARY;

    breadcrumbs: Breadcrumb[] = [
        { link: '/', label: 'Lettercraft' },
        { link: '.', label: 'Glossary' },
    ];

    constructor(
        private el: ElementRef<HTMLElement>,
    ) {}

    itemElementID(id: number) {
        return `item-${id}`;
    }

    focusItem(id: number) {
        const el: HTMLElement | null = this.el.nativeElement.querySelector(
            `#${this.itemElementID(id)}`
        );
        if (el) {
            el.focus();
        }
    }
}
