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
import { MultiselectOption } from "../multiselect/multiselect.component";
import { actionIcons } from "@shared/icons";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";

@Component({
    selector: "lc-subspace-select",
    templateUrl: "./subspace-select.component.html",
    styleUrls: ["./subspace-select.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SubspaceSelectComponent),
            multi: true,
        },
    ],
})
export class SubspaceSelectComponent implements ControlValueAccessor, OnInit {
    @Input({ required: true }) subspaceType:
        | "region"
        | "settlement"
        | "structure" = "region";
    @Input({ required: true }) options: MultiselectOption[] = [];

    public control = new FormControl<string[]>([], { nonNullable: true });
    public actionIcons = actionIcons;

    private onChange: ((value: string[]) => void) | null = null;
    private onTouched: (() => void) | null = null;

    public formValue = toSignal<string[]>(this.control.valueChanges);
    public selectedSubspaces = computed(() => {
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

    public removeSubspace(id: string): void {
        const value = this.control.value.filter((item) => item !== id);
        this.control.setValue(value);
    }

    public writeValue(obj: string[]): void {
        this.control.setValue(obj);
    }

    public registerOnChange(fn: (value: string[] | null) => void): void {
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
