import { Component, forwardRef, Input, OnInit } from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { map, Observable, startWith, tap } from "rxjs";

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
export class MultiselectComponent implements ControlValueAccessor, OnInit {
    @Input({ required: true }) formControl!: FormControl<string[]>;
    // All available options to choose from.
    @Input() options: MultiselectItem[] = [];
    // Determines whether to show selected items in the list of selectable options.
    @Input() showSelected = false;
    // A placeholder to be shown when nothing has been selected.
    @Input() placeholderEmpty = "Select an option from the list below...";
    @Input() noAvailableOptions = "No options available";

    public visibleItems$: Observable<MultiselectItem[]> | null = null;

    private onChange: ((value: string[]) => void) | null = null;
    private onTouched: (() => void) | null = null;

    ngOnInit(): void {
        // this.control only becomes available in OnInit.
        this.visibleItems$ = this.formControl.valueChanges.pipe(
            startWith(this.formControl.value),
            map((selectedIds) => {
                return this.options.filter((item) => {
                    if (this.showSelected) {
                        return true;
                    }
                    return !selectedIds.includes(item.id);
                });
            })
        );
    }

    public selectItem(item: MultiselectItem): void {
        const selectedIds: string[] = [...this.formControl.value];
        const index = selectedIds.indexOf(item.id);
        if (index !== -1) {
            selectedIds.splice(index, 1);
        } else {
            selectedIds.push(item.id);
        }
        this.onChange && this.onChange(selectedIds);
        this.onTouched && this.onTouched();
    }

    public selectedString(): string {
        return this.formControl.value
            .map((id) => {
                const item = this.options.find((item) => item.id === id);
                return item ? item.label : "";
            })
            .join(", ");
    }

    public trackById(_index: number, item: MultiselectItem): string {
        return item.id;
    }

    public writeValue(value: string[]): void {
        if (this.formControl.value !== value) {
            this.formControl.setValue(value, { emitEvent: false });
        }
    }

    public registerOnChange(fn: (value: string[]) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled && this.formControl.enabled) {
            this.formControl.disable();
        } else if (!isDisabled && this.formControl.disabled) {
            this.formControl.enable();
        }
    }
}
