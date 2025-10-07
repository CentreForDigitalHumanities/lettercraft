import { Component, Input } from "@angular/core";
import { PageResult } from "../../utils/pagination";

@Component({
    templateUrl: './paginator.component.html',
    selector: 'lc-paginator',
    standalone: false,
})
export class PaginatorComponent<T> {
    @Input({ required: true }) pageResult!: PageResult<T>;
}
