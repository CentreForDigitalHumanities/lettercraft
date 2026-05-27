import { dataIcons } from "@shared/icons";
import { agentIcon, locationIcon } from "@shared/icons-utils";
import { BrowseAgentsPageQuery, BrowseEpisodesPageQuery, BrowseGiftsPageQuery, BrowseLettersPageQuery, BrowseLocationsPageQuery, BrowseSourcesPageQuery } from "generated/graphql";

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
    categories: { name: string }[];
    designators: string[];
    agents: ListItemEntity[];
    letters: ListItemEntity[];
    gifts: ListItemEntity[];
    spaces: ListItemEntity[];
    source: ListItemSource,
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
    source: ListItemSource,
}

export type BrowseListItem = EpisodeListItem | EntityListItem | SourceListItem;


export const transformSource = (source: BrowseSourcesPageQuery['sources'][number]): BrowseListItem => ({
    id: source.id,
    name: source.name,
    type: 'source',
    description: source.descriptionText,
    numOfEpisodes: source.episodes.length,
    icon: dataIcons.source,
    link: `sources/${source.id}`,
});


export const transformEpisode = (episode: BrowseEpisodesPageQuery['episodes'][number]): BrowseListItem => ({
    id: episode.id,
    name: episode.name,
    type: 'episode',
    description: episode.summary,
    icon: dataIcons.episode,
    link: `episodes/${episode.id}`,
    source: episode.source,
    categories: episode.categories ?? [],
    designators: episode.designators,
    agents: episode.agents.map(({ agent }) => ({
        id: agent.id,
        name: agent.name,
        icon: agentIcon(agent),
        link: `agents/${agent.id}`
    })),
    letters: episode.letters.map(({ letter }) => ({
        id: letter.id,
        name: letter.name,
        icon: dataIcons.letter,
        link: `letters/${letter.id}`
    })),
    gifts: episode.gifts.map(({ gift }) => ({
        id: gift.id,
        name: gift.name,
        icon: dataIcons.gift,
        link: `gifts/${gift.id}`
    })),
    spaces: episode.spaces.map(({ space }) => ({
        id: space.id,
        name: space.name,
        icon: locationIcon(space),
        link: `locations/${space.id}`
    })),
    sourceLocation: {
        book: episode.book,
        chapter: episode.chapter,
        page: episode.page
    },
});

export const transformEntity = <Item extends
    BrowseAgentsPageQuery['agentDescriptions'][number] |
    BrowseLettersPageQuery['letterDescriptions'][number] |
    BrowseGiftsPageQuery['giftDescriptions'][number] |
    BrowseLocationsPageQuery['spaceDescriptions'][number]
>(entity: Item, icon: (e: Item) => string, path: string): BrowseListItem => ({
    id: entity.id,
    name: entity.name,
    type: 'entity',
    description: entity.description,
    icon: icon(entity),
    link: `${path}/${entity.id}`,
    numOfEpisodes: entity.episodes.length,
    source: entity.source,
});
