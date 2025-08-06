import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationViewComponent } from './location-view.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { ObjectPageHeaderComponent } from '../shared/object-page-header/object-page-header.component';
import { EpisodeLinksComponent } from '../shared/episode-links/episode-links.component';
import { DataPageWrapperDirective } from '../shared/page-wrapper.directive';

describe('LocationViewComponent', () => {
    let component: LocationViewComponent;
    let fixture: ComponentFixture<LocationViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                LocationViewComponent,
                ObjectPageHeaderComponent,
                EpisodeLinksComponent,
                DataPageWrapperDirective,
            ],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(LocationViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
