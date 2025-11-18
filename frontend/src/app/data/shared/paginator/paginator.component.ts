import { Component, Input } from "@angular/core";
import { PageResult } from "../../utils/pagination";

let nextID = 0;

@Component({
    templateUrl: './paginator.component.html',
    selector: 'lc-paginator',
    standalone: false,
})
export class PaginatorComponent<T> {
    @Input({ required: true }) pageResult!: PageResult<T>;

    id = nextID++;

    get labelID() { return `label-pagination-${this.id}`; }
}
