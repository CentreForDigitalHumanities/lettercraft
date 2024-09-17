import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodeAgentsFormComponent } from "./episode-agents-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormService } from "../../shared/form.service";

describe("EpisodeAgentsFormComponent", () => {
    let component: EpisodeAgentsFormComponent;
    let fixture: ComponentFixture<EpisodeAgentsFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeAgentsFormComponent],
            providers: [FormService],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(EpisodeAgentsFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
