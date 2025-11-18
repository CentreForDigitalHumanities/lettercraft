import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Params, ResolveFn } from "@angular/router";
import { Apollo, gql, TypedDocumentNode } from "apollo-angular";
import { CaseStudyTitleQueryQuery, EpisodeTitleQueryQuery, EpisodeTitleQueryQueryVariables, SourceTitleQueryQuery, SourceTitleQueryQueryVariables } from "generated/graphql";
import { map } from "rxjs";
import _ from "underscore";

export const SITE_NAME = 'Lettercraft';
export const pageTitle = (name: string) => `${name} - ${SITE_NAME}`;

/**
 * create a resolver function that relies on a graphQL query
 *
 * @param queryFromParams returns a graphQL query based on the route parameters
 * @param titleFromData transforms the result of the query into a string
 * @param watchChanges whether to keep watching the query for changes
 * @returns a ResolverFn to resolve the title based on the query results
 */
const queryTitleResolver = <QueryData, QueryVariables>(
    queryFromParams: (params: Params) => TypedDocumentNode<QueryData, QueryVariables>,
    titleFromData: (data: QueryData) => string,
    watchChanges = false,
): ResolveFn<string> => {
    return (route: ActivatedRouteSnapshot) => {
        const query = queryFromParams(route.params);
        const apollo = inject(Apollo);
        const query$ = watchChanges ?
            apollo.watchQuery({ query }).valueChanges :
            apollo.query({ query });
        return query$.pipe(
            map(result => result.data),
            map(titleFromData),
            map(pageTitle),
        );
    }
}


const sourceTitleQuery = (params: Params) => gql<SourceTitleQueryQuery, SourceTitleQueryQueryVariables>(`
    query SourceTitleQuery {
        source(id: "${params['id']}") {
            id
            name
        }
}`);

const sourceFormTitle = (data: SourceTitleQueryQuery) => `Edit ${data.source?.name}`;

export const sourceFormTitleResolver = queryTitleResolver(
    sourceTitleQuery, sourceFormTitle
);

const episodeTitleQuery = (params: Params) => gql<EpisodeTitleQueryQuery, EpisodeTitleQueryQueryVariables>(`
    query EpisodeTitleQuery {
        episode(id: "${params['id']}") {
            id
            name
            source { id, name }
        }
    }`);

const episodeFormTitle = (data: EpisodeTitleQueryQuery) =>
    `Edit ${data.episode?.name} (${data.episode?.source.name})`;

export const episodeFormTitleResolver = queryTitleResolver(
    episodeTitleQuery, episodeFormTitle
);

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
    }`
);

const entityDescriptionFormTitle = <Key extends string>(
    data: EntityDescriptionTitleQueryData<Key>
) => {
    const key = _.first(_.without(_.keys(data), '__typename')) as Key;
    const entity = data[key];
    if (entity) {
        return `Edit ${entity.name} (${entity.source.name})`;
    } else {
        return 'Not found';
    }
}

export const agentFormTitleResolver = queryTitleResolver(
    agentTitleQuery, entityDescriptionFormTitle, true
);

type LetterTitleQueryData = EntityDescriptionTitleQueryData<'letterDescription'>;

const letterTitleQuery = (params: Params) => gql<LetterTitleQueryData, unknown>(`
    query LetterTitleQuery {
        letterDescription(id: "${params['id']}") {
            id
            name
            source { id, name }
        }
    }`
);


export const letterFormTitleResolver = queryTitleResolver(
    letterTitleQuery, entityDescriptionFormTitle, true
);


type GiftTitleQueryData = EntityDescriptionTitleQueryData<'giftDescription'>;

const giftTitleQuery = (params: Params) => gql<GiftTitleQueryData, unknown>(`
    query GiftTitleQuery {
        giftDescription(id: "${params['id']}") {
            id
            name
            source { id, name }
        }
    }`
);


export const giftFormTitleResolver = queryTitleResolver(
    giftTitleQuery, entityDescriptionFormTitle, true
);

type SpaceTitleQueryData = EntityDescriptionTitleQueryData<'spaceDescription'>;

const spaceTitleQuery = (params: Params) => gql<SpaceTitleQueryData, unknown>(`
    query SpaceTitleQuery {
        spaceDescription(id: "${params['id']}") {
            id
            name
            source { id, name }
        }
    }`
);

export const spaceFormTitleResolver = queryTitleResolver(
    spaceTitleQuery, entityDescriptionFormTitle, true
);

const agentViewTitle = (data: AgentTitleQueryData): string =>
    `${data.agentDescription?.name} (${data.agentDescription?.source.name})`;

export const agentViewTitleResolver = queryTitleResolver(
    agentTitleQuery, agentViewTitle
);

const locationViewTitle = (data: SpaceTitleQueryData): string =>
    `${data.spaceDescription?.name} (${data.spaceDescription?.source.name})`;

export const locationViewTitleResolver = queryTitleResolver(
    spaceTitleQuery, locationViewTitle
);

const letterViewTitle = (data: LetterTitleQueryData): string =>
    `${data.letterDescription?.name} (${data.letterDescription?.source.name})`;

export const letterViewTitleResolver = queryTitleResolver(
    letterTitleQuery, letterViewTitle
);

const giftViewTitle = (data: GiftTitleQueryData): string =>
    `${data.giftDescription?.name} (${data.giftDescription?.source.name})`;

export const giftViewTitleResolver = queryTitleResolver(
    giftTitleQuery, giftViewTitle
);

const sourceViewTitle = (data: SourceTitleQueryQuery) => `${data.source?.name}`;

export const sourceViewTitleResolver = queryTitleResolver(
    sourceTitleQuery, sourceViewTitle
);


const episodeViewTitle = (data: EpisodeTitleQueryQuery) =>
    `${data.episode?.name} (${data.episode?.source.name})`;

export const episodeViewTitleResolver = queryTitleResolver(
    episodeTitleQuery, episodeViewTitle
);

const caseStudyTitleQuery = (params: Params) => gql<CaseStudyTitleQueryQuery, unknown>(`
    query CaseStudyTitleQuery {
        caseStudy(id: "${params['id']}") {
            id
            name
        }
    }`
);

const caseStudyViewTitle = (data: CaseStudyTitleQueryQuery) =>
    data.caseStudy?.name || '';

export const caseStudyViewTitleResolver = queryTitleResolver(
    caseStudyTitleQuery, caseStudyViewTitle,
)
