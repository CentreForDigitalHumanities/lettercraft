import { Component } from '@angular/core';
import { faCancel, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lc-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent {
    icons = {
        confirm: faCheck,
        cancel: faCancel,
        remove: faTimes,
    }
}
