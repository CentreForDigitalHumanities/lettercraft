import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodePreviewComponent } from "./episode-preview.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("EpisodePreviewComponent", () => {
    let component: EpisodePreviewComponent;
    let fixture: ComponentFixture<EpisodePreviewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodePreviewComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(EpisodePreviewComponent);
        component = fixture.componentInstance;
        component.episode = {
            id: '1',
            name: 'Test',
            summary: '',
            book: '',
            chapter: '',
            page: '',
            agents: [],
            contributors: [],
            gifts: [],
            letters: [],
            spaces: [],
            categories: [],
        }
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
