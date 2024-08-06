import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
    selector: "lc-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    public control = new FormControl<string[]>([]);

    ngOnInit(): void {
        this.control.setValue(["1", "3"]);

        this.control.valueChanges.subscribe((value) =>
            console.log("New value:", value)
        );
    }
}
