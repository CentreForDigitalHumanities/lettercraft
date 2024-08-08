import { Component, forwardRef, Input, OnInit } from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { MultiselectItem } from "../shared/multiselect/multiselect.component";
import { map, Observable, startWith } from "rxjs";
import { actionIcons } from "@shared/icons";

@Component({
    selector: "lc-label-select",
    templateUrl: "./label-select.component.html",
    styleUrls: ["./label-select.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LabelSelectComponent),
            multi: true,
        },
    ],
})
export class LabelSelectComponent implements ControlValueAccessor, OnInit {
    @Input({ required: true }) formControl!: FormControl<string[]>;
    @Input() options: MultiselectItem[] = [];

    public selectedLabels$: Observable<MultiselectItem[]> | null = null;

    public actionIcons = actionIcons;

    private onChange: ((value: string[]) => void) | null = null;
    private onTouched: (() => void) | null = null;

    ngOnInit(): void {
        this.selectedLabels$ = this.formControl.valueChanges.pipe(
            startWith(this.formControl.value),
            map((selectedIds) => {
                return this.options.filter((item) => {
                    return selectedIds.includes(item.id);
                });
            }),
        );
    }

    public removeLabel(labelId: string): void {
        const selectedIds = this.formControl.value.filter(id => id !== labelId);
        this.formControl.setValue(selectedIds);
        this.onChange && this.onChange(selectedIds);
        this.onTouched && this.onTouched();
    }

    public writeValue(value: string[]): void {
        this.formControl.setValue(value, { emitEvent: false });
    }

    public registerOnChange(fn: (value: string[]) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.formControl.disable();
        } else {
            this.formControl.enable();
        }
    }
}
