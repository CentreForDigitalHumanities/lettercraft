import { Component, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { icons } from '@shared/icons';

@Component({
    selector: 'lc-space',
    templateUrl: './space.component.html',
    styleUrls: ['./space.component.scss'],
    providers: [NgbOffcanvas],
})
export class SpaceComponent {
    icons = icons;

    constructor(private offcanvasService: NgbOffcanvas) { }

    open(content: TemplateRef<any>) {
        this.offcanvasService.open(content, { position: 'end' });
    }
}
