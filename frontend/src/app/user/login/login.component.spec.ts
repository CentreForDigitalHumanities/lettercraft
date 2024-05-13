import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '@services/auth.service';
import { AuthServiceMock } from '@mock/auth.service.mock';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: AuthService;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            providers: [
                { provide: AuthService, useClass: AuthServiceMock }
            ],
            imports: [SharedTestingModule]
        });
        authService = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should check missing input', () => {
        component.submit();
        expect(component.usernameInput.invalid).toBeTrue();
        expect(component.usernameErrorMessage).toBe('username is required');
        expect(component.passwordInput.invalid).toBeTrue();
        expect(component.passwordErrorMessage).toBe('password is required');
    });

    it('should check invalid usernames', () => {
        component.usernameInput.setValue('te$t');
        component.passwordInput.setValue('secretpassword');
        component.submit();
        expect(component.usernameInput.invalid).toBeTrue();
        expect(component.usernameErrorMessage).toBe('invalid username');
    });

    it('should accept valid input', () => {
        component.usernameInput.setValue('test');
        component.passwordInput.setValue('secretpassword');

        const loginSpy = spyOn(authService, 'login').and.callThrough();
        const routerSpy = spyOn(router, 'navigate');

        component.submit();

        expect(loginSpy).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalledWith(['/']);
    });
});
