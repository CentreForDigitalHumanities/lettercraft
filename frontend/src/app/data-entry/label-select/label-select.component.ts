import { Component, computed, forwardRef } from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { actionIcons } from "@shared/icons";

interface LabelOption {
    id: string;
    name: string;
}



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
    public formControl = new FormControl<string[]>([], { nonNullable: true });
    public disabled = false;

    public options: LabelOption[] = [];
    public actionIcons = actionIcons;

    public selectedLabels = computed<LabelOption[]>(() => {
        const selected: LabelOption[] = [];
        this.formControl.value.forEach(id => {
            const option = this.options.find(option => option.id === id);
            if (option) {
                selected.push(option);
            }
        });
        return selected;
    });

    public removeLabel(labelId: string): void {
        this.formControl.setValue(
            this.formControl.value.filter(id => id !== labelId)
        );
    }

    constructor() {
        this.formControl.valueChanges.subscribe(value => {
            console.log('Selected:', value);
            this.onChange(value);
            this.onTouch(value);
        });
    }


    onChange: (_: unknown) => void = () => { return; };
    onTouch: (_: unknown) => void = () => { return; };

    writeValue(labelIds: string[]): void {
        // Implement the logic to set the value of the control
        // based on the provided object
        this.formControl.setValue(labelIds);
    }

    registerOnChange(fn: () => void): void {
        // Implement the logic to register the provided function
        // as the callback to be called when the value of the control changes
        console.log('ON change!');
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        // Implement the logic to register the provided function
        // as the callback to be called when the control is touched
        this.onTouch = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        // Implement the logic to set the disabled state of the control
        // based on the provided boolean value
        console.log('setting disabled state!');
        this.disabled = isDisabled;
    }
}
