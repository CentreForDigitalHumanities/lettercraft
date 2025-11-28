import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ContributorsComponent } from "./contributors.component";
import { UserType } from "generated/graphql";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("ContributorsComponent", () => {
    let component: ContributorsComponent;
    let fixture: ComponentFixture<ContributorsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ContributorsComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(ContributorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have input property 'contributors'", () => {
        expect(component.contributors).toBeDefined();
    });

    it("should render no contributors", () => {
        const contributors: Pick<UserType, "id" | "fullName">[] = [];
        component.contributors = contributors;
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        const element: HTMLElement = compiled.querySelector(".contributors");
        self.expect(element).toBeDefined();
        self.expect(element.textContent).toBe("No contributors");
    });

    it("should render one contributor", () => {
        const contributors: Pick<UserType, "id" | "fullName">[] = [
            { id: "1", fullName: "Anakin Skywalker" },
        ];
        component.contributors = contributors;
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        const element: HTMLElement = compiled.querySelector(".contributors");
        self.expect(element).toBeDefined();
        self.expect(element.textContent).toBe("Contributor: Anakin Skywalker");
    });

    it("should render two contributors", () => {
        const contributors: Pick<UserType, "id" | "fullName">[] = [
            { id: "1", fullName: "Anakin Skywalker" },
            { id: "2", fullName: "Jabba the Hutt" },
        ];
        component.contributors = contributors;
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        const element: HTMLElement = compiled.querySelector(".contributors");
        self.expect(element).toBeDefined();
        self.expect(element.textContent).toBe("Contributors: Anakin Skywalker, Jabba the Hutt");
    });

    it("should render three contributors", () => {
        const contributors: Pick<UserType, "id" | "fullName">[] = [
            { id: "1", fullName: "Anakin Skywalker" },
            { id: "2", fullName: "Jabba the Hutt" },
            { id: "3", fullName: "Queen Amidala" },
        ];
        component.contributors = contributors;
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        const element: HTMLElement = compiled.querySelector(".contributors");
        self.expect(element).toBeDefined();
        self.expect(element.textContent).toBe("Contributors: Anakin Skywalker, Jabba the Hutt, Queen Amidala");
    });
});
