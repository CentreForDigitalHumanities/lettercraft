import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadComponent } from './download.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('DownloadComponent', () => {
    let component: DownloadComponent;
    let fixture: ComponentFixture<DownloadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DownloadComponent],
            imports: [SharedTestingModule],
        })
            .compileComponents();

        fixture = TestBed.createComponent(DownloadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
