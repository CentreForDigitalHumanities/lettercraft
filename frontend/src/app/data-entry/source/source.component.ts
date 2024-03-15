import { Component } from '@angular/core';
import { faCaretDown, faCaretUp, faCube, faEnvelope, faHand, faLocationDot, faPencil, faPeopleGroup, faPerson, faPlus, faTrash, } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lc-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent {

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
