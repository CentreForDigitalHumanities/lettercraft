import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UserMenuComponent } from './user-menu.component';
import { AuthService } from '@services/auth.service';
import { AuthServiceMock, testUser } from '@mock/auth.service.mock';
import { SharedTestingModule } from '@shared/shared-testing.module';


describe('UserMenuComponent', () => {
    let component: UserMenuComponent;
    let fixture: ComponentFixture<UserMenuComponent>;
    let authService: AuthServiceMock;

    const spinner = () => fixture.debugElement.query(By.css('.spinner-border'));
    const signInLink = () => fixture.debugElement.query(By.css('a[href="/login"]'));
    const userDropdownTrigger = () => fixture.debugElement.query(By.css('#userDropdown'))

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useClass: AuthServiceMock }
            ],
            declarations: [UserMenuComponent],
            imports: [SharedTestingModule],
        });
        authService = TestBed.inject(AuthService) as unknown as AuthServiceMock;
        fixture = TestBed.createComponent(UserMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show a loading spinner', () => {
        expect(spinner()).toBeTruthy();
        expect(signInLink()).toBeFalsy();
        expect(userDropdownTrigger()).toBeFalsy();
    });

    it('should show sign-in when not logged in', () => {
        authService._setUser(null);
        fixture.detectChanges();

        expect(spinner()).toBeFalsy();
        expect(signInLink()).toBeTruthy();
        expect(userDropdownTrigger()).toBeFalsy();
    });

    it('should show a user menu when logged in', () => {
        authService._setUser(testUser({}));
        fixture.detectChanges();

        expect(spinner()).toBeFalsy();
        expect(signInLink()).toBeFalsy();
        expect(userDropdownTrigger()).toBeTruthy();
    });
});
