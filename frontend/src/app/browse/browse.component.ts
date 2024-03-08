import { Component } from '@angular/core';
import { faCaretUp, faCaretDown, faTrash, faPencil, faPlus, faPerson, faPeopleGroup, faLocationDot, faEnvelope, faCube, faHand } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lc-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent {

    icons = {
        hide: faCaretUp,
        show: faCaretDown,
        delete: faTrash,
        edit: faPencil,
        create: faPlus,
        person: faPerson,
        group: faPeopleGroup,
        place: faLocationDot,
        letter: faEnvelope,
        object: faCube,
        action: faHand,
    }
}
