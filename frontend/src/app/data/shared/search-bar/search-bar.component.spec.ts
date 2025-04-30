import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchBarComponent } from "./search-bar.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormControl } from "@angular/forms";

describe("SearchBarComponent", () => {
    let component: SearchBarComponent;
    let fixture: ComponentFixture<SearchBarComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SearchBarComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(SearchBarComponent);
        component = fixture.componentInstance;
        component.searchControl = new FormControl<string>("", {
            nonNullable: true,
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
