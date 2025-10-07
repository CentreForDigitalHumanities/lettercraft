import { Component } from '@angular/core';
import { dataIcons } from '@shared/icons';

@Component({
    selector: 'lc-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    dataIcons = dataIcons;

    links = [
        {
            label: 'Principles',
            icon: 'book',
            href: 'file-text',
        },
        {
            label: 'Browse episodes',
            icon: dataIcons.episode,
            href: '/data/episodes',
        },
        {
            label: 'Browse sources',
            icon: dataIcons.source,
            href: '/data/sources',
        },
        {
            label: 'Terminology',
            icon: 'alphabet',
            href: undefined,
        },
        {
            label: 'Lettercraft stories',
            icon: 'journal-text',
            href: 'https://lettercraft.sites.uu.nl/category/blog/'
        },
        {
            label: 'Team',
            icon: 'people',
            href: 'https://lettercraft.sites.uu.nl/participants/',
        },
        {
            label: 'Contact',
            icon: 'envelope',
            href: 'https://lettercraft.sites.uu.nl/contact/',
        }
    ]
}
