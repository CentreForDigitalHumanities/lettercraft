import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorComponent } from './contributor.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('ContributorComponent', () => {
    let component: ContributorComponent;
    let fixture: ComponentFixture<ContributorComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ContributorComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(ContributorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
