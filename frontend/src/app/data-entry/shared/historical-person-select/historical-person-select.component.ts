import {
    Component,
    computed,
    DestroyRef,
    forwardRef,
    Input,
    OnInit,
} from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { actionIcons } from "@shared/icons";
import { MultiselectOption } from "../multiselect/multiselect.component";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";

@Component({
    selector: "lc-historical-person-select",
    templateUrl: "./historical-person-select.component.html",
    styleUrls: ["./historical-person-select.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => HistoricalPersonSelectComponent),
            multi: true,
        },
    ],
})
export class HistoricalPersonSelectComponent
    implements ControlValueAccessor, OnInit
{
    @Input() multiple = false;
    @Input({ required: true }) options: MultiselectOption[] = [];

    public control = new FormControl<string[]>([], { nonNullable: true });
    public actionIcons = actionIcons;

    private onChange: ((value: string[]) => void) | null = null;
    private onTouched: (() => void) | null = null;

    public formValue = toSignal<string[]>(this.control.valueChanges);
    public selectedPersons = computed(() => {
        const selectedIds = this.formValue();
        return this.options.filter((item) => selectedIds?.includes(item.value));
    });

    constructor(private destroyRef: DestroyRef) {}

    ngOnInit(): void {
        this.control.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => {
                if (this.onTouched) {
                    this.onTouched();
                }
                if (this.onChange) {
                    this.onChange(value);
                }
            });
    }

    public removePerson(id: string): void {
        const newValue = this.control.value.filter((item) => item !== id);
        this.control.setValue(newValue);
    }

    public writeValue(obj: string[]): void {
        const newValue =
            obj.length > 0 && this.multiple === false ? [obj[0]] : obj;
        this.control.setValue(newValue);
    }

    public registerOnChange(fn: (value: string[] | null) => void): void {
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
}
