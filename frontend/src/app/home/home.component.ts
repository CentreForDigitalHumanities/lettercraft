import { Component } from '@angular/core';
import { dataIcons } from '@shared/icons';

@Component({
    selector: 'lc-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent {
    dataIcons = dataIcons;

    links = [
        {
            label: 'Principles',
            icon: 'file-text',
            href: undefined,
        },
        {
            label: 'Source texts',
            icon: dataIcons.source,
            href: '/data/sources',
        },
        {
            label: 'Epistolary episodes',
            icon: dataIcons.episode,
            href: '/data/episodes',
        },
        {
            label: 'Terminology',
            icon: 'alphabet',
            href: undefined,
        },
        {
            label: 'Case studies',
            icon: 'journal-text',
            href: 'https://lettercraft.sites.uu.nl/category/blog/'
        },
        {
            label: 'Contributors',
            icon: 'people',
            href: '/contributors',
        },
        {
            label: 'Contact',
            icon: 'envelope',
            href: 'https://lettercraft.sites.uu.nl/contact/',
        }
    ]
}
