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

    it("should reorder episodes correctly", () => {
        const mutationSpy = spyOn(component, "performOrderMutation" as any);

        const episodes = [
            {
                id: "1",
                name: "Episode 1",
                summary: "",
                description: "",
                rank: 0,
                book: "1",
                chapter: "1",
                page: "1",
                agents: [],
                letters: [],
                gifts: [],
                spaces: [],
                contributors: [],
            },
            {
                id: "2",
                name: "Episode 2",
                summary: "",
                description: "",
                rank: 0,
                book: "1",
                chapter: "1",
                page: "1",
                agents: [],
                letters: [],
                gifts: [],
                spaces: [],
                contributors: [],
            },
            {
                id: "3",
                name: "Episode 3",
                summary: "",
                description: "",
                rank: 0,
                book: "1",
                chapter: "1",
                page: "1",
                agents: [],
                letters: [],
                gifts: [],
                spaces: [],
                contributors: [],
            },
        ];

        component["reorder"](episodes);

        expect(episodes[0].rank).toBe(0);
        expect(episodes[1].rank).toBe(1);
        expect(episodes[2].rank).toBe(2);

        expect(mutationSpy).toHaveBeenCalled();
    });
});
