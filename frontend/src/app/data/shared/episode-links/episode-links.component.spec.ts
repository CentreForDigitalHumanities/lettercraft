import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeLinksComponent } from './episode-links.component';
import { SourceMention } from 'generated/graphql';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('EpisodeLinksComponent', () => {
    let component: EpisodeLinksComponent;
    let fixture: ComponentFixture<EpisodeLinksComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeLinksComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(EpisodeLinksComponent);
        component = fixture.componentInstance;
        component.episodes = [
            {
                id: '1',
                episode: {
                    id: '1',
                    name: 'Test',
                },
                sourceMention: SourceMention.Direct,
                designators: [],
                note: '',
            }
        ];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
