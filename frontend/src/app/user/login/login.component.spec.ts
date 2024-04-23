import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '@services/auth.service';
import { SharedModule } from '@shared/shared.module';
import { AuthServiceMock } from '../../../mock/auth.service.mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            providers: [
                { provide: AuthService, useClass: AuthServiceMock }
            ],
            imports: [SharedModule, RouterTestingModule]
        });
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
