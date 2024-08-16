import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AgentDescriptionGenderType = {
  __typename?: 'AgentDescriptionGenderType';
  agent: AgentDescriptionType;
  /** How certain are you of this value? */
  certainty: PersonAgentDescriptionGenderCertaintyChoices;
  /** The gender of this agent. The option Mixed is only applicable for groups. */
  gender: PersonAgentDescriptionGenderGenderChoices;
  id: Scalars['ID']['output'];
  /** Additional notes */
  note: Scalars['String']['output'];
  /** How is this information presented in the text? */
  sourceMention?: Maybe<PersonAgentDescriptionGenderSourceMentionChoices>;
};

export type AgentDescriptionLocationType = {
  __typename?: 'AgentDescriptionLocationType';
  agent: AgentDescriptionType;
  /** How certain are you of this value? */
  certainty: PersonAgentDescriptionLocationCertaintyChoices;
  id: Scalars['ID']['output'];
  /** location by which the agent is identified */
  location: SpaceDescriptionType;
  /** Additional notes */
  note: Scalars['String']['output'];
  /** How is this information presented in the text? */
  sourceMention?: Maybe<PersonAgentDescriptionLocationSourceMentionChoices>;
};

export type AgentDescriptionType = {
  __typename?: 'AgentDescriptionType';
  /** The book in the source */
  book: Scalars['String']['output'];
  /** The chapter or chapters in the source */
  chapter: Scalars['String']['output'];
  describes?: Maybe<Array<Maybe<HistoricalPersonType>>>;
  /** Longer description to help identify this object */
  description: Scalars['String']['output'];
  /** Relevant (Latin) terminology used to describe this entity in the source text */
  designators: Array<Scalars['String']['output']>;
  gender?: Maybe<AgentDescriptionGenderType>;
  id: Scalars['ID']['output'];
  /** Whether this agent is a group of people (e.g. 'the nuns of Poitiers'). */
  isGroup: Scalars['Boolean']['output'];
  location?: Maybe<AgentDescriptionLocationType>;
  /** A name to help identify this object */
  name: Scalars['String']['output'];
  /** The page number or page range in the source */
  page: Scalars['String']['output'];
  personReferences?: Maybe<Array<Maybe<PersonReferenceType>>>;
  /** Source text containing this description */
  source: SourceType;
  /** How is this entity presented in the text? */
  sourceMention?: Maybe<PersonAgentDescriptionSourceMentionChoices>;
};

export type CreateEpisodeMutation = {
  __typename?: 'CreateEpisodeMutation';
  episode?: Maybe<EpisodeType>;
  errors: Array<LettercraftErrorType>;
};

export type CreateEpisodeMutationInput = {
  name: Scalars['String']['input'];
  source: Scalars['ID']['input'];
};

export type DeleteEpisodeMutation = {
  __typename?: 'DeleteEpisodeMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type EpisodeCategoryType = {
  __typename?: 'EpisodeCategoryType';
  /** Longer description to help identify this object */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** A name to help identify this object */
  name: Scalars['String']['output'];
};

export type EpisodeType = {
  __typename?: 'EpisodeType';
  /** agents involved in this episode */
  agents: Array<AgentDescriptionType>;
  /** The book in the source */
  book: Scalars['String']['output'];
  categories: Array<EpisodeCategoryType>;
  /** The chapter or chapters in the source */
  chapter: Scalars['String']['output'];
  /** Longer description to help identify this object */
  description: Scalars['String']['output'];
  /** Relevant (Latin) terminology used to describe this entity in the source text */
  designators: Array<Scalars['String']['output']>;
  /** gifts involved in this episode */
  gifts: Array<GiftDescriptionType>;
  id: Scalars['ID']['output'];
  /** letters involved in this episode */
  letters: Array<LetterDescriptionType>;
  /** A name to help identify this object */
  name: Scalars['String']['output'];
  /** The page number or page range in the source */
  page: Scalars['String']['output'];
  /** Source text containing this description */
  source: SourceType;
  /** How is this entity presented in the text? */
  sourceMention?: Maybe<EventEpisodeSourceMentionChoices>;
  /** locations involved in this episode */
  spaces: Array<SpaceDescriptionType>;
  /** full description of the events in the passage */
  summary: Scalars['String']['output'];
};

/** An enumeration. */
export enum EventEpisodeSourceMentionChoices {
  /** directly mentioned */
  Direct = 'DIRECT',
  /** implied */
  Implied = 'IMPLIED'
}

export type GiftCategoryType = {
  __typename?: 'GiftCategoryType';
  /** Longer description to help identify this object */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** A name to help identify this object */
  name: Scalars['String']['output'];
};

export type GiftDescriptionCategoryType = {
  __typename?: 'GiftDescriptionCategoryType';
  category: GiftCategoryType;
  /** How certain are you of this value? */
  certainty: LetterGiftDescriptionCategoryCertaintyChoices;
  gift: GiftDescriptionType;
  id: Scalars['ID']['output'];
  /** Additional notes */
  note: Scalars['String']['output'];
  /** How is this information presented in the text? */
  sourceMention?: Maybe<LetterGiftDescriptionCategorySourceMentionChoices>;
};

export type GiftDescriptionType = {
  __typename?: 'GiftDescriptionType';
  /** The book in the source */
  book: Scalars['String']['output'];
  categories: Array<GiftCategoryType>;
  categorisations: Array<GiftDescriptionCategoryType>;
  /** The chapter or chapters in the source */
  chapter: Scalars['String']['output'];
  /** Longer description to help identify this object */
  description: Scalars['String']['output'];
  /** Relevant (Latin) terminology used to describe this entity in the source text */
  designators: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** A name to help identify this object */
  name: Scalars['String']['output'];
  /** The page number or page range in the source */
  page: Scalars['String']['output'];
  /** Source text containing this description */
  source: SourceType;
  /** How is this entity presented in the text? */
  sourceMention?: Maybe<LetterGiftDescriptionSourceMentionChoices>;
};

export type HistoricalPersonType = {
  __typename?: 'HistoricalPersonType';
  dateOfBirth?: Maybe<PersonDateOfBirthType>;
  dateOfDeath?: Maybe<PersonDateOfDeathType>;
  /** Longer description to help identify this object */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Whether this entity is identifiable (i.e. can be cross-referenced between descriptions), or a generic description */
  identifiable: Scalars['Boolean']['output'];
  /** A name to help identify this object */
  name: Scalars['String']['output'];
};

export type LetterCategoryType = {
  __typename?: 'LetterCategoryType';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
};

export type LetterDescriptionCategoryType = {
  __typename?: 'LetterDescriptionCategoryType';
  category: LetterCategoryType;
  /** How certain are you of this value? */
  certainty: LetterLetterDescriptionCategoryCertaintyChoices;
  id: Scalars['ID']['output'];
  letter: LetterDescriptionType;
  /** Additional notes */
  note: Scalars['String']['output'];
  /** How is this information presented in the text? */
  sourceMention?: Maybe<LetterLetterDescriptionCategorySourceMentionChoices>;
};

export type LetterDescriptionType = {
  __typename?: 'LetterDescriptionType';
  /** The book in the source */
  book: Scalars['String']['output'];
  categories: Array<LetterCategoryType>;
  categorisations: Array<LetterDescriptionCategoryType>;
  /** The chapter or chapters in the source */
  chapter: Scalars['String']['output'];
  /** Longer description to help identify this object */
  description: Scalars['String']['output'];
  /** Relevant (Latin) terminology used to describe this entity in the source text */
  designators: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** A name to help identify this object */
  name: Scalars['String']['output'];
  /** The page number or page range in the source */
  page: Scalars['String']['output'];
  /** Source text containing this description */
  source: SourceType;
  /** How is this entity presented in the text? */
  sourceMention?: Maybe<LetterLetterDescriptionSourceMentionChoices>;
};

/** An enumeration. */
export enum LetterGiftDescriptionCategoryCertaintyChoices {
  /** uncertain */
  A_0 = 'A_0',
  /** somewhat certain */
  A_1 = 'A_1',
  /** certain */
  A_2 = 'A_2'
}

/** An enumeration. */
export enum LetterGiftDescriptionCategorySourceMentionChoices {
  /** directly mentioned */
  Direct = 'DIRECT',
  /** implied */
  Implied = 'IMPLIED'
}

/** An enumeration. */
export enum LetterGiftDescriptionSourceMentionChoices {
  /** directly mentioned */
  Direct = 'DIRECT',
  /** implied */
  Implied = 'IMPLIED'
}

/** An enumeration. */
export enum LetterLetterDescriptionCategoryCertaintyChoices {
  /** uncertain */
  A_0 = 'A_0',
  /** somewhat certain */
  A_1 = 'A_1',
  /** certain */
  A_2 = 'A_2'
}

/** An enumeration. */
export enum LetterLetterDescriptionCategorySourceMentionChoices {
  /** directly mentioned */
  Direct = 'DIRECT',
  /** implied */
  Implied = 'IMPLIED'
}

/** An enumeration. */
export enum LetterLetterDescriptionSourceMentionChoices {
  /** directly mentioned */
  Direct = 'DIRECT',
  /** implied */
  Implied = 'IMPLIED'
}

/** A simple wrapper around Graphene-Django's ErrorType with a constructor. */
export type LettercraftErrorType = {
  __typename?: 'LettercraftErrorType';
  field: Scalars['String']['output'];
  messages: Array<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createEpisode?: Maybe<CreateEpisodeMutation>;
  deleteEpisode?: Maybe<DeleteEpisodeMutation>;
  updateEpisode?: Maybe<UpdateEpisodeMutation>;
  updateOrCreateSource?: Maybe<UpdateOrCreateSourceMutation>;
};


export type MutationCreateEpisodeArgs = {
  input: CreateEpisodeMutationInput;
};


export type MutationDeleteEpisodeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateEpisodeArgs = {
  input: UpdateEpisodeMutationInput;
};


export type MutationUpdateOrCreateSourceArgs = {
  input: UpdateCreateSourceInput;
};

/** An enumeration. */
export enum PersonAgentDescriptionGenderCertaintyChoices {
  /** uncertain */
  A_0 = 'A_0',
  /** somewhat certain */
  A_1 = 'A_1',
  /** certain */
  A_2 = 'A_2'
}

/** An enumeration. */
export enum PersonAgentDescriptionGenderGenderChoices {
  /** Female */
  Female = 'FEMALE',
  /** Male */
  Male = 'MALE',
  /** Mixed */
  Mixed = 'MIXED',
  /** Other */
  Other = 'OTHER',
  /** Unknown */
  Unknown = 'UNKNOWN'
}

/** An enumeration. */
export enum PersonAgentDescriptionGenderSourceMentionChoices {
  /** directly mentioned */
  Direct = 'DIRECT',
  /** implied */
  Implied = 'IMPLIED'
}

/** An enumeration. */
export enum PersonAgentDescriptionLocationCertaintyChoices {
  /** uncertain */
  A_0 = 'A_0',
  /** somewhat certain */
  A_1 = 'A_1',
  /** certain */
  A_2 = 'A_2'
}

/** An enumeration. */
export enum PersonAgentDescriptionLocationSourceMentionChoices {
  /** directly mentioned */
  Direct = 'DIRECT',
  /** implied */
  Implied = 'IMPLIED'
}

/** An enumeration. */
export enum PersonAgentDescriptionSourceMentionChoices {
  /** directly mentioned */
  Direct = 'DIRECT',
  /** implied */
  Implied = 'IMPLIED'
}

export type PersonDateOfBirthType = {
  __typename?: 'PersonDateOfBirthType';
  /** How certain are you of this value? */
  certainty: PersonPersonDateOfBirthCertaintyChoices;
  displayDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Additional notes */
  note: Scalars['String']['output'];
  /** date on which this person was born */
  person: HistoricalPersonType;
  /** The exact year of the value (if known). This will override the values in the lower and upper bounds fields. */
  yearExact?: Maybe<Scalars['Int']['output']>;
  /** The earliest possible year for this value */
  yearLower: Scalars['Int']['output'];
  /** The latest possible year for this value */
  yearUpper: Scalars['Int']['output'];
};

export type PersonDateOfDeathType = {
  __typename?: 'PersonDateOfDeathType';
  /** How certain are you of this value? */
  certainty: PersonPersonDateOfDeathCertaintyChoices;
  displayDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Additional notes */
  note: Scalars['String']['output'];
  /** date on which this person died */
  person: HistoricalPersonType;
  /** The exact year of the value (if known). This will override the values in the lower and upper bounds fields. */
  yearExact?: Maybe<Scalars['Int']['output']>;
  /** The earliest possible year for this value */
  yearLower: Scalars['Int']['output'];
  /** The latest possible year for this value */
  yearUpper: Scalars['Int']['output'];
};

/** An enumeration. */
export enum PersonPersonDateOfBirthCertaintyChoices {
  /** uncertain */
  A_0 = 'A_0',
  /** somewhat certain */
  A_1 = 'A_1',
  /** certain */
  A_2 = 'A_2'
}

/** An enumeration. */
export enum PersonPersonDateOfDeathCertaintyChoices {
  /** uncertain */
  A_0 = 'A_0',
  /** somewhat certain */
  A_1 = 'A_1',
  /** certain */
  A_2 = 'A_2'
}

/** An enumeration. */
export enum PersonPersonReferenceCertaintyChoices {
  /** uncertain */
  A_0 = 'A_0',
  /** somewhat certain */
  A_1 = 'A_1',
  /** certain */
  A_2 = 'A_2'
}

export type PersonReferenceType = {
  __typename?: 'PersonReferenceType';
  /** How certain are you of this value? */
  certainty: PersonPersonReferenceCertaintyChoices;
  description: AgentDescriptionType;
  id: Scalars['ID']['output'];
  /** Additional notes */
  note: Scalars['String']['output'];
  person: HistoricalPersonType;
};

export type Query = {
  __typename?: 'Query';
  agentDescription?: Maybe<AgentDescriptionType>;
  agentDescriptions: Array<AgentDescriptionType>;
  episode?: Maybe<EpisodeType>;
  episodes: Array<EpisodeType>;
  giftDescription?: Maybe<GiftDescriptionType>;
  giftDescriptions: Array<GiftDescriptionType>;
  letterDescription?: Maybe<LetterDescriptionType>;
  letterDescriptions: Array<LetterDescriptionType>;
  source: SourceType;
  sources: Array<SourceType>;
  spaceDescription?: Maybe<SpaceDescriptionType>;
  spaceDescriptions: Array<SpaceDescriptionType>;
};


export type QueryAgentDescriptionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAgentDescriptionsArgs = {
  episodeId?: InputMaybe<Scalars['ID']['input']>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryEpisodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEpisodesArgs = {
  sourceId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGiftDescriptionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGiftDescriptionsArgs = {
  episodeId?: InputMaybe<Scalars['ID']['input']>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLetterDescriptionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLetterDescriptionsArgs = {
  episodeId?: InputMaybe<Scalars['ID']['input']>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
};


export type QuerySourceArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySpaceDescriptionArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySpaceDescriptionsArgs = {
  sourceId?: InputMaybe<Scalars['ID']['input']>;
};

export type RegionFieldType = {
  __typename?: 'RegionFieldType';
  /** How certain are you of this value? */
  certainty: SpaceRegionFieldCertaintyChoices;
  id: Scalars['ID']['output'];
  /** Additional notes */
  note: Scalars['String']['output'];
  region: RegionType;
  /** How is this information presented in the text? */
  sourceMention?: Maybe<SpaceRegionFieldSourceMentionChoices>;
  space: SpaceDescriptionType;
};

export type RegionType = {
  __typename?: 'RegionType';
  /** Longer description to help identify this object */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Whether this entity is identifiable (i.e. can be cross-referenced between descriptions), or a generic description */
  identifiable: Scalars['Boolean']['output'];
  /** A name to help identify this object */
  name: Scalars['String']['output'];
  /** Kind of region */
  type: SpaceRegionTypeChoices;
};

export type SettlementFieldType = {
  __typename?: 'SettlementFieldType';
  /** How certain are you of this value? */
  certainty: SpaceSettlementFieldCertaintyChoices;
  id: Scalars['ID']['output'];
  /** Additional notes */
  note: Scalars['String']['output'];
  settlement: SettlementType;
  /** How is this information presented in the text? */
  sourceMention?: Maybe<SpaceSettlementFieldSourceMentionChoices>;
  space: SpaceDescriptionType;
};

export type SettlementType = {
  __typename?: 'SettlementType';
  /** Longer description to help identify this object */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Whether this entity is identifiable (i.e. can be cross-referenced between descriptions), or a generic description */
  identifiable: Scalars['Boolean']['output'];
  /** A name to help identify this object */
  name: Scalars['String']['output'];
  /** Surrounding regions of this settlement */
  regions: Array<RegionType>;
};

export type SourceContentsDateType = {
  __typename?: 'SourceContentsDateType';
  displayDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The source whose events took place at this date */
  source: SourceType;
  /** The exact year of the value (if known). This will override the values in the lower and upper bounds fields. */
  yearExact?: Maybe<Scalars['Int']['output']>;
  /** The earliest possible year for this value */
  yearLower: Scalars['Int']['output'];
  /** The latest possible year for this value */
  yearUpper: Scalars['Int']['output'];
};

export type SourceType = {
  __typename?: 'SourceType';
  contentsDate?: Maybe<SourceContentsDateType>;
  /** The name of the author of the edition */
  editionAuthor: Scalars['String']['output'];
  /** The title of the edition used for this source */
  editionTitle: Scalars['String']['output'];
  episodes: Array<EpisodeType>;
  id: Scalars['ID']['output'];
  /** The name of the original author of the work, if known */
  medievalAuthor: Scalars['String']['output'];
  /** The original title of the work, if known */
  medievalTitle: Scalars['String']['output'];
  /** a unique name to identify this source in the database */
  name: Scalars['String']['output'];
  numOfEpisodes: Scalars['Int']['output'];
  writtenDate?: Maybe<SourceWrittenDateType>;
};

export type SourceWrittenDateType = {
  __typename?: 'SourceWrittenDateType';
  displayDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The source that was written at this date */
  source: SourceType;
  /** The exact year of the value (if known). This will override the values in the lower and upper bounds fields. */
  yearExact?: Maybe<Scalars['Int']['output']>;
  /** The earliest possible year for this value */
  yearLower: Scalars['Int']['output'];
  /** The latest possible year for this value */
  yearUpper: Scalars['Int']['output'];
};

export type SpaceDescriptionType = {
  __typename?: 'SpaceDescriptionType';
  /** The book in the source */
  book: Scalars['String']['output'];
  /** The chapter or chapters in the source */
  chapter: Scalars['String']['output'];
  /** Longer description to help identify this object */
  description: Scalars['String']['output'];
  /** Relevant (Latin) terminology used to describe this entity in the source text */
  designators: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** A name to help identify this object */
  name: Scalars['String']['output'];
  /** The page number or page range in the source */
  page: Scalars['String']['output'];
  regionFields: Array<RegionFieldType>;
  regions: Array<RegionType>;
  settlementFields: Array<SettlementFieldType>;
  settlements: Array<SettlementType>;
  /** Source text containing this description */
  source: SourceType;
  /** How is this entity presented in the text? */
  sourceMention?: Maybe<SpaceSpaceDescriptionSourceMentionChoices>;
  structureFields: Array<StructureFieldType>;
  structures: Array<StructureType>;
};

/** An enumeration. */
export enum SpaceRegionFieldCertaintyChoices {
  /** uncertain */
  A_0 = 'A_0',
  /** somewhat certain */
  A_1 = 'A_1',
  /** certain */
  A_2 = 'A_2'
}

/** An enumeration. */
export enum SpaceRegionFieldSourceMentionChoices {
  /** directly mentioned */
  Direct = 'DIRECT',
  /** implied */
  Implied = 'IMPLIED'
}

/** An enumeration. */
export enum SpaceRegionTypeChoices {
  /** ecclesiastical */
  Ecclesiastical = 'ECCLESIASTICAL',
  /** geographical */
  Geographical = 'GEOGRAPHICAL',
  /** political */
  Political = 'POLITICAL'
}

/** An enumeration. */
export enum SpaceSettlementFieldCertaintyChoices {
  /** uncertain */
  A_0 = 'A_0',
  /** somewhat certain */
  A_1 = 'A_1',
  /** certain */
  A_2 = 'A_2'
}

/** An enumeration. */
export enum SpaceSettlementFieldSourceMentionChoices {
  /** directly mentioned */
  Direct = 'DIRECT',
  /** implied */
  Implied = 'IMPLIED'
}

/** An enumeration. */
export enum SpaceSpaceDescriptionSourceMentionChoices {
  /** directly mentioned */
  Direct = 'DIRECT',
  /** implied */
  Implied = 'IMPLIED'
}

/** An enumeration. */
export enum SpaceStructureFieldCertaintyChoices {
  /** uncertain */
  A_0 = 'A_0',
  /** somewhat certain */
  A_1 = 'A_1',
  /** certain */
  A_2 = 'A_2'
}

/** An enumeration. */
export enum SpaceStructureFieldSourceMentionChoices {
  /** directly mentioned */
  Direct = 'DIRECT',
  /** implied */
  Implied = 'IMPLIED'
}

/** An enumeration. */
export enum SpaceStructureLevelChoices {
  /** road, square, crossroad */
  A_1 = 'A_1',
  /** fortification */
  A_2 = 'A_2',
  /** building, vessel */
  A_3 = 'A_3',
  /** room */
  A_4 = 'A_4',
  /** spot, object */
  A_5 = 'A_5'
}

export type StructureFieldType = {
  __typename?: 'StructureFieldType';
  /** How certain are you of this value? */
  certainty: SpaceStructureFieldCertaintyChoices;
  id: Scalars['ID']['output'];
  /** Additional notes */
  note: Scalars['String']['output'];
  /** How is this information presented in the text? */
  sourceMention?: Maybe<SpaceStructureFieldSourceMentionChoices>;
  space: SpaceDescriptionType;
  structure: StructureType;
};

export type StructureType = {
  __typename?: 'StructureType';
  /** Longer description to help identify this object */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Whether this entity is identifiable (i.e. can be cross-referenced between descriptions), or a generic description */
  identifiable: Scalars['Boolean']['output'];
  level: SpaceStructureLevelChoices;
  /** A name to help identify this object */
  name: Scalars['String']['output'];
  /** The settlement containing this structure */
  settlement?: Maybe<SettlementType>;
};

export type UpdateCreateSourceInput = {
  editionAuthor?: InputMaybe<Scalars['String']['input']>;
  editionTitle?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  medievalAuthor?: InputMaybe<Scalars['String']['input']>;
  medievalTitle?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type UpdateEpisodeMutation = {
  __typename?: 'UpdateEpisodeMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type UpdateEpisodeMutationInput = {
  book?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Array<Scalars['ID']['input']>>;
  chapter?: InputMaybe<Scalars['String']['input']>;
  designators?: InputMaybe<Array<Scalars['String']['input']>>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrCreateSourceMutation = {
  __typename?: 'UpdateOrCreateSourceMutation';
  errors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  source?: Maybe<SourceType>;
};

export type DataEntryAgentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryAgentQuery = { __typename?: 'Query', agentDescription?: { __typename?: 'AgentDescriptionType', id: string, name: string, description: string, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export type DataEntryEpisodeContentsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryEpisodeContentsQuery = { __typename?: 'Query', episode?: { __typename?: 'EpisodeType', id: string, summary: string, categories: Array<{ __typename?: 'EpisodeCategoryType', id: string }> } | null };

export type DataEntryEpisodeIdentificationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryEpisodeIdentificationQuery = { __typename?: 'Query', episode?: { __typename?: 'EpisodeType', id: string, name: string } | null };

export type DataEntryEpisodeSourceTextMentionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryEpisodeSourceTextMentionQuery = { __typename?: 'Query', episode?: { __typename?: 'EpisodeType', id: string, designators: Array<string>, book: string, chapter: string, page: string } | null };

export type DataEntryEpisodeFormQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryEpisodeFormQuery = { __typename?: 'Query', episode?: { __typename?: 'EpisodeType', id: string, name: string, description: string, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export type DataEntryUpdateEpisodeMutationVariables = Exact<{
  input: UpdateEpisodeMutationInput;
}>;


export type DataEntryUpdateEpisodeMutation = { __typename?: 'Mutation', updateEpisode?: { __typename?: 'UpdateEpisodeMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntryCreateEpisodeMutationVariables = Exact<{
  input: CreateEpisodeMutationInput;
}>;


export type DataEntryCreateEpisodeMutation = { __typename?: 'Mutation', createEpisode?: { __typename?: 'CreateEpisodeMutation', episode?: { __typename?: 'EpisodeType', id: string } | null, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntryGiftQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryGiftQuery = { __typename?: 'Query', giftDescription?: { __typename?: 'GiftDescriptionType', id: string, name: string, description: string, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export type DataEntryLetterQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryLetterQuery = { __typename?: 'Query', letterDescription?: { __typename?: 'LetterDescriptionType', id: string, name: string, description: string, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export type DataEntrySpaceDescriptionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntrySpaceDescriptionQuery = { __typename?: 'Query', spaceDescription?: { __typename?: 'SpaceDescriptionType', id: string, name: string, description: string, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export type DataEntryDeleteEpisodeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryDeleteEpisodeMutation = { __typename?: 'Mutation', deleteEpisode?: { __typename?: 'DeleteEpisodeMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntrySourceDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntrySourceDetailQuery = { __typename?: 'Query', source: { __typename?: 'SourceType', id: string, name: string, editionAuthor: string, editionTitle: string, medievalAuthor: string, medievalTitle: string, numOfEpisodes: number, episodes: Array<{ __typename?: 'EpisodeType', id: string, name: string, description: string, summary: string, book: string, chapter: string, page: string, agents: Array<{ __typename?: 'AgentDescriptionType', id: string, name: string, isGroup: boolean, describes?: Array<{ __typename?: 'HistoricalPersonType', id: string, identifiable: boolean } | null> | null }>, gifts: Array<{ __typename?: 'GiftDescriptionType', id: string, name: string }>, letters: Array<{ __typename?: 'LetterDescriptionType', id: string, name: string }>, spaces: Array<{ __typename?: 'SpaceDescriptionType', id: string, name: string }> }> } };

export type DataEntrySourceListQueryVariables = Exact<{ [key: string]: never; }>;


export type DataEntrySourceListQuery = { __typename?: 'Query', sources: Array<{ __typename?: 'SourceType', id: string, name: string, editionAuthor: string, editionTitle: string, medievalAuthor: string, medievalTitle: string, numOfEpisodes: number }> };

export const DataEntryAgentDocument = gql`
    query DataEntryAgent($id: ID!) {
  agentDescription(id: $id) {
    id
    name
    description
    source {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryAgentGQL extends Apollo.Query<DataEntryAgentQuery, DataEntryAgentQueryVariables> {
    override document = DataEntryAgentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryEpisodeContentsDocument = gql`
    query DataEntryEpisodeContents($id: ID!) {
  episode(id: $id) {
    id
    summary
    categories {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryEpisodeContentsGQL extends Apollo.Query<DataEntryEpisodeContentsQuery, DataEntryEpisodeContentsQueryVariables> {
    override document = DataEntryEpisodeContentsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryEpisodeIdentificationDocument = gql`
    query DataEntryEpisodeIdentification($id: ID!) {
  episode(id: $id) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryEpisodeIdentificationGQL extends Apollo.Query<DataEntryEpisodeIdentificationQuery, DataEntryEpisodeIdentificationQueryVariables> {
    override document = DataEntryEpisodeIdentificationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryEpisodeSourceTextMentionDocument = gql`
    query DataEntryEpisodeSourceTextMention($id: ID!) {
  episode(id: $id) {
    id
    designators
    book
    chapter
    page
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryEpisodeSourceTextMentionGQL extends Apollo.Query<DataEntryEpisodeSourceTextMentionQuery, DataEntryEpisodeSourceTextMentionQueryVariables> {
    override document = DataEntryEpisodeSourceTextMentionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryEpisodeFormDocument = gql`
    query DataEntryEpisodeForm($id: ID!) {
  episode(id: $id) {
    id
    name
    description
    source {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryEpisodeFormGQL extends Apollo.Query<DataEntryEpisodeFormQuery, DataEntryEpisodeFormQueryVariables> {
    override document = DataEntryEpisodeFormDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryUpdateEpisodeDocument = gql`
    mutation DataEntryUpdateEpisode($input: UpdateEpisodeMutationInput!) {
  updateEpisode(input: $input) {
    ok
    errors {
      field
      messages
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryUpdateEpisodeGQL extends Apollo.Mutation<DataEntryUpdateEpisodeMutation, DataEntryUpdateEpisodeMutationVariables> {
    override document = DataEntryUpdateEpisodeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryCreateEpisodeDocument = gql`
    mutation DataEntryCreateEpisode($input: CreateEpisodeMutationInput!) {
  createEpisode(input: $input) {
    episode {
      id
    }
    errors {
      field
      messages
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryCreateEpisodeGQL extends Apollo.Mutation<DataEntryCreateEpisodeMutation, DataEntryCreateEpisodeMutationVariables> {
    override document = DataEntryCreateEpisodeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryGiftDocument = gql`
    query DataEntryGift($id: ID!) {
  giftDescription(id: $id) {
    id
    name
    description
    source {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryGiftGQL extends Apollo.Query<DataEntryGiftQuery, DataEntryGiftQueryVariables> {
    override document = DataEntryGiftDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryLetterDocument = gql`
    query DataEntryLetter($id: ID!) {
  letterDescription(id: $id) {
    id
    name
    description
    source {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryLetterGQL extends Apollo.Query<DataEntryLetterQuery, DataEntryLetterQueryVariables> {
    override document = DataEntryLetterDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntrySpaceDescriptionDocument = gql`
    query DataEntrySpaceDescription($id: ID!) {
  spaceDescription(id: $id) {
    id
    name
    description
    source {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntrySpaceDescriptionGQL extends Apollo.Query<DataEntrySpaceDescriptionQuery, DataEntrySpaceDescriptionQueryVariables> {
    override document = DataEntrySpaceDescriptionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryDeleteEpisodeDocument = gql`
    mutation DataEntryDeleteEpisode($id: ID!) {
  deleteEpisode(id: $id) {
    ok
    errors {
      field
      messages
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryDeleteEpisodeGQL extends Apollo.Mutation<DataEntryDeleteEpisodeMutation, DataEntryDeleteEpisodeMutationVariables> {
    override document = DataEntryDeleteEpisodeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntrySourceDetailDocument = gql`
    query DataEntrySourceDetail($id: ID!) {
  source(id: $id) {
    id
    name
    editionAuthor
    editionTitle
    medievalAuthor
    medievalTitle
    numOfEpisodes
    episodes {
      id
      name
      description
      summary
      book
      chapter
      page
      agents {
        id
        name
        isGroup
        describes {
          id
          identifiable
        }
      }
      gifts {
        id
        name
      }
      letters {
        id
        name
      }
      spaces {
        id
        name
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntrySourceDetailGQL extends Apollo.Query<DataEntrySourceDetailQuery, DataEntrySourceDetailQueryVariables> {
    override document = DataEntrySourceDetailDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntrySourceListDocument = gql`
    query DataEntrySourceList {
  sources {
    id
    name
    editionAuthor
    editionTitle
    medievalAuthor
    medievalTitle
    numOfEpisodes
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntrySourceListGQL extends Apollo.Query<DataEntrySourceListQuery, DataEntrySourceListQueryVariables> {
    override document = DataEntrySourceListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }