import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceViewComponent } from './source-view.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { ObjectPageHeaderComponent } from '../shared/object-page-header/object-page-header.component';

describe('SourceViewComponent', () => {
    let component: SourceViewComponent;
    let fixture: ComponentFixture<SourceViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                SourceViewComponent,
                ObjectPageHeaderComponent,
            ],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(SourceViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
