import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodeFormComponent } from "./episode-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { EpisodeFormModule } from "./episode-form.module";

describe("EpisodeFormComponent", () => {
    let component: EpisodeFormComponent;
    let fixture: ComponentFixture<EpisodeFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeFormComponent],
            imports: [SharedTestingModule, EpisodeFormModule],
        });
        fixture = TestBed.createComponent(EpisodeFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
