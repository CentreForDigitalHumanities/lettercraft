import { Component, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { actionIcons } from '@shared/icons';

@Component({
    selector: 'lc-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.scss',
    standalone: false,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SearchBarComponent,
            multi: true
        }
    ]
})
export class SearchBarComponent implements ControlValueAccessor {
    loading = input<boolean>(false);

    public readonly actionIcons = actionIcons;

    public searchValue = signal<string>('');

    private onChange: (value: string) => void = () => { };
    private onTouched: () => void = () => { };

    constructor() { }

    public writeValue(value: string): void {
        if (value !== null && value !== undefined) {
            this.searchValue.set(value);
        }
        this.notifyParentAndMarkAsTouched();
    }

    public registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public onInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.searchValue.set(input.value);
        this.notifyParentAndMarkAsTouched();
    }

    public notifyParentAndMarkAsTouched(): void {
        this.onChange(this.searchValue());
        this.onTouched();
    }

}
