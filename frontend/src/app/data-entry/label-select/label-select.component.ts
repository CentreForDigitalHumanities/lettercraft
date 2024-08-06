import { Component, computed, forwardRef, Input, signal } from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
} from "@angular/forms";

interface LabelOption {
    id: string;
    name: string;
}

const LABEL_OPTIONS: LabelOption[] = [
    {
        id: "1",
        name: "Writing",
    },
    {
        id: "2",
        name: "Receiving",
    },
    {
        id: "3",
        name: "Sending",
    },
    {
        id: "4",
        name: "Licking",
    },
];

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
    public control = new FormControl<string[]>([], { nonNullable: true });
    public disabled = false;

    public options: LabelOption[] = LABEL_OPTIONS;
    public selectedLabels = computed<LabelOption[]>(() => {
        const selected: LabelOption[] = [];
        this.control.value.forEach(id => {
            const option = this.options.find(option => option.id === id);
            if (option) {
                selected.push(option);
            }
        });
        return selected;
    });

    onChange: () => void = () => { return; };
    onTouch: () => void = () => { return; };

    writeValue(labelIds: string[]): void {
        // Implement the logic to set the value of the control
        // based on the provided object
        console.log('Writing value!'), labelIds;
        this.control.setValue(labelIds);
    }

    registerOnChange(fn: () => void): void {
        // Implement the logic to register the provided function
        // as the callback to be called when the value of the control changes
        console.log('Registering onChange!');
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        // Implement the logic to register the provided function
        // as the callback to be called when the control is touched
        console.log('Registering onTouched!');
        this.onTouch = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        // Implement the logic to set the disabled state of the control
        // based on the provided boolean value
        console.log('setting disabled state!');
        this.disabled = isDisabled;
    }
}
