import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAgentFormComponent } from './new-agent-form.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('NewAgentFormComponent', () => {
    let component: NewAgentFormComponent;
    let fixture: ComponentFixture<NewAgentFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NewAgentFormComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(NewAgentFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
