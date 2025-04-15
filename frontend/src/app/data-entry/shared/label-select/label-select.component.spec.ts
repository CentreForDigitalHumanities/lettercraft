import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelSelectComponent } from './label-select.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('LabelSelectComponent', () => {
    let component: LabelSelectComponent;
    let fixture: ComponentFixture<LabelSelectComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LabelSelectComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(LabelSelectComponent);
        component = fixture.componentInstance;
        component.labels = [
            { value: '1', label: 'Test' },
            { value: '2', label: 'Another test' },
        ];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
