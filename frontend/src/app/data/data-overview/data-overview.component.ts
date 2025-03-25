import { Component } from '@angular/core';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';

@Component({
    selector: 'lc-data-overview',
    templateUrl: './data-overview.component.html',
    styleUrls: ['./data-overview.component.scss'],
})
export class DataOverviewComponent {
    breadcrumbs: Breadcrumb[] = [
        { link: '/', label: 'Lettercraft' },
        { link: '/data', label: 'Browse data' },
    ];
}
