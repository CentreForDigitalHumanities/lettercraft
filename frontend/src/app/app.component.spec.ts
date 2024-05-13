import { TestBed, waitForAsync } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { SharedTestingModule } from './shared/shared-testing.module';
import { CoreModule } from './core/core.module';

describe('AppComponent', () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
            ],
            imports: [SharedTestingModule, CoreModule]
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'lettercraft'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual(`lettercraft`);
    });

    it('should render title', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('.navbar-brand').textContent).toContain('Lettercraft & Epistolary Performance in Medieval Europe');
    });
});
