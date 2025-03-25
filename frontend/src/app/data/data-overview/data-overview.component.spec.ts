import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataOverviewComponent } from './data-overview.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('DataOverviewComponent', () => {
    let component: DataOverviewComponent;
    let fixture: ComponentFixture<DataOverviewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DataOverviewComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(DataOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
