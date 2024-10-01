import { Component, HostBinding, Input } from '@angular/core';
import { actionIcons } from '@shared/icons';

let nextID = 0;

@Component({
    selector: 'lc-collapsible-card',
    templateUrl: './collapsible-card.component.html',
    styleUrls: ['./collapsible-card.component.scss']
})
export class CollapsibleCardComponent {
    /** text description of the content; used to render label for the collapse button */
    @Input() contentDescription = 'content';

    collapsed = true;

    @HostBinding('class.card') card = true;
    actionIcons = actionIcons;

    id = `collapsible-card-${nextID++}`;
    bodyID = this.id + '-body';
}
