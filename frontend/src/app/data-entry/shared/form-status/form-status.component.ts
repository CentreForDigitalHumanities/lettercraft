import { Component, Input } from '@angular/core';
import { FormStatus } from '../types';

@Component({
    selector: 'lc-form-status',
    templateUrl: './form-status.component.html',
    styleUrls: ['./form-status.component.scss']
})
export class FormStatusComponent {
    @Input({ required: true }) status!: FormStatus;
}
