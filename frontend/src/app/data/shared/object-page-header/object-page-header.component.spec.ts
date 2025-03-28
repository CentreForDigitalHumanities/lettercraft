import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectPageHeaderComponent } from './object-page-header.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('ObjectPageHeaderComponent', () => {
    let component: ObjectPageHeaderComponent;
    let fixture: ComponentFixture<ObjectPageHeaderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ObjectPageHeaderComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(ObjectPageHeaderComponent);
        component = fixture.componentInstance;
        component.object = {
            name: 'Test',
        }
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
