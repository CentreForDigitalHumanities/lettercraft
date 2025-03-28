import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeViewComponent } from './episode-view.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { ObjectPageHeaderComponent } from '../shared/object-page-header/object-page-header.component';

describe('EpisodeViewComponent', () => {
    let component: EpisodeViewComponent;
    let fixture: ComponentFixture<EpisodeViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                EpisodeViewComponent,
                ObjectPageHeaderComponent,
            ],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(EpisodeViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
