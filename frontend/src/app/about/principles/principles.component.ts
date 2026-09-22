import { Component } from '@angular/core';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';

@Component({
    selector: 'lc-principles',
    templateUrl: './principles.component.html',
    styleUrl: './principles.component.scss',
    standalone: false,
})
export class PrinciplesComponent {
    breadcrumbs: Breadcrumb[] = [
        { link: '/', label: 'Lettercraft' },
        { link: '.', label: 'Principles' },
    ]
}
