import { Component, EventEmitter, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { actionIcons } from "@shared/icons";
import { Observable } from "rxjs";

@Component({
    selector: "lc-search-bar",
    templateUrl: "./search-bar.component.html",
    styleUrls: ["./search-bar.component.scss"],
})
export class SearchBarComponent {
    @Input({ required: true })
    public searchControl!: FormControl<string>;

    @Input({ required: true })
    public loading$!: Observable<boolean>;

    public actionIcons = actionIcons;

    public clearSearch(): void {
        this.searchControl.setValue("");
    }
}
