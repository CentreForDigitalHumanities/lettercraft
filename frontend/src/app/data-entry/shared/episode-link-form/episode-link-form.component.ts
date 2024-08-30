import { Component } from '@angular/core';
import { actionIcons } from '@shared/icons';

@Component({
    selector: 'lc-episode-link-form',
    templateUrl: './episode-link-form.component.html',
    styleUrls: ['./episode-link-form.component.scss']
})
export class EpisodeLinkFormComponent {
    actionIcons = actionIcons;
}
