import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserMenuComponent } from './user-menu.component';
import { AuthService } from '@services/auth.service';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { HttpTestingController } from '@angular/common/http/testing';
import { UserResponse } from 'src/app/user/models/user';
import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

const fakeUserResponse: UserResponse = {
    id: 1,
    username: "frodo",
    email: "frodo@shire.me",
    first_name: "Frodo",
    last_name: "Baggins",
    is_staff: false
}

@Injectable({ providedIn: 'root' })
class MockAuthService extends AuthService {

}

fdescribe('UserMenuComponent', () => {
    let component: UserMenuComponent;
    let fixture: ComponentFixture<UserMenuComponent>;
    let authService: AuthService;
    let httpTestingController: HttpTestingController;
    let loading: Signal<boolean | undefined>;

    const spinner = () => fixture.debugElement.query(By.css('.spinner-border'));
    const signInLink = () => fixture.debugElement.query(By.css('a[href="/login"]'));
    const userDropdownTrigger = () => fixture.debugElement.query(By.css('#userDropdown'))

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthService],
            declarations: [UserMenuComponent],
            imports: [SharedTestingModule],
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);
        fixture = TestBed.createComponent(UserMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loading = TestBed.runInInjectionContext(() => toSignal(component.loading$));
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should show sign-in when not logged in', () => { });

    it('should show a loading spinner', () => {
        expect(spinner()).toBeTruthy();
        expect(signInLink()).toBeFalsy();
        expect(userDropdownTrigger()).toBeFalsy();
    });

    // it('should show an admin menu when user is a staff member', () => { });



    it('should show a user menu when logged in', () => {
        // Normally called in AppComponent.ngAfterViewInit();
        authService.initialAuth$.next();
        const req = httpTestingController.expectOne('/users/user/');
        req.flush(fakeUserResponse);
        fixture.detectChanges();

        expect(loading()).toBeFalse();

        // authService._setUser(testUser({}));
        // fixture.detectChanges();

        // expect(spinner()).toBeFalsy();
        // expect(signInLink()).toBeFalsy();
        // expect(userDropdownTrigger()).toBeTruthy();
    });
});
