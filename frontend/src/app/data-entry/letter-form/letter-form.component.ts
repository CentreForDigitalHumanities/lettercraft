import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { dataIcons } from '@shared/icons';
import { DataEntryLetterGQL, DataEntryLetterQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';

@Component({
    selector: 'lc-letter-form',
    templateUrl: './letter-form.component.html',
    styleUrls: ['./letter-form.component.scss']
})
export class LetterFormComponent {
    id$: Observable<string>;
    data$: Observable<DataEntryLetterQuery>;

    dataIcons = dataIcons;

    constructor(private route: ActivatedRoute, private letterQuery: DataEntryLetterGQL) {
        this.id$ = this.route.params.pipe(
            map(params => params['id']),
        );
        this.data$ = this.id$.pipe(
            switchMap(id => this.letterQuery.watch({ id }).valueChanges),
            map(result => result.data),
        );
    }

    getBreadcrumbs(data: DataEntryLetterQuery): Breadcrumb[] {
        if (data.letterDescription) {
            return [
                { link: '/', label: 'Lettercraft' },
                { link: '/data-entry', label: 'Data entry' },
                {
                    link: `/data-entry/sources/${data.letterDescription.source.id}`,
                    label: data.letterDescription.source.name
                },
                {
                    link: `/data-entry/letters/${data.letterDescription.id}`,
                    label: data.letterDescription.name
                },
            ];
        } else {
            return [
                { link: '/', label: 'Lettercraft' },
                { link: '/data-entry', label: 'Data entry' },
                { link: '', label: 'Letter not found' }
            ]
        }
    }

}
