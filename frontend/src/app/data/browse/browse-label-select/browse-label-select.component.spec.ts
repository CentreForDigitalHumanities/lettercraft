import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseLabelSelectComponent } from './browse-label-select.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { BrowseEpisodeCategoriesGQL } from 'generated/graphql';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
class MockQuery extends BrowseEpisodeCategoriesGQL {
    public override fetch() {
        return of({
            data: {
                episodeCategories: [{
                    id: "label1",
                    name: "Label One",
                    description: "The first label"
                }]
            },
            loading: false,
            networkStatus: 7,
        })
    }
}

describe('BrowseLabelSelectComponent', () => {
    let component: BrowseLabelSelectComponent;
    let fixture: ComponentFixture<BrowseLabelSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestingModule],
            providers: [{
                provide: BrowseEpisodeCategoriesGQL,
                useClass: MockQuery
            }]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BrowseLabelSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle label selection', () => {
        const labelId = 'test-label';
        component.toggleLabel(labelId);
        expect(component.selectedLabelIds()).toContain(labelId);
    });

    it('should write value correctly', () => {
        const labelIds = ['label1', 'label2'];
        component.writeValue(labelIds);
        expect(component.selectedLabelIds()).toEqual(labelIds);
    });

    it('should clear all labels', () => {
        component.selectedLabelIds.set(['label1', 'label2']);
        component.clearLabels();
        expect(component.selectedLabelIds()).toEqual([]);
    });

    it('should retrieve label name', () => {
        const labelName = component.getLabelName('label1');
        expect(labelName).toBe('Label One');
    });
});
