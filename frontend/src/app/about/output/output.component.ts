import { Component } from '@angular/core';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'lc-output',
  standalone: false,
  templateUrl: './output.component.html',
  styleUrl: './output.component.scss',
})
export class OutputComponent {
    breadcrumbs: Breadcrumb[] = [
        { link: '/', label: 'Lettercraft' },
        { link: '.', label: 'Output' },
    ]
}
