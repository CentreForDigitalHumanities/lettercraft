import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateEntityDescriptionInput, DataEntryCreateAgentMutation, DataEntryCreateGiftMutation, DataEntryCreateLetterMutation, DataEntryCreateSpaceMutation, LettercraftErrorType, } from 'generated/graphql';
import { filter, map, Observable, shareReplay, } from 'rxjs';
import { Mutation, MutationResult } from 'apollo-angular';
import { ApolloCache } from '@apollo/client/core';
import { isLoading } from '@shared/request-utils';
import _ from 'underscore';

export interface MutationOutcome<T> {
    loading$: Observable<boolean>;
    success$: Observable<T>;
    errors$: Observable<string[]>,
}

type CreateEntityMutationUnion = (
    DataEntryCreateAgentMutation |
    DataEntryCreateGiftMutation |
    DataEntryCreateLetterMutation |
    DataEntryCreateSpaceMutation
);

export abstract class CreateEntityDescriptionAbstract<
    CreateEntityMutation extends CreateEntityMutationUnion,
    Result extends { errors?: LettercraftErrorType[] },
> {
    /** Property used to refer to this entity in source and episode types */
    abstract relatedName: string;

    constructor(
        protected createMutation: Mutation<CreateEntityMutation, any>,
        protected destroyRef: DestroyRef
    ) { }

    /** Submit input to create a new entity */
    submit(input: CreateEntityDescriptionInput): MutationOutcome<Result> {
        const result$ = this.createMutation.mutate(
            { input },
            {
                errorPolicy: 'all',
                update: (cache) => this.updateCache(input, cache),
            }
        ).pipe(
            shareReplay(1),
            takeUntilDestroyed(this.destroyRef),
        );
        return this.getOutcome(result$ as Observable<MutationResult<CreateEntityMutation>>);
    }

    /** Wraps the mutation result in an object containing loading$, error$, and
     * success$ observables
     * */
    protected getOutcome(
        result$: Observable<MutationResult<CreateEntityMutation>>
    ): MutationOutcome<Result> {
        const loading$ = result$.pipe(isLoading());
        const succes$: Observable<Result> = result$.pipe(
            filter(result => _.isUndefined(this.resultErrors(result))),
            map(result => this.resultData(result) as Result),
        );
        const errors$: Observable<string[]> = result$.pipe(
            map(this.resultErrors.bind(this)),
            filter(_.negate(_.isUndefined)),
        );
        return { loading$, success$: succes$, errors$ };
    }

    /** Extract a list of error messages from the mutation result.
     *
     * @returns A list of error messages (strings). If there are no errors, returns
     * `undefined`.
     */
    protected resultErrors(
        result: MutationResult<CreateEntityMutation>
    ): string[] | undefined {
        if (result.errors?.length) {
            return result.errors.map(error => error.message);
        }
        const data = this.resultData(result);
        if (!data) {
            return ['Unknown error'];
        }
        if (data.errors?.length) {
            return data.errors.flatMap(error => error.messages);
        }
        return undefined;
    }

    /** Update the cache based on the provided input
     */
    protected updateCache(
        input: CreateEntityDescriptionInput, cache: ApolloCache<unknown>
    ) {
        cache.evict({
            id: cache.identify({ __typename: 'SourceType', id: input.source }),
            fieldName: this.relatedName,
        });
        if (input.episodes) {
            for (const episode of input.episodes) {
                cache.evict({
                    id: cache.identify({ __typename: 'EpisodeType', id: episode }),
                    fieldName: this.relatedName,
                })
            }
        }
        cache.gc();
    }

    /** Extract the result of this mutation from the request result.
     */
    protected abstract resultData(
        result: MutationResult<CreateEntityMutation>
    ): Result | undefined;

}
