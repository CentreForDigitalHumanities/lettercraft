import { Component, Input } from '@angular/core';

type Label=  { value: string, label: string };

@Component({
  selector: 'lc-label-select',
  templateUrl: './label-select.component.html',
  styleUrls: ['./label-select.component.scss']
})
export class LabelSelectComponent {
    @Input({required: true}) labels!: Label[];

    selection: string[] = [];

    isSelected(label: Label): boolean {
        return this.selection.includes(label.value);
    }

    toggle(label: Label): void {
        if (this.isSelected(label)) {
            this.selection = this.selection.filter(i => i !== label.value);
        } else {
            this.selection.push(label.value);
        }
    }
}
