import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from './contributors-list.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('ContributorsListComponent', () => {
    let component: ContributorsListComponent;
    let fixture: ComponentFixture<ContributorsListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ContributorsListComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(ContributorsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
