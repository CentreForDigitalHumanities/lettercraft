import { Validators } from "@angular/forms";

/**
 * Validation for usernames
 *
 * Also enforced in the backend:
 * - max 150 characters
 * - letters, digits and `@.+-_` only
 */
export const usernameValidators = [
    Validators.maxLength(150),
    Validators.pattern(/^[\w@+-]+$/),
];

/**
 * Validation for passwords
*/
export const passwordValidators = [
    Validators.minLength(8),
];
