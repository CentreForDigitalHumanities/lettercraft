import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticalRegionComponent } from './political-region.component';

describe('PoliticalRegionComponent', () => {
  let component: PoliticalRegionComponent;
  let fixture: ComponentFixture<PoliticalRegionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoliticalRegionComponent]
    });
    fixture = TestBed.createComponent(PoliticalRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
