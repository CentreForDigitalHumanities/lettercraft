import { TestBed } from "@angular/core/testing";

import { CurrentPathService } from "./current-path.service";

describe("CurrentPathService", () => {
    let service: CurrentPathService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CurrentPathService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
