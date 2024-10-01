import { Component, Input } from "@angular/core";

export interface Breadcrumb {
    label: string;
    link: string;
}

@Component({
    selector: "lc-breadcrumb",
    templateUrl: "./breadcrumb.component.html",
    styleUrls: ["./breadcrumb.component.scss"],
})
export class BreadcrumbComponent {
    @Input() breadcrumbs: Breadcrumb[] = [];
}
