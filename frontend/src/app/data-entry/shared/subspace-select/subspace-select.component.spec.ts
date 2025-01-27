import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubspaceSelectComponent } from "./subspace-select.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("SubspaceSelectComponent", () => {
    let component: SubspaceSelectComponent;
    let fixture: ComponentFixture<SubspaceSelectComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SubspaceSelectComponent],
            imports: [SharedTestingModule]
        });
        fixture = TestBed.createComponent(SubspaceSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
