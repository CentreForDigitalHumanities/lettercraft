import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightTextComponent } from './highlight-text.component';

describe('HighlightTextComponent', () => {
    let component: HighlightTextComponent;
    let fixture: ComponentFixture<HighlightTextComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HighlightTextComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HighlightTextComponent);
        fixture.componentRef.setInput('segments', [
            { text: 'frog and ', highlight: false },
            { text: 'toad', highlight: true },
            { text: ' are friends', highlight: false },
        ])
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
