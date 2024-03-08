import { Component } from '@angular/core';

@Component({
  selector: 'lc-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.scss']
})
export class AgentDetailComponent {
    selectedSources: number[] = [0, 1, 2];

    sources = [{
        author: 'Fortunatus',
        work: 'Vita Sanctae Radegundis',
        part: 'Bk. 2',
        pages: '1299--1301',
        name: 'St. Radegund',
        status: [{
            name: 'Abbess of the Convent of the Holy Cross',
            date: 'c. 550--587'
        }, {
            name: 'Saint',
            date: '587'
        }],
        dateOfBirth: '',
        dateOfDeath: '587',
        gender: 'woman',
    }, {
        author: 'Gaius Sidonius',
        work: 'Radegundis Regina',
        part: 'Ch. 5',
        pages: '1--3',
        name: '',
        status: [],
        dateOfBirth: '510',
        dateOfDeath: 'c. 587--590',
        gender: 'woman',
    }, {
        author: 'Aurelius Cassiodorus',
        work: 'Miracula et Virtutes Sanctissimae Radegundis',
        part: 'Bk. 3',
        pages: '5--7, 18--19',
        name: 'Radegundis',
        status: [{
            name: 'Abbess of the Convent of the Holy Cross',
            date: 'c. 545--588'
        }],
        dateOfBirth: '',
        dateOfDeath: '588',
        gender: 'woman'
    }]

    selectSource(sourceId: number): void {
        if (this.selectedSources.includes(sourceId)) {
            this.selectedSources = this.selectedSources.filter(id => id !== sourceId);
        } else {
            this.selectedSources.push(sourceId);
        }
    }

}
