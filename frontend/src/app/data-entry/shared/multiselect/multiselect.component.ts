import { Component, forwardRef, Input, OnInit } from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { map, Observable, startWith } from "rxjs";

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
    @Input({ required: true }) control!: FormControl<string[]>;
    @Input() options: MultiselectItem[] = [];
    @Input() showSelected = false;

    public visibleItems$: Observable<MultiselectItem[]> | null = null;

    private onChange: ((value: string[]) => void) | null = null;
    private onTouched: (() => void) | null = null;

    ngOnInit(): void {
        // this.control only becomes available in OnInit.
        this.visibleItems$ = this.control.valueChanges.pipe(
            map(selectedIds => {
                return this.options.filter(item => {
                    if (this.showSelected) {
                        return true;
                    }
                    return !selectedIds.includes(item.id);
                });
            }),
            startWith(this.options)
        );
    }

    public trackById(_index: number, item: MultiselectItem): string {
        return item.id;
    }

    public selectItem(item: MultiselectItem): void {
        const selectedIds: string[] = [...this.control.value];
        const index = selectedIds.indexOf(item.id);
        if (index !== -1) {
            selectedIds.splice(index, 1);
        } else {
            selectedIds.push(item.id);
        }
        this.control.setValue(selectedIds);
        this.onChange && this.onChange(selectedIds);
        this.onTouched && this.onTouched();
    }

    writeValue(value: string[]): void {
        this.control.setValue(value, { emitEvent: false });
    }

    registerOnChange(fn: (value: string[]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.control.disable();
        } else {
            this.control.enable();
        }
    }
}
