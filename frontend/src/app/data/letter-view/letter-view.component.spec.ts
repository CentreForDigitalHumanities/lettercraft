import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterViewComponent } from './letter-view.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { ObjectPageHeaderComponent } from '../shared/object-page-header/object-page-header.component';
import { EpisodeLinksComponent } from '../shared/episode-links/episode-links.component';
import { DataPageWrapperDirective } from '../shared/page-wrapper.directive';

describe('LetterViewComponent', () => {
    let component: LetterViewComponent;
    let fixture: ComponentFixture<LetterViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                LetterViewComponent,
                ObjectPageHeaderComponent,
                EpisodeLinksComponent,
                DataPageWrapperDirective,
            ],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(LetterViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
