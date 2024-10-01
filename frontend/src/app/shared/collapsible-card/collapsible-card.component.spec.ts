import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleCardComponent } from './collapsible-card.component';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@shared/icon/icon.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('CollapsibleCardComponent', () => {
    let component: CollapsibleCardComponent;
    let fixture: ComponentFixture<CollapsibleCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CollapsibleCardComponent, IconComponent],
            imports: [CommonModule, NgbModule],
        });
        fixture = TestBed.createComponent(CollapsibleCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
