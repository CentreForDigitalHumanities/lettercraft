import { Component, Input } from "@angular/core";
import { PaginationResult } from "../../utils/base-pagination-result";

@Component({
    templateUrl: './paginator.component.html',
    selector: 'lc-paginator',
    standalone: false,
})
export class PaginatorComponent {
    // This component does not need to know the type of the data it paginates.
    @Input({ required: true }) pageResult!: PaginationResult<unknown>;
}
