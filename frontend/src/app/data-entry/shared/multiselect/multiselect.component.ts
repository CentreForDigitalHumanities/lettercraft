import { Component, computed, forwardRef, Input, signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export interface MultiselectItem {
    id: string;
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
    @Input() options: MultiselectItem[] = [];
    // Determines whether to show selected items in the list of selectable options.
    @Input() showSelected = false;
    // A placeholder to be shown when nothing has been selected.
    @Input() placeholderEmpty = "Select an option from the list below...";
    @Input() noAvailableOptions = "No options available";

    public selectedItems = signal<string[]>([]);
    public disabled = false;
    public visibleItems = computed(() => {
        return this.options.filter((item) => {
            if (this.showSelected) {
                return true;
            }
            return !this.selectedItems().includes(item.id);
        });
    });

    private onChange: ((value: string[]) => void) | null = null;
    private onTouched: (() => void) | null = null;

    public selectItem(item: MultiselectItem): void {
        const selectedIds: string[] = this.selectedItems();
        const index = selectedIds.indexOf(item.id);
        if (index !== -1) {
            selectedIds.splice(index, 1);
        } else {
            selectedIds.push(item.id);
        }
        // Propagate change to form control in view.
        this.selectedItems.set(selectedIds);
        // Propagate change to parent component.
        this.onChange?.(selectedIds);
        this.onTouched?.();
    }

    public trackById(_index: number, item: MultiselectItem): string {
        return item.id;
    }

    public writeValue(value: string[]): void {
        this.selectedItems.set(value);
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
