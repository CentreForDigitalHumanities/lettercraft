import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserMenuComponent } from './user-menu.component';
import { AuthService } from '@services/auth.service';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { HttpTestingController } from '@angular/common/http/testing';
import { User, UserResponse } from 'src/app/user/models/user';
import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';

const fakeUserResponse: UserResponse = {
    id: 1,
    username: "frodo",
    email: "frodo@shire.me",
    first_name: "Frodo",
    last_name: "Baggins",
    is_staff: false
}

const fakeAdminResponse: UserResponse = {
    id: 1,
    username: "gandalf",
    email: "gandalf@istari.me",
    first_name: "Gandalf",
    last_name: "The Grey",
    is_staff: true
}


describe('UserMenuComponent', () => {
    let component: UserMenuComponent;
    let fixture: ComponentFixture<UserMenuComponent>;
    let authService: AuthService;
    let httpTestingController: HttpTestingController;

    const spinner = () => fixture.debugElement.query(By.css('.spinner-border'));
    const signInLink = () => fixture.debugElement.query(By.css('a[href="/login"]'));
    const userDropdownTrigger = () => fixture.debugElement.query(By.css('#userDropdown'))

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [UserMenuComponent],
            providers: [AuthService],
            imports: [SharedTestingModule],
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);
        fixture = TestBed.createComponent(UserMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show sign-in when not logged in', () => {
        authService.initialAuth$.next();
        const req = httpTestingController.expectOne('/users/user/');
        req.flush(null);
        fixture.detectChanges();

        expect(spinner()).toBeFalsy();
        expect(signInLink()).toBeTruthy();
        expect(userDropdownTrigger()).toBeFalsy();
    });

    it('should show a loading spinner', () => {
        expect(spinner()).toBeTruthy();
        expect(signInLink()).toBeFalsy();
        expect(userDropdownTrigger()).toBeFalsy();
    });

    it('should show an admin menu when user is a staff member', () => {
        // Normally called in AppComponent.ngAfterViewInit();
        authService.initialAuth$.next();
        const req = httpTestingController.expectOne('/users/user/');
        req.flush(fakeAdminResponse);
        fixture.detectChanges();

        expect(spinner()).toBeFalsy();
        expect(signInLink()).toBeFalsy();
        expect(userDropdownTrigger()).toBeTruthy();
        expect(userDropdownTrigger().nativeElement.textContent).toContain('gandalf');
    });


    it('should show a user menu when logged in', () => {
        // Normally called in AppComponent.ngAfterViewInit();
        authService.initialAuth$.next();
        const req = httpTestingController.expectOne('/users/user/');
        req.flush(fakeUserResponse);
        fixture.detectChanges();

        expect(spinner()).toBeFalsy();
        expect(signInLink()).toBeFalsy();
        expect(userDropdownTrigger()).toBeTruthy();
    });
});
