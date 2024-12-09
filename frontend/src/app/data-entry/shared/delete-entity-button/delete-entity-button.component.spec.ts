import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DeleteEntityButtonComponent } from "./delete-entity-button.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("DeleteEntityButtonComponent", () => {
    let component: DeleteEntityButtonComponent;
    let fixture: ComponentFixture<DeleteEntityButtonComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DeleteEntityButtonComponent],
            imports: [SharedTestingModule]
        });
        fixture = TestBed.createComponent(DeleteEntityButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
