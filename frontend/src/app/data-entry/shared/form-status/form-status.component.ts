import { Component, Input } from '@angular/core';
import { FormStatus } from '../types';
import { Observable } from 'rxjs';

@Component({
    selector: 'lc-form-status',
    templateUrl: './form-status.component.html',
    styleUrls: ['./form-status.component.scss']
})
export class FormStatusComponent {
    @Input({ required: true }) status$!: Observable<FormStatus>;
}
