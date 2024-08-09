import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignatorsControlComponent } from './designators-control.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('DesignatorsControlComponent', () => {
    let component: DesignatorsControlComponent;
    let fixture: ComponentFixture<DesignatorsControlComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DesignatorsControlComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(DesignatorsControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
