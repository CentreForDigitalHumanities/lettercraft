import { Component } from '@angular/core';
import { faPencil, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lc-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
    icons = {
        remove: faTimes,
        edit: faPencil,
        add: faPlus,
    };

    labels = [
        'writing',
        'reading',
        'secret communication',
        'penance',
    ];
}
