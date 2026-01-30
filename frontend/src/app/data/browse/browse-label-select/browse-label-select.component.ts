import { Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { actionIcons } from '@shared/icons';
import { BrowseEpisodeCategoriesGQL } from 'generated/graphql';
import { map } from 'rxjs';

@Component({
    selector: 'lc-browse-label-select',
    templateUrl: './browse-label-select.component.html',
    styleUrl: './browse-label-select.component.scss',
    standalone: false,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: BrowseLabelSelectComponent,
            multi: true
        }
    ]
})
export class BrowseLabelSelectComponent implements ControlValueAccessor {
    public readonly actionIcons = actionIcons;

    public selectedLabelIds = signal<string[]>([]);

    public readonly allLabels = toSignal(this.labelsQuery.fetch().pipe(
        map(result => result.data.episodeCategories)
    ), { initialValue: [] });

    private onChange: (value: string[]) => void = () => { };
    private onTouched: () => void = () => { };

    constructor(private labelsQuery: BrowseEpisodeCategoriesGQL) { }

    // ControlValueAccessor implementation
    writeValue(value: string[]): void {
        if (value !== null && value !== undefined) {
            this.selectedLabelIds.set(value);
        }
        this.notifyParentAndMarkAsTouched();
    }

    registerOnChange(fn: (value: string[]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public toggleLabel(labelId: string): void {
        const currentIds = this.selectedLabelIds();
        const index = currentIds.indexOf(labelId);

        if (index > -1) {
            this.selectedLabelIds.set(currentIds.filter(id => id !== labelId));
        } else {
            this.selectedLabelIds.set([...currentIds, labelId]);
        }

        this.notifyParentAndMarkAsTouched();
    }

    public isLabelSelected(labelId: string): boolean {
        const ids = this.selectedLabelIds();
        return ids.includes(labelId);
    }

    public clearLabels(): void {
        this.selectedLabelIds.set([]);
        this.notifyParentAndMarkAsTouched();
    }

    public getLabelName(labelId: string): string {
        return this.allLabels().find(l => l.id === labelId)?.name || '';
    }

    public removeLabel(event: Event, labelId: string): void {
        event.stopPropagation();
        const currentIds = this.selectedLabelIds();
        this.selectedLabelIds.set(currentIds.filter(id => id !== labelId));
        this.notifyParentAndMarkAsTouched();
    }

    private notifyParentAndMarkAsTouched(): void {
        this.onChange(this.selectedLabelIds());
        this.onTouched();
    }

}
