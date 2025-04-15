import { Component, Input } from '@angular/core';

@Component({
  selector: 'lc-label-select',
  templateUrl: './label-select.component.html',
  styleUrls: ['./label-select.component.scss']
})
export class LabelSelectComponent {
    @Input({required: true}) labels!: { label: string }[];
}
