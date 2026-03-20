import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";

export interface Paginated {
    pageSize: number;
    totalSize$: Observable<number>;
    page: number;
}

@Component({
    templateUrl: './paginator.component.html',
    selector: 'lc-paginator',
    standalone: false,
})
export class PaginatorComponent {
    @Input({ required: true }) pageResult!: Paginated;
}
