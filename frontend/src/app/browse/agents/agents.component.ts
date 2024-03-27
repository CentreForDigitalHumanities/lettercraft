import { Component } from '@angular/core';
import { faCaretUp, faCaretDown, faTrash, faPencil, faPlus, faPerson, faPeopleGroup, faLocationDot, faEnvelope, faCube, faHand, faFilter, faSortAlphaAsc, faSortAmountAsc, faVenus, faMars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lc-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent {

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
        filter: faFilter,
        sort: faSortAlphaAsc,
        sortNum: faSortAmountAsc,
        female: faVenus,
        male: faMars
    }

}
