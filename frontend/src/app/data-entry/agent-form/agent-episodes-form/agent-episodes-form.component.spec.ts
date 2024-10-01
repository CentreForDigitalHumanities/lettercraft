import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentEpisodesFormComponent } from './agent-episodes-form.component';
import { FormService } from '../../shared/form.service';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('AgentEpisodesFormComponent', () => {
    let component: AgentEpisodesFormComponent;
    let fixture: ComponentFixture<AgentEpisodesFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AgentEpisodesFormComponent],
            providers: [FormService],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(AgentEpisodesFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
