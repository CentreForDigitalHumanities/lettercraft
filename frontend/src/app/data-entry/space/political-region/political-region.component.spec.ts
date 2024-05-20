import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticalRegionComponent } from './political-region.component';
import { SharedTestingModule } from 'src/app/shared/shared-testing.module';

describe('PoliticalRegionComponent', () => {
  let component: PoliticalRegionComponent;
  let fixture: ComponentFixture<PoliticalRegionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [PoliticalRegionComponent],
        imports: [SharedTestingModule],
    });
    fixture = TestBed.createComponent(PoliticalRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
