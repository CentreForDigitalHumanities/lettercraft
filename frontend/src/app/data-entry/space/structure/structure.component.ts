import { Component } from '@angular/core';
import { faCheck, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lc-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss']
})
export class StructureComponent {
    icons = {
        info: faInfoCircle,
        confirm: faCheck,
    };
}
