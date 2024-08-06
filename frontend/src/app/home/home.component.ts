import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MultiselectItem } from "../data-entry/shared/multiselect/multiselect.component";

const ITEMS: MultiselectItem[] = [
    {
        id: "1",
        label: "Writing",
    },
    {
        id: "2",
        label: "Receiving",
    },
    {
        id: "3",
        label: "Sending",
    },
    {
        id: "4",
        label: "Licking",
    },
];

@Component({
    selector: "lc-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    public control = new FormControl<string[]>([], { nonNullable: true });

    items = ITEMS;

    ngOnInit(): void {
        this.control.setValue(["1", "3"]);

        this.control.valueChanges.subscribe((value) =>
            console.log("New value:", value)
        );
    }

    test(): void {
        this.control.setValue(["2"])
    }
}
