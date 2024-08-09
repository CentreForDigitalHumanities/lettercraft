import { Component, computed, forwardRef, Input } from "@angular/core";
import {
    FormControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { actionIcons } from "@shared/icons";
import { toSignal } from "@angular/core/rxjs-interop";
import { MultiselectOption } from "../multiselect/multiselect.component";

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
export class LabelSelectComponent implements ControlValueAccessor {
    @Input() options: MultiselectOption[] = [];

    public control = new FormControl<string[]>([], { nonNullable: true });
    public actionIcons = actionIcons;

    public disabled = false;

    private onChange: ((value: string[]) => void) | null = null;
    private onTouched: (() => void) | null = null;

    public formValue = toSignal<string[]>(this.control.valueChanges);
    public selectedLabels = computed(() => {
        const selectedIds = this.formValue();
        return this.options.filter((item) => selectedIds?.includes(item.id));
    });

    public removeLabel(labelId: string): void {
        const selectedIds = this.control.value.filter((id) => id !== labelId);
        this.control.setValue(selectedIds);
    }

    public writeValue(value: string[]): void {
        this.control.setValue(value);
    }

    public registerOnChange(fn: (value: string[]) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.control.enable();
        } else {
            this.control.disable();
        }
    }
}
