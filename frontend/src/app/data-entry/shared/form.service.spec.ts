import { TestBed } from '@angular/core/testing';

import { FormService } from './form.service';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('FormService', () => {
    let service: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FormService],
            imports: [SharedTestingModule],
        });
        service = TestBed.inject(FormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
