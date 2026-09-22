import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinciplesComponent } from './principles.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('PrinciplesComponent', () => {
    let component: PrinciplesComponent;
    let fixture: ComponentFixture<PrinciplesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PrinciplesComponent],
            imports: [SharedTestingModule],
        })
            .compileComponents();

        fixture = TestBed.createComponent(PrinciplesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
