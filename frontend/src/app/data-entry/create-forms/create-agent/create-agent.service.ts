import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateAgentInput, DataEntryCreateAgentGQL, DataEntryCreateAgentMutation } from 'generated/graphql';
import { filter, map, Observable, shareReplay, } from 'rxjs';
import _ from 'underscore';
import { MutationResult } from 'apollo-angular';
import { isLoading } from '@shared/request-utils';

interface MutationOutcome<T> {
    loading$: Observable<boolean>;
    succes$: Observable<T>;
    errors$: Observable<string[]>,
}

@Injectable()
export class CreateAgentService {
    constructor(
        private createMutation: DataEntryCreateAgentGQL,
        private destroyRef: DestroyRef
    ) { }

    submit(input: CreateAgentInput): MutationOutcome<DataEntryCreateAgentMutation> {
        const result$ = this.createMutation.mutate(
            { input },
            {
                errorPolicy: 'all',
                update: (cache) => this.updateCache(input.source, input.episodes, cache),
            }
        ).pipe(
            shareReplay(1),
            takeUntilDestroyed(this.destroyRef),
        );
        return this.getOutcome(result$);
    }

    private getOutcome(
        result$: Observable<MutationResult<DataEntryCreateAgentMutation>>
    ): MutationOutcome<DataEntryCreateAgentMutation> {
        const loading$ = result$.pipe(isLoading);
        const succes$: Observable<DataEntryCreateAgentMutation> = result$.pipe(
            filter(result => _.isUndefined(this.resultErrors(result))),
            map(result => result.data?.createAgent as DataEntryCreateAgentMutation),
        );
        const errors$: Observable<string[]> = result$.pipe(
            map(this.resultErrors),
            filter(_.negate(_.isUndefined)),
        );
        return { loading$, succes$, errors$ };
    }

    private updateCache(
        source: string, episodes: string[] | null | undefined, cache: any
    ) {
        cache.evict({
            id: cache.identify({ __typename: 'SourceType', id: source }),
            fieldName: 'agents',
        });
        if (episodes) {
            for (const episode of episodes) {
                cache.evict({
                    id: cache.identify({ __typename: 'EpisodeType', id: episode }),
                    fieldName: 'agents',
                })
            }
        }
        cache.gc();
    }

    private resultErrors(
        result: MutationResult<DataEntryCreateAgentMutation>
    ): string[] | undefined {
        if (result.errors?.length) {
            return result.errors.map(error => error.message);
        }
        if (result.data?.createAgent?.errors.length) {
            return result.data.createAgent.errors.flatMap(error => error.messages);
        }
        if (!result.data?.createAgent) {
            return ['Unknown error'];
        }
        return undefined;
    }

}
