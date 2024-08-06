import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { actionIcons } from '@shared/icons';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import _ from 'underscore';

@Component({
    selector: 'lc-designators-control',
    templateUrl: './designators-control.component.html',
    styleUrls: ['./designators-control.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DesignatorsControlComponent),
            multi: true,
        }
    ],
})
export class DesignatorsControlComponent implements ControlValueAccessor, OnDestroy {
    @Input({ required: true }) formControl!: FormControl<string[]>;

    designators$ = new BehaviorSubject<string[]>([]);
    blur$ = new Subject<void>();
    disabled = false;

    addForm = new FormGroup({
        designator: new FormControl<string>('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(1),
            ]
        })
    });

    actionIcons = actionIcons;

    private onChangeSubscription?: Subscription;
    private onTouchedSubscription?: Subscription;

    writeValue(obj: string[]): void {
        this.designators$.next(obj);
    }

    registerOnChange(fn: (_: unknown) => void): void {
        this.onChangeSubscription?.unsubscribe();
        this.onChangeSubscription = this.designators$.subscribe(fn);
    }

    registerOnTouched(fn: (_: unknown) => void): void {
        this.onTouchedSubscription?.unsubscribe();
        this.onTouchedSubscription = this.blur$.subscribe(fn);
    }

    ngOnDestroy(): void {
        this.designators$.complete();
        this.blur$.complete();
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        if (isDisabled) {
            this.addForm.disable();
        } else {
            this.addForm.enable();
        }
    }

    onAddFormSubmit() {
        if (this.addForm.valid) {
            const designator = this.addForm.controls.designator.value;
            this.designators$.next(this.designators$.value.concat([designator]));
            this.addForm.reset({ designator: '' });
        }
    }

    removeDesignator(index: number) {
        const spliced = _.clone(this.designators$.value)
        spliced.splice(index, 1);
        this.designators$.next(spliced);
    }

    designatorRemoveLabel(designator: string): string {
        return `remove designator "${designator}"`;
    }
}
