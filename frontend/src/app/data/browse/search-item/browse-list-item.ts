import { dataIcons } from "@shared/icons";
import { agentIcon, locationIcon } from "@shared/icons-utils";
import { BrowseAgentsPageQuery, BrowseEpisodesPageQuery, BrowseGiftsPageQuery, BrowseLettersPageQuery, BrowseLocationsPageQuery, BrowseSourcesPageQuery, Entity, ViewAgentQuery, ViewEpisodeQuery, ViewGiftQuery, ViewLetterQuery, ViewLocationQuery, ViewSourceEpisodesPageQuery } from "generated/graphql";
import _ from "underscore";

interface ListItemEntity {
    id: string;
    name: string;
    icon: string;
    link: string;
}

interface BaseListItem {
    id: string;
    name: string;
    description: string;
    icon: string;
    link: string;
}

interface ListItemSource {
    id: string;
    name: string;
}

interface EpisodeListItem extends BaseListItem {
    type: 'episode';
    categories: { id: string, name: string }[];
    designators: string[];
    agents: ListItemEntity[];
    letters: ListItemEntity[];
    gifts: ListItemEntity[];
    spaces: ListItemEntity[];
    source?: ListItemSource,
    sourceLocation: {
        book: string;
        chapter: string;
        page: string;
    };
}

interface SourceListItem extends BaseListItem {
    type: 'source';
    numOfEpisodes: number;
}

export interface EntityListItem extends BaseListItem {
    type: 'entity';
    numOfEpisodes: number;
    source?: ListItemSource,
}

export type BrowseListItem = EpisodeListItem | EntityListItem | SourceListItem;

type SourceData = BrowseSourcesPageQuery['sources'][number] |
        NonNullable<ViewEpisodeQuery['episode']>['source'] |
        NonNullable<ViewAgentQuery['agentDescription']>['source'] |
        NonNullable<ViewLetterQuery['letterDescription']>['source'] |
        NonNullable<ViewGiftQuery['giftDescription']>['source'] |
        NonNullable<ViewLocationQuery['spaceDescription']>['source'];

export const transformSource = (source: SourceData): BrowseListItem => ({
    id: source.id,
    name: source.name,
    type: 'source',
    description: source.descriptionText,
    numOfEpisodes: source.episodes.length,
    icon: dataIcons.source,
    link: `/data/sources/${source.id}`,
});


type EpisodeData =  BrowseEpisodesPageQuery['episodes'][number] |
    ViewSourceEpisodesPageQuery['episodes'][number] |
    NonNullable<ViewAgentQuery['agentDescription']>['episodes'][number]['episode'] |
    NonNullable<ViewLetterQuery['letterDescription']>['episodes'][number]['episode'] |
    NonNullable<ViewGiftQuery['giftDescription']>['episodes'][number]['episode'] |
    NonNullable<ViewLocationQuery['spaceDescription']>['episodes'][number]['episode'];

export const transformEpisode = (episode: EpisodeData): BrowseListItem => ({
    id: episode.id,
    name: episode.name,
    type: 'episode',
    description: episode.summary,
    icon: dataIcons.episode,
    link: `/data/episodes/${episode.id}`,
    source: _.get(episode, 'source') as ListItemSource | undefined,
    categories: episode.categories ?? [],
    designators: episode.designators,
    agents: episode.agents.map(({ agent }) => ({
        id: agent.id,
        name: agent.name,
        icon: agentIcon(agent),
        link: `/data/agents/${agent.id}`
    })),
    letters: episode.letters.map(({ letter }) => ({
        id: letter.id,
        name: letter.name,
        icon: dataIcons.letter,
        link: `/data/letters/${letter.id}`
    })),
    gifts: episode.gifts.map(({ gift }) => ({
        id: gift.id,
        name: gift.name,
        icon: dataIcons.gift,
        link: `/data/gifts/${gift.id}`
    })),
    spaces: episode.spaces.map(({ space }) => ({
        id: space.id,
        name: space.name,
        icon: locationIcon(space),
        link: `/data/locations/${space.id}`
    })),
    sourceLocation: {
        book: episode.book,
        chapter: episode.chapter,
        page: episode.page
    },
});


type EntityData = BrowseAgentsPageQuery['agentDescriptions'][number] |
    BrowseLettersPageQuery['letterDescriptions'][number] |
    BrowseGiftsPageQuery['giftDescriptions'][number] |
    BrowseLocationsPageQuery['spaceDescriptions'][number] |
    NonNullable<ViewEpisodeQuery['episode']>['agents'][number]['agent'] |
    NonNullable<ViewEpisodeQuery['episode']>['letters'][number]['letter'] |
    NonNullable<ViewEpisodeQuery['episode']>['gifts'][number]['gift'] |
    NonNullable<ViewEpisodeQuery['episode']>['spaces'][number]['space'];


export const transformEntity = <Item extends EntityData>(
    entity: Item, icon: (e: Item) => string, path: string
): BrowseListItem => ({
    id: entity.id,
    name: entity.name,
    type: 'entity',
    description: entity.description,
    icon: icon(entity),
    link: `/data/${path}/${entity.id}`,
    numOfEpisodes: entity.episodes.length,
    source: _.get(entity, 'source') as ListItemSource | undefined,
});


export const transformAgent: (e: EntityData) => BrowseListItem =
    _.partial(transformEntity as any, _, agentIcon, 'agents');
export const transformLetter: (e: EntityData) => BrowseListItem =
    _.partial(transformEntity as any, _, _.constant(dataIcons.letter), 'letters');
export const transformGift: (e: EntityData) => BrowseListItem =
    _.partial(transformEntity as any, _, _.constant(dataIcons.gift), 'gifts');
export const transformLocation: (e: EntityData) => BrowseListItem =
    _.partial(transformEntity as any, _, locationIcon, 'locations');
