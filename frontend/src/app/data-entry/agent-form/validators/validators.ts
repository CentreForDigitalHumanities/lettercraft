import {
    ValidatorFn,
    AbstractControl,
    ValidationErrors,
    FormGroup,
} from "@angular/forms";

/**
 * Validator to verify that if the form represents a single person (isGroup is false),
 * the number of historical persons linked to this form should not be more than one.
 */
export function isGroupValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const form = control as FormGroup;
        const isGroup = form.get("isGroup")?.value;
        const numberOfHistoricalPersons = form.get(
            "numberOfHistoricalPersons"
        )?.value;

        if (isGroup === false && numberOfHistoricalPersons > 1) {
            return {
                numberOfHistoricalPersons:
                    "Single-person agents cannot be linked to multiple historical persons.",
            };
        }
        return null;
    };
}
