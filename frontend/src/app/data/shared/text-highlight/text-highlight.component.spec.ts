import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextHighlightComponent } from './text-highlight.component';

describe('TextHighlightComponent', () => {
    let component: TextHighlightComponent;
    let fixture: ComponentFixture<TextHighlightComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TextHighlightComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TextHighlightComponent);
        fixture.componentRef.setInput('text', 'frog and toad are friends');
        fixture.componentRef.setInput('query', 'toad');
        fixture.detectChanges();
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
