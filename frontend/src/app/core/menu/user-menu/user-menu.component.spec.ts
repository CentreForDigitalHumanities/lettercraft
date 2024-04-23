import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMenuComponent } from './user-menu.component';
import { AuthService } from '@services/auth.service';
import { AuthServiceMock } from 'src/mock/auth.service.mock';

describe('UserMenuComponent', () => {
    let component: UserMenuComponent;
    let fixture: ComponentFixture<UserMenuComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useClass: AuthServiceMock }
            ],
            declarations: [UserMenuComponent]
        });
        fixture = TestBed.createComponent(UserMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
