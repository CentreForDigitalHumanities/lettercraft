import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentViewComponent } from './agent-view.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { ObjectPageHeaderComponent } from '../shared/object-page-header/object-page-header.component';
import { EpisodeLinksComponent } from '../shared/episode-links/episode-links.component';

describe('AgentViewComponent', () => {
    let component: AgentViewComponent;
    let fixture: ComponentFixture<AgentViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AgentViewComponent,
                ObjectPageHeaderComponent,
                EpisodeLinksComponent,
            ],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(AgentViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
