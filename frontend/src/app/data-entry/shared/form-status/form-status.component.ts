import { Component } from "@angular/core";
import { FormStatus } from "../types";
import { statusIcons } from "@shared/icons";
import { FormService } from "../form.service";

@Component({
    selector: 'lc-form-status',
    templateUrl: './form-status.component.html',
    styleUrls: ['./form-status.component.scss']
})
export class FormStatusComponent {
    public status$ = this.formService.status$;

    public statusIcons = statusIcons;

    constructor(private formService: FormService) {}

    messages: Record<FormStatus, string> = {
        idle: "No changes made",
        invalid: "Form contains errors",
        loading: "Loading...",
        saved: "Changes saved",
        error: "Saving failed",
    };

    classes: Record<FormStatus, string> = {
        idle: "text-secondary",
        invalid: "text-danger",
        loading: "text-secondary",
        saved: "text-success",
        error: "text-danger",
    };
}
