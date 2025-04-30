import { Component, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiselectOption } from '../multiselect/multiselect.component';

@Component({
    selector: 'lc-label-select',
    templateUrl: './label-select.component.html',
    styleUrls: ['./label-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LabelSelectComponent),
            multi: true,
        },
    ],
})
export class LabelSelectComponent implements ControlValueAccessor {
    @Input({ required: true }) labels!: MultiselectOption[];

    value: string[] = [];

    private onChange?: (value: string[]) => any;
    private onTouched?: () => any;

    isSelected(label: MultiselectOption): boolean {
        return this.value.includes(label.value);
    }

    toggle(label: MultiselectOption): void {
        if (this.isSelected(label)) {
            this.value = this.value.filter(i => i !== label.value);
        } else {
            this.value.push(label.value);
        }
        this.onChange?.(this.value);
    }

    @HostListener('focusout')
    onFocusOut(): void {
        this.onTouched?.();
    }

    writeValue(obj: string[]): void {
        this.value = obj;
        this.onChange?.(this.value);
    }

    registerOnChange(fn: () => any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => any): void {
        this.onTouched = fn;
    }
}
