import { Directive, ElementRef, HostListener } from "@angular/core";

/**
 * Directive to fix hash links for footnotes
 */
@Directive({
    selector: '[lcFootnotes]',
    standalone: false,
})
export class FootnotesDirective {
    constructor(
        private el: ElementRef<HTMLElement>,
    ) {}

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        const href = (event.target as HTMLAnchorElement).href;
        if (href) {
            const url = new URL(href);
            if (url.hash) {
                event.preventDefault();
                this.jumpTo(url.hash);
            }
        }
    }

    jumpTo(hash: string) {
        const target = this.findElement(hash);
        if (target) {
            target.focus();
        }
    }

    private findElement(hash: string): HTMLAnchorElement | null {
        const name = hash.replace('#', '');
        return this.el.nativeElement.querySelector(`${hash}, [name="${name}"]`)
    }
}
