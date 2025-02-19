import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewAgentGQL, ViewAgentQuery } from 'generated/graphql';
import { Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'lc-agent-view',
  templateUrl: './agent-view.component.html',
  styleUrls: ['./agent-view.component.scss']
})
export class AgentViewComponent {
    id$: Observable<string> = this.route.params.pipe(
        map(params => params['id']),
    );
    data$: Observable<ViewAgentQuery>;

    constructor(
        private route: ActivatedRoute,
        private query: ViewAgentGQL,
    ) {
        this.data$ = this.id$.pipe(
            switchMap(id => this.query.watch({ id }).valueChanges),
            map(result => result.data),
        );
    }
}
