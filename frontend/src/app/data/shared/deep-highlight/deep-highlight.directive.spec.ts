import { Component, signal, viewChild } from '@angular/core';
import { DeepHighlightDirective } from './deep-highlight.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightService } from '@services/highlight.service';
import _ from 'underscore';


@Component({
    template: `
    <div lcDeepHighlight [query]="query()">
        <p>This is an <i>example</i> for testing.</p>
        <p>This is another <i>test</i> paragraph.</p>
    </div>
    `,
    imports: [DeepHighlightDirective],
    providers: [HighlightService],
})
class HighlightTestComponent {
    query = signal<string>('');
    directive = viewChild(DeepHighlightDirective);
}

describe('DeepHighlightDirective', () => {
    let fixture: ComponentFixture<HighlightTestComponent>;
    let component: HighlightTestComponent;

    beforeEach(async () => {
        fixture = TestBed.createComponent(HighlightTestComponent);
        component = fixture.componentInstance;
    });

    it('creates an instance', () => {
        expect(component).toBeTruthy();
    });

    it('updates highlight ranges', () => {
        component.query.set('test');
        fixture.detectChanges();
        const highlight = (CSS.highlights as unknown as any).entries().next().value;
        expect(highlight).toBeTruthy();
        const first = highlight.entries().next().value;
        expect(first).toBeTruthy();
        const second = highlight.entries().next().value;
        expect(second).toBeTruthy();
    });
});
