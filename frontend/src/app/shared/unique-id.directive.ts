import { Directive, HostBinding } from '@angular/core';

/**
 * Generates a unique `id` for the element in the DOM.
 *
 * This is especially useful if you want to reuse a component multiple times on a page.
 *
 * Example usage:
 *
 * ```html
 * <label [attr.for]="nameInput.id">Name</label>
 * <input type="text" lcUniqueID #nameInput>
 * ```
 */
@Directive({
    selector: '[lcUniqueID]'
})
export class UniqueIDDirective {
    @HostBinding('attr.id') id = crypto.randomUUID();
}
