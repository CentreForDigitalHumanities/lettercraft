import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeListComponent } from './episode-list.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('EpisodeListComponent', () => {
    let component: EpisodeListComponent;
    let fixture: ComponentFixture<EpisodeListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeListComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(EpisodeListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
