import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'lc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'lettercraft';

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.initialAuth$.next();
    }
}
