import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Params, ResolveFn } from "@angular/router";
import { Apollo, gql, TypedDocumentNode } from "apollo-angular";
import { map } from "rxjs";
import _ from "underscore";

export const SITE_NAME = 'Lettercraft & Epistolary Performance in Medieval Europe';
export const pageTitle = (name: string) => `${name} - ${SITE_NAME}`;

/**
 * create a resolver function that relies on a graphQL query
 *
 * @param queryFromParams returns a graphQL query based on the route parameters
 * @param titleFromData transforms the result of the query into a string
 * @returns a ResolverFn to resolve the title based on the query results
 */
const queryTitleResolver = <QueryData>(
    queryFromParams: (params: Params) => TypedDocumentNode<QueryData, unknown>,
    titleFromData: (data: QueryData) => string,
): ResolveFn<string> => {
    return (route: ActivatedRouteSnapshot) => {
        const query = queryFromParams(route.params);
        return inject(Apollo).watchQuery({ query }).valueChanges.pipe(
            map(result => result.data),
            map(titleFromData),
            map(pageTitle),
        );
    }
}

type SourceTitleQueryData = { source?: { name: string } }

const sourceTitleQuery = (params: Params) => gql<SourceTitleQueryData, unknown>(`
    query SourceTitleQuery {
        source(id: "${params['id']}") {
            id
            name
        }
}`);

const sourceFormTitle = (data: SourceTitleQueryData) => `Edit ${data.source?.name}`;

export const sourceFormTitleResolver = queryTitleResolver(
    sourceTitleQuery, sourceFormTitle);

type EntityDescriptionTitleQueryData<Key extends string> =
    Record<Key, { name: string, source: { name: string } }>;

type AgentTitleQueryData = EntityDescriptionTitleQueryData<'agentDescription'>;

const agentTitleQuery = (params: Params) => gql<AgentTitleQueryData, unknown>(`
    query AgentTitleQuery {
        agentDescription(id: "${params['id']}") {
            id
            name
            source { id, name }
        }
}`);

const entityDescriptionFormTitle = <Key extends string>(
    data: EntityDescriptionTitleQueryData<Key>
) => {
    const key = _.first(_.keys(data)) as Key;
    const entity = data[key];
    if (entity) {
        return `Edit ${entity.name} (${entity.source.name})`;
    } else {
        return 'Not found';
    }
}

export const agentFormTitleResolver = queryTitleResolver(
    agentTitleQuery, entityDescriptionFormTitle);

type LetterTitleQueryData = EntityDescriptionTitleQueryData<'letterDescription'>;

const letterTitleQuery = (params: Params) => gql<LetterTitleQueryData, unknown>(`
    query LetterTitleQuery {
        letterDescription(id: "${params['id']}") {
            id
            name
            source { id, name }
        }
    }
`);


export const letterFormTitleResolver = queryTitleResolver(
    letterTitleQuery, entityDescriptionFormTitle);


type GiftTitleQueryData = EntityDescriptionTitleQueryData<'giftDescription'>;

const giftTitleQuery = (params: Params) => gql<GiftTitleQueryData, unknown>(`
    query GiftTitleQuery {
        giftDescription(id: "${params['id']}") {
            id
            name
            source { id, name }
        }
    }
`);


export const giftFormTitleResolver = queryTitleResolver(
    giftTitleQuery, entityDescriptionFormTitle);

type SpaceTitleQueryData = EntityDescriptionTitleQueryData<'spaceDescription'>;

const spaceTitleQuery = (params: Params) => gql<SpaceTitleQueryData, unknown>(`
    query SpaceTitleQuery {
        spaceDescription(id: "${params['id']}") {
            id
            name
            source { id, name }
        }
    }
`);

export const spaceFormTitleResolver = queryTitleResolver(
    spaceTitleQuery, entityDescriptionFormTitle);
