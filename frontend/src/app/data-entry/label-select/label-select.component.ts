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
})
export class LabelSelectComponent implements OnInit {
    @Input({ required: true }) control!: FormControl<string[]>;
    @Input() options: MultiselectItem[] = [];

    public selectedLabels$: Observable<MultiselectItem[]> | null = null;
    public actionIcons = actionIcons;

    ngOnInit(): void {
        this.selectedLabels$ = this.control.valueChanges.pipe(
            startWith(this.control.value),
            map((selectedIds) => {
                return this.options.filter((item) => {
                    return selectedIds.includes(item.id);
                });
            }),
        );
    }

    public removeLabel(labelId: string): void {
        const selectedIds = this.control.value.filter(id => id !== labelId);
        this.control.setValue(selectedIds);
    }
}
