import { Component } from '@angular/core';
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
}
