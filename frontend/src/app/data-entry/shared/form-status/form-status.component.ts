import { Component, Input } from '@angular/core';
import { FormStatus } from '../types';
import { Observable } from 'rxjs';
import { statusIcons } from '@shared/icons';

@Component({
    selector: 'lc-form-status',
    templateUrl: './form-status.component.html',
    styleUrls: ['./form-status.component.scss']
})
export class FormStatusComponent {
    @Input({ required: true }) status$!: Observable<FormStatus>;

    statusIcons = statusIcons;

    messages: Record<FormStatus, string> = {
        'idle': 'Waiting for input',
        'loading': 'Loading...',
        'saved': 'Changes saved',
        'error': 'Saving failed',
    };

    classes: Record<FormStatus, string> = {
        'idle': 'text-secondary',
        'loading': 'text-secondary',
        'saved': 'text-success',
        'error': 'text-danger',
    };
}
