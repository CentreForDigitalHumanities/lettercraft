import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

/**
 * Validation for usernames
 *
 * Also enforced in the backend:
 * - max 150 characters
 * - letters, digits and `@.+-_` only
 */
export const usernameValidators = [
    Validators.minLength(3),
    Validators.maxLength(150),
    Validators.pattern(/^[\w@+-]+$/),
];

/**
 * Validation for passwords
*/
export const passwordValidators = [
    Validators.minLength(8),
];



/**
 * Validates that two password fields have identical values.
 *
 * @param form - The form control containing at least two controls named `password1` and `password2`.
 * @returns A `ValidationErrors` object if the passwords do not match, otherwise `null`.
 */
export const identicalPasswordsValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password1 = form.get('password1');
    const password2 = form.get('password2');

    if (!password1?.value || !password2?.value) {
        return null;
    }

    return password1.value === password2.value ? null : { 'passwords': 'Passwords do not match' };
};
