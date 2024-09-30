import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEntityComponent } from './create-entity.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { Subject } from 'rxjs';
import { CreateEntityService } from './create-entity.service';
import { CreateAgentService } from './create-agent.service';
import { CreateGiftService } from './create-gift.service';
import { CreateLetterService } from './create-letter.service';
import { CreateSpaceService } from './create-space.service';

describe('CreateAgentComponent', () => {
    let component: CreateEntityComponent;
    let fixture: ComponentFixture<CreateEntityComponent>;
    let create$: Subject<void>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CreateEntityComponent],
            imports: [SharedTestingModule],
            providers: [CreateEntityService, CreateAgentService, CreateGiftService,
                CreateLetterService, CreateSpaceService],
        });
        fixture = TestBed.createComponent(CreateEntityComponent);
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
