import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputComponent } from './output.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('OutputComponent', () => {
    let component: OutputComponent;
    let fixture: ComponentFixture<OutputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OutputComponent],
            imports: [SharedTestingModule],
        })
            .compileComponents();

        fixture = TestBed.createComponent(OutputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
