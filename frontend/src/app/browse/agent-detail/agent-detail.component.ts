import { Component } from '@angular/core';

@Component({
  selector: 'lc-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.scss']
})
export class AgentDetailComponent {
    selectedSources: number[] = [1];

    selectSource(sourceId: number): void {
        if (this.selectedSources.includes(sourceId)) {
            this.selectedSources = this.selectedSources.filter(id => id !== sourceId);
        } else {
            this.selectedSources.push(sourceId);
        }
    }

}
