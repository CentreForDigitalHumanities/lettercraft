import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAgentComponent } from './delete-agent.component';
import { FormService } from '../../shared/form.service';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('DeleteAgentComponent', () => {
    let component: DeleteAgentComponent;
    let fixture: ComponentFixture<DeleteAgentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DeleteAgentComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(DeleteAgentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
