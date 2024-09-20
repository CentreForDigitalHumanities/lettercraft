import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgentComponent } from './create-agent.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { Subject } from 'rxjs';

describe('CreateAgentComponent', () => {
    let component: CreateAgentComponent;
    let fixture: ComponentFixture<CreateAgentComponent>;
    let create$: Subject<void>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CreateAgentComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(CreateAgentComponent);
        component = fixture.componentInstance;
        create$ = new Subject<void>();
        component.create = create$;
        component.sourceID = '1';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open a modal', () => {
        create$.next();
        expect(component.modal).toBeTruthy();
    })
});
