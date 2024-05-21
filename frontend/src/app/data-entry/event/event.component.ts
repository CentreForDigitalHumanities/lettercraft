import { Component } from '@angular/core';
import { faPencil, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Category } from 'src/app/shared/types';

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

    categories: Category[] = [
        {
            label: 'Delivery',
            selected: true
        },
        {
            label: 'Secret communication',
            selected: false
        },
        {
            label: 'Public reading',
            selected: true
        },
        {
            label: 'Writing',
            selected: false
        },
        {
            label: 'Penance',
            selected: false
        },
        {
            label: 'Excommunication',
            selected: false
        },
        {
            label: 'Deliberate destruction',
            selected: false
        },
        {
            label: 'Healing',
            selected: false
        }
    ];

    public selectCategory(category: Category): void {
        category.selected = !category.selected;
    }
}
