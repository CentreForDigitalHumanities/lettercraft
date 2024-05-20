import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureComponent } from './structure.component';
import { SharedTestingModule } from '../../../shared/shared-testing.module';
import { StructureTreeComponent } from './structure-tree/structure-tree.component';

describe('StructureComponent', () => {
    let component: StructureComponent;
    let fixture: ComponentFixture<StructureComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [StructureComponent, StructureTreeComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(StructureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
