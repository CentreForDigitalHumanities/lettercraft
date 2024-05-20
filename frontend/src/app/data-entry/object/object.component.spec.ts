import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectComponent } from './object.component';
import { SharedTestingModule } from 'src/app/shared/shared-testing.module';

describe('ObjectComponent', () => {
    let component: ObjectComponent;
    let fixture: ComponentFixture<ObjectComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ObjectComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(ObjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
