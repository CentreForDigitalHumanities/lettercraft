import { Component } from '@angular/core';
import { environment } from '@env';

@Component({
    selector: 'lc-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    environment = environment;

    constructor() { }

}
