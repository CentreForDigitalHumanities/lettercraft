import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignatorsControlComponent } from './designators-control.component';

describe('DesignatorsControlComponent', () => {
    let component: DesignatorsControlComponent;
    let fixture: ComponentFixture<DesignatorsControlComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DesignatorsControlComponent]
        });
        fixture = TestBed.createComponent(DesignatorsControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
