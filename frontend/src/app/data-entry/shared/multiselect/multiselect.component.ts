import { Component, forwardRef, Input, signal, computed } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

export interface MultiselectOption {
    value: string;
    label: string;
}

@Component({
    selector: "lc-multiselect",
    templateUrl: "./multiselect.component.html",
    styleUrls: ["./multiselect.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiselectComponent),
            multi: true,
        },
    ],
})
export class MultiselectComponent implements ControlValueAccessor {
    // All available options to choose from.
    @Input() options: MultiselectOption[] = [];
    // Determines whether to show selected options in the list of selectable options.
    @Input() showSelected = false;
    // A placeholder to be shown when nothing has been selected.
    @Input() placeholderEmpty = "Select an option from the list below...";
    @Input() noAvailableOptions = "No options available";

    public selectedOptions = signal<string[]>([]);
    public disabled = false;
    public visibleOptions = computed(() => {
        return this.options.filter((option) => {
            if (this.showSelected) {
                return true;
            }
            return !this.selectedOptions().includes(option.value);
        });
    });

    private onChange: ((value: string[]) => void) | null = null;
    private onTouched: (() => void) | null = null;

    public selectOption(option: MultiselectOption): void {
        const selectedIds: string[] = this.selectedOptions();
        const index = selectedIds.indexOf(option.value);
        if (index !== -1) {
            selectedIds.splice(index, 1);
        } else {
            selectedIds.push(option.value);
        }
        // Propagate change to form control in view.
        this.selectedOptions.set(selectedIds);
        // Propagate change to parent component.
        this.onChange?.(selectedIds);
        this.onTouched?.();
    }

    public trackById(_index: number, option: MultiselectOption): string {
        return option.value;
    }

    public writeValue(value: string[]): void {
        this.selectedOptions.set(value);
    }

    public registerOnChange(fn: (value: string[]) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
