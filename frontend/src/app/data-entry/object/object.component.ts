import { Component } from '@angular/core';
import { faAdd, faCancel, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Category } from 'src/app/shared/types';

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

    categories: Category[] = [
        {
            label: 'Written by woman',
            selected: true
        },
        {
            label: 'Secret letter',
            selected: true
        },
        {
            label: 'Poem',
            selected: false
        },
        {
            label: 'Written by saint',
            selected: true
        },
        {
            label: 'Unknown author',
            selected: false
        }
    ];

    public selectCategory(category: Category): void {
        category.selected = !category.selected;
    }

}
