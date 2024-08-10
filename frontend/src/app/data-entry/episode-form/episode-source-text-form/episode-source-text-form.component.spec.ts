import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodeSourceTextFormComponent } from "./episode-source-text-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("EpisodeSourceTextFormComponent", () => {
    let component: EpisodeSourceTextFormComponent;
    let fixture: ComponentFixture<EpisodeSourceTextFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeSourceTextFormComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(EpisodeSourceTextFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
