import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeLinkFormComponent } from './episode-link-form.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { DataEntrySharedModule } from '../data-entry-shared.module';
import { FormService } from '../form.service';

describe('EpisodeLinkFormComponent', () => {
    let component: EpisodeLinkFormComponent;
    let fixture: ComponentFixture<EpisodeLinkFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeLinkFormComponent],
            imports: [SharedTestingModule, DataEntrySharedModule],
            providers: [FormService]
        });
        fixture = TestBed.createComponent(EpisodeLinkFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
