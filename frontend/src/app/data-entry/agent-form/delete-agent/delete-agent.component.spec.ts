import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAgentComponent } from './delete-agent.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { FormService } from '../../shared/form.service';

describe('DeleteAgentComponent', () => {
    let component: DeleteAgentComponent;
    let fixture: ComponentFixture<DeleteAgentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DeleteAgentComponent],
            providers: [FormService],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(DeleteAgentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
