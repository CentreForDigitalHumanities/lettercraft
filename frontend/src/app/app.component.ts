import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'lc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    title = 'lettercraft';

    constructor(private authService: AuthService) { }

    ngAfterViewInit(): void {
        // We subscribe to user info in our template, so we should only call this after the view has been initialized.
        this.authService.initialAuth$.next();
    }
}
