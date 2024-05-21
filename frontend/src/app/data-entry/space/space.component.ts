import { Component, TemplateRef } from '@angular/core';
import { faCancel, faCheck, faInfo, faInfoCircle, faPencil, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Component({
    selector: 'lc-space',
    templateUrl: './space.component.html',
    styleUrls: ['./space.component.scss'],
    providers: [NgbOffcanvas],
})
export class SpaceComponent {
    icons = {
        info: faInfoCircle,
        confirm: faCheck,
        cancel: faCancel,
        add: faPlus,
        remove: faTimes,
        edit: faPencil,
    }

    constructor(private offcanvasService: NgbOffcanvas) { }

    open(content: TemplateRef<any>) {
        this.offcanvasService.open(content, { position: 'end' });
    }
}
