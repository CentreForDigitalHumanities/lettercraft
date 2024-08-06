import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SourceComponent } from "./source.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("SourceComponent", () => {
    let component: SourceComponent;
    let fixture: ComponentFixture<SourceComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SourceComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(SourceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
