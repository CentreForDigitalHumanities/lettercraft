import {
    Component,
    computed,
    DestroyRef,
    forwardRef,
    Input,
    OnInit,
} from "@angular/core";
import {
    FormControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { actionIcons } from "@shared/icons";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { MultiselectOption } from "../multiselect/multiselect.component";

export interface LabelSelectOption extends MultiselectOption {
    description: string;
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
export class LabelSelectComponent implements ControlValueAccessor, OnInit {
    @Input({ required: true }) options: LabelSelectOption[] = [];

    public control = new FormControl<string[]>([], { nonNullable: true });
    public actionIcons = actionIcons;

    public disabled = false;

    private onChange: ((value: string[]) => void) | null = null;
    private onTouched: (() => void) | null = null;

    public formValue = toSignal<string[]>(this.control.valueChanges);
    public selectedLabels = computed(() => {
        const selectedIds = this.formValue();
        return this.options.filter((item) => selectedIds?.includes(item.value));
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
            this.control.disable();
        } else {
            this.control.enable();
        }
    }

    constructor(private destroyRef: DestroyRef) {}

    ngOnInit(): void {
        this.control.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => {
                this.onTouched && this.onTouched();
                this.onChange && this.onChange(value);
            });
    }
}
