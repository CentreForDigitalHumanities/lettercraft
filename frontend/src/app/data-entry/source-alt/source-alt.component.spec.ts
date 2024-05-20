import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceAltComponent } from './source-alt.component';
import { SharedTestingModule } from 'src/app/shared/shared-testing.module';

describe('SourceAltComponent', () => {
    let component: SourceAltComponent;
    let fixture: ComponentFixture<SourceAltComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SourceAltComponent],
            imports: [SharedTestingModule]
        });
        fixture = TestBed.createComponent(SourceAltComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
