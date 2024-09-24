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

    public statusIcons = statusIcons;

    public messages: Record<FormStatus, string> = {
        idle: 'No changes made',
        invalid: 'Form contains errors',
        loading: 'Loading...',
        saved: 'Changes saved',
        error: 'Saving failed',
    };

    public classes: Record<FormStatus, string> = {
        idle: 'text-secondary',
        invalid: 'text-danger',
        loading: 'text-secondary',
        saved: 'text-success',
        error: 'text-danger',
    };
}
