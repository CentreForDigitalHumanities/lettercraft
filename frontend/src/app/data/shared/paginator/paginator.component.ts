import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";

// These are the only properties needed for the paginator. This interface is
// implemented by other classes that need to be paginated, such as PageResult.
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
