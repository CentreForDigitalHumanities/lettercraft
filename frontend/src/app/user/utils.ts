import { FormGroup } from "@angular/forms";
import { User, UserResponse } from "./models/user";
import _ from 'underscore';
import { Observable, map } from "rxjs";

/* Transforms backend user response to User object
*
* @param result User response data
* @returns User object
*/
export const parseUserData = (result: UserResponse | null): User | null => {
    if (!result) {
        return null;
    }
    return new User(
        result.id,
        result.username,
        result.email,
        result.first_name,
        result.last_name,
        result.is_staff,
    );
}

/**
 * Transfroms User data to backend UserResponse object
 *
 * Because this is used for patching, the data can be partial
 *
 * @param data (partial) User object
 * @returns UserResponse object
 */
export const encodeUserData = (data: Partial<User>): Partial<UserResponse> => {
    const encoded: Partial<UserResponse> = {
        id: data.id,
        username: data.username,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        is_staff: data.isStaff,
    };
    return _.omit(encoded, _.isUndefined);
};


/**
 * Interprets backend validation errors and adds errors to their associated controls.
 *
 * Others are not tied to specific controls. These are added to the form itself with a generic 'invalid' key.
 *
 * @param errorObject - The error object containing the control names as keys and the corresponding error messages as values.
 * @param form - The form to which the errors should be added.
 */
export function setErrors(errorObject: Record<string, string>, form: FormGroup): void {
    for (const errorKey in errorObject) {
        const control = form.get(errorKey);
        const error = errorObject[errorKey];
        if (control) {
            control.setErrors({'invalid': error});
        } else {
            form.setErrors({'invalid': error});
        }
    }
}


/**
 * Watches a FormControl and turns its errors into an array of string messages.
 *
 * @param controlName - The name of the form control.
 * @param form - The FormGroup instance.
 * @param errorMessageMap - A mapping object that contains error messages for each control.
 * @returns An Observable that emits an array of error messages every time the control's status changes.
 */
export function controlErrorMessages$<T extends FormGroup, K extends string & keyof T['controls']>(controlName: K, form: T, errorMessageMap: Record<string, string>): Observable<string[]> {
    const control = form.controls[controlName];
    return control.statusChanges.pipe(
        map(() => {
            const errors = control.errors ?? {};
            const messages: string[] = Object.keys(errors)
                .map(errorKey => {
                    if (errorKey in errorMessageMap) {
                        return errorMessageMap[errorKey];
                    } else {
                        return errors[errorKey];
                    }
                });
            return messages;
        }),
    );
}

/**
 * Updates the validity of all controls in the given form and the form itself.
 *
 * @param form - The form group to update.
 */
export function updateFormValidity(form: FormGroup): void {
    Object.values(form.controls).forEach(control => {
        control.updateValueAndValidity();
    });
    form.updateValueAndValidity();
}
