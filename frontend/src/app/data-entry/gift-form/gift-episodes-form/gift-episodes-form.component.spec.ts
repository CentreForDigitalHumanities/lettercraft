import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftEpisodesFormComponent } from './gift-episodes-form.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { FormService } from '../../shared/form.service';

describe('GiftEpisodesFormComponent', () => {
    let component: GiftEpisodesFormComponent;
    let fixture: ComponentFixture<GiftEpisodesFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GiftEpisodesFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(GiftEpisodesFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
