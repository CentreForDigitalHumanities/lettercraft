import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEntityButtonComponent } from './delete-entity-button.component';

describe('DeleteEntityButtonComponent', () => {
  let component: DeleteEntityButtonComponent;
  let fixture: ComponentFixture<DeleteEntityButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteEntityButtonComponent]
    });
    fixture = TestBed.createComponent(DeleteEntityButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
