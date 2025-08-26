import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceListComponent } from './source-list.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { PaginatorComponent } from '../shared/paginator/paginator.component';

describe('SourceListComponent', () => {
    let component: SourceListComponent;
    let fixture: ComponentFixture<SourceListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SourceListComponent, PaginatorComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(SourceListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
