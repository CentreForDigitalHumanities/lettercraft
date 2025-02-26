import { Component, Input } from '@angular/core';

@Component({
  selector: 'lc-object-page-header',
  templateUrl: './object-page-header.component.html',
  styleUrls: ['./object-page-header.component.scss']
})
export class ObjectPageHeaderComponent {
    @Input({required: true}) object!: {
        name: string,
        description?: string;
        source?: {
            name: string,
        }
    };

    @Input() icon?: string;
}
