import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventComponent } from './event.component';
import { SharedTestingModule } from '../../shared/shared-testing.module';

describe('EventComponent', () => {
    let component: EventComponent;
    let fixture: ComponentFixture<EventComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EventComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(EventComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
