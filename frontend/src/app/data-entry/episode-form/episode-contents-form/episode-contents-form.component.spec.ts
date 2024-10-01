import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodeContentsFormComponent } from "./episode-contents-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormService } from "../../shared/form.service";

describe("EpisodeContentsFormComponent", () => {
    let component: EpisodeContentsFormComponent;
    let fixture: ComponentFixture<EpisodeContentsFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeContentsFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(EpisodeContentsFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
