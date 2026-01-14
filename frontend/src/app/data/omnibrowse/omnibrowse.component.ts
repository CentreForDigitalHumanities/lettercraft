import { Component } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { actionIcons, dataIcons } from '@shared/icons';
import { FormControl } from '@angular/forms';

interface SearchResult {
    id: number;
    name: string;
    description: string;
    subtext: string;
    icon?: string;
}

@Component({
    selector: 'lc-omnibrowse',
    templateUrl: './omnibrowse.component.html',
    styleUrl: './omnibrowse.component.scss',
    standalone: false,
})
export class OmnibrowseComponent {
    activeTab = 1;
    searchQuery = 'Radegund';
    hasSearched = false;

    // Icons
    dataIcons = dataIcons;
    actionIcons = actionIcons;

    search = new FormControl('');

    // Label selection
    selectedLabels: string[] = [];
    mockLabels = [
        { id: 'personal', label: 'Personal Correspondence' },
        { id: 'official', label: 'Official Business' },
        { id: 'diplomatic', label: 'Diplomatic Exchange' },
        { id: 'religious', label: 'Religious Matters' },
        { id: 'literary', label: 'Literary Composition' },
        { id: 'petition', label: 'Petition or Request' },
        { id: 'recommendation', label: 'Letter of Recommendation' },
        { id: 'condolence', label: 'Condolence' },
        { id: 'congratulation', label: 'Congratulation' },
        { id: 'instruction', label: 'Instruction or Guidance' }
    ];

    tabs = [
        {
            id: 1,
            title: 'Episodes',
            icon: dataIcons.episode
        },
        {
            id: 2,
            title: 'Sources',
            icon: dataIcons.source
        },
        {
            id: 3,
            title: 'Agents',
            icon: dataIcons.person,
        },
        {
            id: 4,
            title: 'Letters/Items',
            icon: dataIcons.letter,
        },
        {
            id: 5,
            title: 'Locations',
            icon: dataIcons.location,
        }
    ];

    private mockData: { [key: number]: SearchResult[]; } = {
        // Episodes
        1: [
            {
                id: 1,
                name: 'Radegund arrives at Poitiers',
                description: 'After a long journey, Radegund finally reaches the city of Poitiers.',
                subtext: 'Gregory of Tours, <i>Decem libri historiarum</i>, book VIII, chapter 6, section 5, page 168'
            },
            {
                id: 2,
                name: 'Medard ordains Radegund',
                description: 'Bishop Medard of Noyon ordains Radegund as a deaconess.',
                subtext: 'Venantius Fortunatus, <i>Vita Radegundis</i>, book I, chapter 12, page 45'
            },
            {
                id: 3,
                name: 'Foundation of Holy Cross Monastery',
                description: 'Radegund establishes the monastery of the Holy Cross',
                subtext: 'Baudovinia, <i>Vita Radegundis</i>, book I, chapter 5, page 30'
            }
        ],
        // Sources
        2: [
            {
                id: 1,
                name: 'Venantius Fortunatus, <i>Vita Radegundis</i>',
                description: 'Hagiographical account of Saint Radegund\'s life',
                subtext: '12 episodes'
            },
            {
                id: 2,
                name: 'Baudovinia, <i>Vita Radegundis</i>',
                description: 'Second vita of Radegund, written by a nun of her monastery',
                subtext: '7 episodes'
            },
            {
                id: 3,
                name: 'Gregory of Tours, <i>Decem libri historiarum</i>',
                description: 'Historical account including references to Radegund',
                subtext: '7 episodes'
            }
        ],
        // Agents
        3: [
            {
                id: 1,
                name: 'Saint Radegund',
                description: 'Occurs in 19 episodes in Venantius Fortunatus, <i>Vita Radegundis</i>',
                subtext: 'Individual'
            },
            {
                id: 2,
                name: 'Queen Radegundis',
                description: 'Occurs in 3 episodes in Baudovinia, <i>Vita Radegundis</i>',
                subtext: 'Individual'
            },
            {
                id: 3,
                name: "Radegund's fellow nuns at Holy Cross Monastery",
                description: 'Occur in 1 episode in Baudovinia, <i>Vita Radegundis</i>',
                subtext: 'Group',
                icon: dataIcons.group
            }
        ],
        // Letters/Items
        4: [
            {
                id: 1,
                name: 'Letter from Radegund to Junian of Maire',
                description: 'Occurs in 2 episodes in Gregory of Tours, <i>Decem libri historiarum</i>',
                subtext: 'Letter'
            },
            {
                id: 2,
                name: 'Cilicium (haircloth, gift to Radegund)',
                description: 'Occurs in 1 episode in Venantius Fortunatus, <i>Epistulae</i>',
                subtext: 'Gift',
                icon: dataIcons.gift
            },
            {
                id: 3,
                name: 'Radegund\'s request for the relic for Holy Cross',
                description: 'Occurs in 5 episodes in Baudovinia, <i>Vita Radegundis</i>',
                subtext: 'Letter'
            },
            {
                id: 4,
                name: 'Poem to Radegund by Venantius Fortunatus',
                description: 'Occurs in 1 episode in Venantius Fortunatus, <i>Carmina</i>',
                subtext: 'Letter'
            }
        ],
        // Locations
        5: []
    };

    onSearch(event: Event): void {
        event.preventDefault();
        if (this.searchQuery.trim()) {
            this.hasSearched = true;
        }
    }

    public getResults(tabId: number): SearchResult[] {
        return this.mockData[tabId] || [];
    }

    public getResultCount(tabId: number): number {
        return this.getResults(tabId).length;
    }

    public toggleLabel(labelId: string): void {
        const index = this.selectedLabels.indexOf(labelId);
        if (index > -1) {
            this.selectedLabels.splice(index, 1);
        } else {
            this.selectedLabels.push(labelId);
        }
    }

    public isLabelSelected(labelId: string): boolean {
        return this.selectedLabels.includes(labelId);
    }

    public clearLabels(): void {
        this.selectedLabels = [];
    }

    public getSelectedLabelsDisplay(): string {
        if (this.selectedLabels.length === 0) {
            return 'Select labels...';
        } else if (this.selectedLabels.length === 1) {
            const label = this.mockLabels.find(l => l.id === this.selectedLabels[0]);
            return label ? label.label : 'Select labels...';
        } else {
            return `${this.selectedLabels.length} items selected`;
        }
    }
}
