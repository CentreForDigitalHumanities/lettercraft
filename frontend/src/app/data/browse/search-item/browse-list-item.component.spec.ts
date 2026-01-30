import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseListItemComponent } from './browse-list-item.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('BrowseListItemComponent', () => {
    let component: BrowseListItemComponent;
    let fixture: ComponentFixture<BrowseListItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestingModule]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BrowseListItemComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('listItem', {
            id: '1',
            name: 'Test Item',
            description: 'This is a test item',
            subtext: 'Subtext here',
            icon: 'test-icon',
            link: '/test-link',
            labels: ['label1', 'label2']
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
