import { Component } from '@angular/core';
import { faAdd, faCancel, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'lc-object',
    templateUrl: './object.component.html',
    styleUrls: ['./object.component.scss']
})
export class ObjectComponent {
    icons = {
        confirm: faCheck,
        cancel: faCancel,
        remove: faTimes,
        add: faAdd,
    }

}
