import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftViewComponent } from './gift-view.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { ObjectPageHeaderComponent } from '../shared/object-page-header/object-page-header.component';
import { EpisodeLinksComponent } from '../shared/episode-links/episode-links.component';
import { DataPageWrapperDirective } from '../shared/page-wrapper.directive';

describe('GiftViewComponent', () => {
    let component: GiftViewComponent;
    let fixture: ComponentFixture<GiftViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                GiftViewComponent,
                ObjectPageHeaderComponent,
                EpisodeLinksComponent,
                DataPageWrapperDirective,
            ],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(GiftViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
