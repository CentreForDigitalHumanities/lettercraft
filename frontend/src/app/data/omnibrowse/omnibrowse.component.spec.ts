import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OmnibrowseComponent } from './omnibrowse.component';

describe('OmnibrowseComponent', () => {
    let component: OmnibrowseComponent;
    let fixture: ComponentFixture<OmnibrowseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OmnibrowseComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OmnibrowseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
