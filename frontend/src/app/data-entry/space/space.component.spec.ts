import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceComponent } from './space.component';
import { SharedTestingModule } from '../../shared/shared-testing.module';

describe('SpaceComponent', () => {
    let component: SpaceComponent;
    let fixture: ComponentFixture<SpaceComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SpaceComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(SpaceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
