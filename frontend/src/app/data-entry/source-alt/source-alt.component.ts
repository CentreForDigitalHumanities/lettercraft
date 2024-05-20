import { Component } from '@angular/core';
import { faBookmark, faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { episodes } from './source-data';

/** alternative workflow implementation */
@Component({
    selector: 'lc-source-alt',
    templateUrl: './source-alt.component.html',
    styleUrls: ['./source-alt.component.scss']
})
export class SourceAltComponent {

    icons = {
        edit: faPencil,
        delete: faTrash,
        create: faPlus,
        action: faBookmark,
    }

    episodes = episodes;

}
