import { Component, Input } from '@angular/core';

/**
 * Wrapper for bootstrap icons
 *
 * See https://icons.getbootstrap.com/ to search the list of icons. Use `icon` input to
 * set the icon name.
 *
 * The contents of the icon are hidden for assistive technologies. If the icon is only
 * decorative, you can use it like this:
 *
 * ```html
 * <button class="btn">
 *     <lc-icon icon="pencil"></lc-icon>
 *     Edit
 * </button>
 * ```
 *
 * If there is no visible text, set the `title` or `aria-label` attribute:
 *
 * ```html
 * <button class="btn">
 *     <lc-icon icon="pencil" title="edit"></lc-icon>
 * </button>
 * ```
 */
@Component({
    selector: 'lc-icon',
    templateUrl: './icon.component.html',
})
export class IconComponent {
    @Input() icon: string | undefined;
}
