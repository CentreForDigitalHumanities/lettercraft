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
  certainty: Certainty;
  gender: Gender;
  id: Scalars['ID']['output'];
  /** Additional notes */
  note: Scalars['String']['output'];
  sourceMention: SourceMention;
};

export type AgentDescriptionLocationType = {
  __typename?: 'AgentDescriptionLocationType';
  agent: AgentDescriptionType;
  certainty: Certainty;
  id: Scalars['ID']['output'];
  /** location by which the agent is identified */
  location: SpaceDescriptionType;
  /** Additional notes */
  note: Scalars['String']['output'];
  sourceMention: SourceMention;
};

export type AgentDescriptionType = EntityDescription & {
  __typename?: 'AgentDescriptionType';
  /** The book in the source */
  book: Scalars['String']['output'];
  /** The chapter or chapters in the source */
  chapter: Scalars['String']['output'];
  contributors: Array<UserType>;
  describes: Array<HistoricalPersonType>;
  description: Scalars['String']['output'];
  episodes: Array<EpisodeAgentType>;
  gender?: Maybe<AgentDescriptionGenderType>;
  id: Scalars['ID']['output'];
  identified: Scalars['Boolean']['output'];
  /** Whether this agent is a group of people (e.g. 'the nuns of Poitiers'). */
  isGroup: Scalars['Boolean']['output'];
  location?: Maybe<AgentDescriptionLocationType>;
  name: Scalars['String']['output'];
  /** The page number or page range in the source */
  page: Scalars['String']['output'];
  personReferences: Array<PersonReferenceType>;
  /** Source text containing this description */
  source: SourceType;
  /** How is this entity presented in the text? */
  sourceMention?: Maybe<PersonAgentDescriptionSourceMentionChoices>;
};

/** An enumeration. */
export enum Certainty {
  Certain = 'CERTAIN',
  SomewhatCertain = 'SOMEWHAT_CERTAIN',
  Uncertain = 'UNCERTAIN'
}

export type CreateAgentMutation = {
  __typename?: 'CreateAgentMutation';
  agent?: Maybe<AgentDescriptionType>;
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type CreateEntityDescriptionInput = {
  episodes?: InputMaybe<Array<Scalars['ID']['input']>>;
  name: Scalars['String']['input'];
  source: Scalars['ID']['input'];
};

export type CreateEpisodeEntityLinkInput = {
  entity: Scalars['ID']['input'];
  entityType: Entity;
  episode: Scalars['ID']['input'];
};

export type CreateEpisodeEntityLinkMutation = {
  __typename?: 'CreateEpisodeEntityLinkMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type CreateEpisodeInput = {
  name: Scalars['String']['input'];
  source: Scalars['ID']['input'];
};

export type CreateEpisodeMutation = {
  __typename?: 'CreateEpisodeMutation';
  episode?: Maybe<EpisodeType>;
  errors: Array<LettercraftErrorType>;
};

export type CreateGiftMutation = {
  __typename?: 'CreateGiftMutation';
  errors: Array<LettercraftErrorType>;
  gift?: Maybe<GiftDescriptionType>;
  ok: Scalars['Boolean']['output'];
};

export type CreateLetterMutation = {
  __typename?: 'CreateLetterMutation';
  errors: Array<LettercraftErrorType>;
  letter?: Maybe<LetterDescriptionType>;
  ok: Scalars['Boolean']['output'];
};

export type CreatePersonReferenceInput = {
  description: Scalars['ID']['input'];
  person: Scalars['ID']['input'];
};

export type CreatePersonReferenceMutation = {
  __typename?: 'CreatePersonReferenceMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type CreateSpaceMutation = {
  __typename?: 'CreateSpaceMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
  space?: Maybe<SpaceDescriptionType>;
};

export type DeleteAgentMutation = {
  __typename?: 'DeleteAgentMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type DeleteEpisodeEntityLinkMutation = {
  __typename?: 'DeleteEpisodeEntityLinkMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type DeleteEpisodeMutation = {
  __typename?: 'DeleteEpisodeMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type DeleteGiftMutation = {
  __typename?: 'DeleteGiftMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type DeleteLetterMutation = {
  __typename?: 'DeleteLetterMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type DeletePersonReferenceMutation = {
  __typename?: 'DeletePersonReferenceMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export enum Entity {
  Agent = 'AGENT',
  Gift = 'GIFT',
  Letter = 'LETTER',
  Space = 'SPACE'
}

export type EntityDescription = {
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type EpisodeAgentType = EpisodeEntityLink & {
  __typename?: 'EpisodeAgentType';
  agent: AgentDescriptionType;
  certainty: Certainty;
  designators?: Maybe<Array<Scalars['String']['output']>>;
  entity: EntityDescription;
  episode: EpisodeType;
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  sourceMention: SourceMention;
};

export type EpisodeCategoryType = {
  __typename?: 'EpisodeCategoryType';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type EpisodeEntityLink = {
  designators?: Maybe<Array<Scalars['String']['output']>>;
  entity: EntityDescription;
  episode: EpisodeType;
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  sourceMention: SourceMention;
};

export type EpisodeGiftType = EpisodeEntityLink & {
  __typename?: 'EpisodeGiftType';
  certainty: Certainty;
  designators?: Maybe<Array<Scalars['String']['output']>>;
  entity: EntityDescription;
  episode: EpisodeType;
  gift: GiftDescriptionType;
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  sourceMention: SourceMention;
};

export type EpisodeLetterType = EpisodeEntityLink & {
  __typename?: 'EpisodeLetterType';
  certainty: Certainty;
  designators?: Maybe<Array<Scalars['String']['output']>>;
  entity: EntityDescription;
  episode: EpisodeType;
  id: Scalars['ID']['output'];
  letter: LetterDescriptionType;
  note?: Maybe<Scalars['String']['output']>;
  sourceMention: SourceMention;
};

export type EpisodeSpaceType = EpisodeEntityLink & {
  __typename?: 'EpisodeSpaceType';
  certainty: Certainty;
  designators?: Maybe<Array<Scalars['String']['output']>>;
  entity: EntityDescription;
  episode: EpisodeType;
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  sourceMention: SourceMention;
  space: SpaceDescriptionType;
};

export type EpisodeType = EntityDescription & {
  __typename?: 'EpisodeType';
  /** agents involved in this episode */
  agents: Array<AgentDescriptionType>;
  /** The book in the source */
  book: Scalars['String']['output'];
  categories: Array<EpisodeCategoryType>;
  /** The chapter or chapters in the source */
  chapter: Scalars['String']['output'];
  contributors: Array<UserType>;
  description: Scalars['String']['output'];
  /** Relevant (Latin) terminology used to describe the actions in the episode */
  designators: Array<Scalars['String']['output']>;
  /** gifts involved in this episode */
  gifts: Array<GiftDescriptionType>;
  id: Scalars['ID']['output'];
  /** letters involved in this episode */
  letters: Array<LetterDescriptionType>;
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

/** An enumeration. */
export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Mixed = 'MIXED',
  Other = 'OTHER',
  Unknown = 'UNKNOWN'
}

export type GiftCategorisationInput = {
  category: Scalars['ID']['input'];
  certainty?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  sourceMention?: InputMaybe<SourceMention>;
};

export type GiftCategoryType = {
  __typename?: 'GiftCategoryType';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type GiftDescriptionCategoryType = {
  __typename?: 'GiftDescriptionCategoryType';
  category: GiftCategoryType;
  certainty: Certainty;
  gift: GiftDescriptionType;
  id: Scalars['ID']['output'];
  /** Additional notes */
  note: Scalars['String']['output'];
  sourceMention: SourceMention;
};

export type GiftDescriptionType = EntityDescription & {
  __typename?: 'GiftDescriptionType';
  /** The book in the source */
  book: Scalars['String']['output'];
  categories: Array<GiftCategoryType>;
  categorisations: Array<GiftDescriptionCategoryType>;
  /** The chapter or chapters in the source */
  chapter: Scalars['String']['output'];
  contributors: Array<UserType>;
  description: Scalars['String']['output'];
  episodes: Array<EpisodeGiftType>;
  id: Scalars['ID']['output'];
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
  contributors: Array<UserType>;
  dateOfBirth?: Maybe<PersonDateOfBirthType>;
  dateOfDeath?: Maybe<PersonDateOfDeathType>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Whether this entity is identifiable (i.e. can be cross-referenced between descriptions), or a generic description */
  identifiable: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type LetterCategorisationInput = {
  category: Scalars['ID']['input'];
  certainty?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  sourceMention?: InputMaybe<SourceMention>;
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
  certainty: Certainty;
  id: Scalars['ID']['output'];
  letter: LetterDescriptionType;
  /** Additional notes */
  note: Scalars['String']['output'];
  sourceMention: SourceMention;
};

export type LetterDescriptionType = EntityDescription & {
  __typename?: 'LetterDescriptionType';
  /** The book in the source */
  book: Scalars['String']['output'];
  categories: Array<LetterCategoryType>;
  categorisations: Array<LetterDescriptionCategoryType>;
  /** The chapter or chapters in the source */
  chapter: Scalars['String']['output'];
  contributors: Array<UserType>;
  description: Scalars['String']['output'];
  episodes: Array<EpisodeLetterType>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** The page number or page range in the source */
  page: Scalars['String']['output'];
  /** Source text containing this description */
  source: SourceType;
  /** How is this entity presented in the text? */
  sourceMention?: Maybe<LetterLetterDescriptionSourceMentionChoices>;
};

/** An enumeration. */
export enum LetterGiftDescriptionSourceMentionChoices {
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
  createAgent?: Maybe<CreateAgentMutation>;
  createEpisode?: Maybe<CreateEpisodeMutation>;
  createEpisodeEntityLink?: Maybe<CreateEpisodeEntityLinkMutation>;
  createGift?: Maybe<CreateGiftMutation>;
  createLetter?: Maybe<CreateLetterMutation>;
  createPersonReference?: Maybe<CreatePersonReferenceMutation>;
  createSpace?: Maybe<CreateSpaceMutation>;
  deleteAgent?: Maybe<DeleteAgentMutation>;
  deleteEpisode?: Maybe<DeleteEpisodeMutation>;
  deleteEpisodeEntityLink?: Maybe<DeleteEpisodeEntityLinkMutation>;
  deleteGift?: Maybe<DeleteGiftMutation>;
  deleteLetter?: Maybe<DeleteLetterMutation>;
  deletePersonReference?: Maybe<DeletePersonReferenceMutation>;
  updateAgent?: Maybe<UpdateAgentMutation>;
  updateEpisode?: Maybe<UpdateEpisodeMutation>;
  updateEpisodeEntityLink?: Maybe<UpdateEpisodeEntityLinkMutation>;
  updateGift?: Maybe<UpdateGiftMutation>;
  updateLetter?: Maybe<UpdateLetterMutation>;
  updateOrCreateSource?: Maybe<UpdateOrCreateSourceMutation>;
  updatePersonReference?: Maybe<UpdatePersonReferenceMutation>;
};


export type MutationCreateAgentArgs = {
  agentData: CreateEntityDescriptionInput;
};


export type MutationCreateEpisodeArgs = {
  episodeData: CreateEpisodeInput;
};


export type MutationCreateEpisodeEntityLinkArgs = {
  data: CreateEpisodeEntityLinkInput;
};


export type MutationCreateGiftArgs = {
  giftData: CreateEntityDescriptionInput;
};


export type MutationCreateLetterArgs = {
  letterData: CreateEntityDescriptionInput;
};


export type MutationCreatePersonReferenceArgs = {
  referenceData: CreatePersonReferenceInput;
};


export type MutationCreateSpaceArgs = {
  spaceData: CreateEntityDescriptionInput;
};


export type MutationDeleteAgentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEpisodeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEpisodeEntityLinkArgs = {
  entity: Scalars['ID']['input'];
  entityType: Entity;
  episode: Scalars['ID']['input'];
};


export type MutationDeleteGiftArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLetterArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePersonReferenceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateAgentArgs = {
  agentData: UpdateAgentInput;
};


export type MutationUpdateEpisodeArgs = {
  episodeData: UpdateEpisodeInput;
};


export type MutationUpdateEpisodeEntityLinkArgs = {
  data: UpdateEpisodeEntityLinkInput;
};


export type MutationUpdateGiftArgs = {
  giftData: UpdateGiftInput;
};


export type MutationUpdateLetterArgs = {
  letterData: UpdateLetterInput;
};


export type MutationUpdateOrCreateSourceArgs = {
  sourceData: UpdateCreateSourceInput;
};


export type MutationUpdatePersonReferenceArgs = {
  referenceData: UpdatePersonReferenceInput;
};

/** An enumeration. */
export enum PersonAgentDescriptionSourceMentionChoices {
  /** directly mentioned */
  Direct = 'DIRECT',
  /** implied */
  Implied = 'IMPLIED'
}

export type PersonDateOfBirthType = {
  __typename?: 'PersonDateOfBirthType';
  certainty: Certainty;
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
  certainty: Certainty;
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

export type PersonReferenceType = {
  __typename?: 'PersonReferenceType';
  certainty: Certainty;
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
  episodeCategories: Array<EpisodeCategoryType>;
  episodeEntityLink?: Maybe<EpisodeEntityLink>;
  episodes: Array<EpisodeType>;
  giftDescription?: Maybe<GiftDescriptionType>;
  giftDescriptions: Array<GiftDescriptionType>;
  letterCategories: Array<LetterCategoryType>;
  letterDescription?: Maybe<LetterDescriptionType>;
  letterDescriptions: Array<LetterDescriptionType>;
  source: SourceType;
  sources: Array<SourceType>;
  spaceDescription?: Maybe<SpaceDescriptionType>;
  spaceDescriptions: Array<SpaceDescriptionType>;
  userDescription?: Maybe<UserType>;
  userDescriptions: Array<UserType>;
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


export type QueryEpisodeEntityLinkArgs = {
  entity: Scalars['ID']['input'];
  entityType: Entity;
  episode: Scalars['ID']['input'];
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


export type QueryUserDescriptionArgs = {
  id: Scalars['ID']['input'];
};

export type RegionFieldType = {
  __typename?: 'RegionFieldType';
  certainty: Certainty;
  id: Scalars['ID']['output'];
  /** Additional notes */
  note: Scalars['String']['output'];
  region: RegionType;
  sourceMention: SourceMention;
  space: SpaceDescriptionType;
};

export type RegionType = {
  __typename?: 'RegionType';
  contributors: Array<UserType>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Whether this entity is identifiable (i.e. can be cross-referenced between descriptions), or a generic description */
  identifiable: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  /** Kind of region */
  type: SpaceRegionTypeChoices;
};

export type SettlementFieldType = {
  __typename?: 'SettlementFieldType';
  certainty: Certainty;
  id: Scalars['ID']['output'];
  /** Additional notes */
  note: Scalars['String']['output'];
  settlement: SettlementType;
  sourceMention: SourceMention;
  space: SpaceDescriptionType;
};

export type SettlementType = {
  __typename?: 'SettlementType';
  contributors: Array<UserType>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Whether this entity is identifiable (i.e. can be cross-referenced between descriptions), or a generic description */
  identifiable: Scalars['Boolean']['output'];
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

/** An enumeration. */
export enum SourceMention {
  Direct = 'DIRECT',
  Implied = 'IMPLIED'
}

export type SourceType = {
  __typename?: 'SourceType';
  agents: Array<AgentDescriptionType>;
  contentsDate?: Maybe<SourceContentsDateType>;
  /** The name of the author of the edition */
  editionAuthor: Scalars['String']['output'];
  /** The title of the edition used for this source */
  editionTitle: Scalars['String']['output'];
  episodes: Array<EpisodeType>;
  gifts: Array<GiftDescriptionType>;
  id: Scalars['ID']['output'];
  letters: Array<LetterDescriptionType>;
  /** The name of the original author of the work, if known */
  medievalAuthor: Scalars['String']['output'];
  /** The original title of the work, if known */
  medievalTitle: Scalars['String']['output'];
  /** a unique name to identify this source in the database */
  name: Scalars['String']['output'];
  numOfEpisodes: Scalars['Int']['output'];
  spaces: Array<SpaceDescriptionType>;
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

export type SpaceDescriptionType = EntityDescription & {
  __typename?: 'SpaceDescriptionType';
  /** The book in the source */
  book: Scalars['String']['output'];
  /** The chapter or chapters in the source */
  chapter: Scalars['String']['output'];
  contributors: Array<UserType>;
  description: Scalars['String']['output'];
  episodes: Array<EpisodeSpaceType>;
  hasIdentifiableFeatures: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
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
export enum SpaceRegionTypeChoices {
  /** ecclesiastical */
  Ecclesiastical = 'ECCLESIASTICAL',
  /** geographical */
  Geographical = 'GEOGRAPHICAL',
  /** political */
  Political = 'POLITICAL'
}

/** An enumeration. */
export enum SpaceSpaceDescriptionSourceMentionChoices {
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
  certainty: Certainty;
  id: Scalars['ID']['output'];
  /** Additional notes */
  note: Scalars['String']['output'];
  sourceMention: SourceMention;
  space: SpaceDescriptionType;
  structure: StructureType;
};

export type StructureType = {
  __typename?: 'StructureType';
  contributors: Array<UserType>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Whether this entity is identifiable (i.e. can be cross-referenced between descriptions), or a generic description */
  identifiable: Scalars['Boolean']['output'];
  level: SpaceStructureLevelChoices;
  name: Scalars['String']['output'];
  /** The settlement containing this structure */
  settlement?: Maybe<SettlementType>;
};

export type UpdateAgentGenderInput = {
  gender?: InputMaybe<Gender>;
  note?: InputMaybe<Scalars['String']['input']>;
  sourceMention?: InputMaybe<SourceMention>;
};

export type UpdateAgentInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<UpdateAgentGenderInput>;
  id: Scalars['ID']['input'];
  isGroup?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<UpdateAgentLocationInput>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAgentLocationInput = {
  location?: InputMaybe<Scalars['ID']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  sourceMention?: InputMaybe<SourceMention>;
};

export type UpdateAgentMutation = {
  __typename?: 'UpdateAgentMutation';
  agent?: Maybe<AgentDescriptionType>;
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type UpdateCreateSourceInput = {
  editionAuthor?: InputMaybe<Scalars['String']['input']>;
  editionTitle?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  medievalAuthor?: InputMaybe<Scalars['String']['input']>;
  medievalTitle?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type UpdateEpisodeEntityLinkInput = {
  designators?: InputMaybe<Array<Scalars['String']['input']>>;
  entity: Scalars['ID']['input'];
  entityType: Entity;
  episode: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  sourceMention?: InputMaybe<SourceMention>;
};

export type UpdateEpisodeEntityLinkMutation = {
  __typename?: 'UpdateEpisodeEntityLinkMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type UpdateEpisodeInput = {
  book?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Array<Scalars['ID']['input']>>;
  chapter?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  designators?: InputMaybe<Array<Scalars['String']['input']>>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEpisodeMutation = {
  __typename?: 'UpdateEpisodeMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type UpdateGiftInput = {
  book?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Array<Scalars['ID']['input']>>;
  categorisations?: InputMaybe<Array<GiftCategorisationInput>>;
  chapter?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGiftMutation = {
  __typename?: 'UpdateGiftMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type UpdateLetterInput = {
  book?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Array<Scalars['ID']['input']>>;
  categorisations?: InputMaybe<Array<LetterCategorisationInput>>;
  chapter?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLetterMutation = {
  __typename?: 'UpdateLetterMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type UpdateOrCreateSourceMutation = {
  __typename?: 'UpdateOrCreateSourceMutation';
  errors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  source?: Maybe<SourceType>;
};

export type UpdatePersonReferenceInput = {
  certainty?: InputMaybe<Certainty>;
  id: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePersonReferenceMutation = {
  __typename?: 'UpdatePersonReferenceMutation';
  errors: Array<LettercraftErrorType>;
  ok: Scalars['Boolean']['output'];
};

export type UserType = {
  __typename?: 'UserType';
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
};

export type DataEntryAgentDescriptionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryAgentDescriptionQuery = { __typename?: 'Query', agentDescription?: { __typename?: 'AgentDescriptionType', id: string, isGroup: boolean, gender?: { __typename?: 'AgentDescriptionGenderType', id: string, gender: Gender, sourceMention: SourceMention, note: string } | null, location?: { __typename?: 'AgentDescriptionLocationType', id: string, sourceMention: SourceMention, note: string, location: { __typename?: 'SpaceDescriptionType', id: string } } | null, source: { __typename?: 'SourceType', id: string } } | null };

export type LocationsInSourceListQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type LocationsInSourceListQuery = { __typename?: 'Query', spaceDescriptions: Array<{ __typename?: 'SpaceDescriptionType', id: string, name: string }> };

export type DataEntryAgentEpisodesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryAgentEpisodesQuery = { __typename?: 'Query', agentDescription?: { __typename?: 'AgentDescriptionType', id: string, source: { __typename?: 'SourceType', id: string, episodes: Array<{ __typename?: 'EpisodeType', id: string, name: string }> }, episodes: Array<{ __typename?: 'EpisodeAgentType', id: string, episode: { __typename?: 'EpisodeType', id: string, name: string } }> } | null };

export type DataEntryCreateEpisodeEntityLinkMutationVariables = Exact<{
  input: CreateEpisodeEntityLinkInput;
}>;


export type DataEntryCreateEpisodeEntityLinkMutation = { __typename?: 'Mutation', createEpisodeEntityLink?: { __typename?: 'CreateEpisodeEntityLinkMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntryDeleteEpisodeEntityLinkMutationVariables = Exact<{
  entity: Scalars['ID']['input'];
  episode: Scalars['ID']['input'];
  entityType: Entity;
}>;


export type DataEntryDeleteEpisodeEntityLinkMutation = { __typename?: 'Mutation', deleteEpisodeEntityLink?: { __typename?: 'DeleteEpisodeEntityLinkMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntryAgentIdentificationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryAgentIdentificationQuery = { __typename?: 'Query', agentDescription?: { __typename?: 'AgentDescriptionType', id: string, name: string, description: string, isGroup: boolean } | null };

export type DataEntryAgentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryAgentQuery = { __typename?: 'Query', agentDescription?: { __typename?: 'AgentDescriptionType', id: string, name: string, description: string, isGroup: boolean, identified: boolean, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export type DataEntryUpdateAgentMutationVariables = Exact<{
  input: UpdateAgentInput;
}>;


export type DataEntryUpdateAgentMutation = { __typename?: 'Mutation', updateAgent?: { __typename?: 'UpdateAgentMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntryDeleteAgentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryDeleteAgentMutation = { __typename?: 'Mutation', deleteAgent?: { __typename?: 'DeleteAgentMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', messages: Array<string>, field: string }> } | null };

export type DataEntryCreateAgentMutationVariables = Exact<{
  input: CreateEntityDescriptionInput;
}>;


export type DataEntryCreateAgentMutation = { __typename?: 'Mutation', createAgent?: { __typename?: 'CreateAgentMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntryCreateGiftMutationVariables = Exact<{
  input: CreateEntityDescriptionInput;
}>;


export type DataEntryCreateGiftMutation = { __typename?: 'Mutation', createGift?: { __typename?: 'CreateGiftMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntryCreateLetterMutationVariables = Exact<{
  input: CreateEntityDescriptionInput;
}>;


export type DataEntryCreateLetterMutation = { __typename?: 'Mutation', createLetter?: { __typename?: 'CreateLetterMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntryCreateSpaceMutationVariables = Exact<{
  input: CreateEntityDescriptionInput;
}>;


export type DataEntryCreateSpaceMutation = { __typename?: 'Mutation', createSpace?: { __typename?: 'CreateSpaceMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntryEpisodeContentsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryEpisodeContentsQuery = { __typename?: 'Query', episode?: { __typename?: 'EpisodeType', id: string, summary: string, designators: Array<string>, categories: Array<{ __typename?: 'EpisodeCategoryType', id: string }> } | null };

export type DataEntryEpisodeCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type DataEntryEpisodeCategoriesQuery = { __typename?: 'Query', episodeCategories: Array<{ __typename?: 'EpisodeCategoryType', id: string, name: string, description: string }> };

export type DataEntryEpisodeEntitiesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryEpisodeEntitiesQuery = { __typename?: 'Query', episode?: { __typename?: 'EpisodeType', id: string, source: { __typename?: 'SourceType', id: string, agents: Array<{ __typename?: 'AgentDescriptionType', id: string, name: string }>, letters: Array<{ __typename?: 'LetterDescriptionType', id: string, name: string }>, gifts: Array<{ __typename?: 'GiftDescriptionType', id: string, name: string }>, spaces: Array<{ __typename?: 'SpaceDescriptionType', id: string, name: string }> }, agents: Array<{ __typename?: 'AgentDescriptionType', id: string, name: string }>, gifts: Array<{ __typename?: 'GiftDescriptionType', id: string, name: string }>, letters: Array<{ __typename?: 'LetterDescriptionType', id: string, name: string }>, spaces: Array<{ __typename?: 'SpaceDescriptionType', id: string, name: string }> } | null };

export type DataEntryEpisodeIdentificationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryEpisodeIdentificationQuery = { __typename?: 'Query', episode?: { __typename?: 'EpisodeType', id: string, name: string, description: string } | null };

export type DataEntryEpisodeSourceTextMentionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryEpisodeSourceTextMentionQuery = { __typename?: 'Query', episode?: { __typename?: 'EpisodeType', id: string, book: string, chapter: string, page: string } | null };

export type DataEntryEpisodeFormQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryEpisodeFormQuery = { __typename?: 'Query', episode?: { __typename?: 'EpisodeType', id: string, name: string, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export type DataEntryUpdateEpisodeMutationVariables = Exact<{
  episodeData: UpdateEpisodeInput;
}>;


export type DataEntryUpdateEpisodeMutation = { __typename?: 'Mutation', updateEpisode?: { __typename?: 'UpdateEpisodeMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntryCreateEpisodeMutationVariables = Exact<{
  episodeData: CreateEpisodeInput;
}>;


export type DataEntryCreateEpisodeMutation = { __typename?: 'Mutation', createEpisode?: { __typename?: 'CreateEpisodeMutation', episode?: { __typename?: 'EpisodeType', id: string } | null, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntryGiftCategoriesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryGiftCategoriesQuery = { __typename?: 'Query', giftDescription?: { __typename?: 'GiftDescriptionType', id: string, categorisations: Array<{ __typename?: 'GiftDescriptionCategoryType', id: string, sourceMention: SourceMention, note: string, certainty: Certainty, category: { __typename?: 'GiftCategoryType', id: string, name: string } }> } | null };

export type DataEntryAllGiftCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type DataEntryAllGiftCategoriesQuery = { __typename?: 'Query', letterCategories: Array<{ __typename?: 'LetterCategoryType', id: string, label: string, description: string }> };

export type DataEntryGiftIdentificationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryGiftIdentificationQuery = { __typename?: 'Query', giftDescription?: { __typename?: 'GiftDescriptionType', id: string, name: string, description: string } | null };

export type DataEntryGiftSourceTextQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryGiftSourceTextQuery = { __typename?: 'Query', giftDescription?: { __typename?: 'GiftDescriptionType', id: string, book: string, chapter: string, page: string } | null };

export type DataEntryGiftFormQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryGiftFormQuery = { __typename?: 'Query', giftDescription?: { __typename?: 'GiftDescriptionType', id: string, name: string, description: string, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export type DataEntryUpdateGiftMutationVariables = Exact<{
  giftData: UpdateGiftInput;
}>;


export type DataEntryUpdateGiftMutation = { __typename?: 'Mutation', updateGift?: { __typename?: 'UpdateGiftMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntryLetterCategoriesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryLetterCategoriesQuery = { __typename?: 'Query', letterDescription?: { __typename?: 'LetterDescriptionType', id: string, categorisations: Array<{ __typename?: 'LetterDescriptionCategoryType', id: string, sourceMention: SourceMention, note: string, certainty: Certainty, category: { __typename?: 'LetterCategoryType', id: string, label: string } }> } | null };

export type DataEntryAllLetterCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type DataEntryAllLetterCategoriesQuery = { __typename?: 'Query', letterCategories: Array<{ __typename?: 'LetterCategoryType', id: string, label: string, description: string }> };

export type DataEntryLetterIdentificationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryLetterIdentificationQuery = { __typename?: 'Query', letterDescription?: { __typename?: 'LetterDescriptionType', id: string, name: string, description: string } | null };

export type DataEntryLetterSourceTextQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryLetterSourceTextQuery = { __typename?: 'Query', letterDescription?: { __typename?: 'LetterDescriptionType', id: string, book: string, chapter: string, page: string } | null };

export type DataEntryLetterFormQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryLetterFormQuery = { __typename?: 'Query', letterDescription?: { __typename?: 'LetterDescriptionType', id: string, name: string, description: string, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export type DataEntryUpdateLetterMutationVariables = Exact<{
  letterData: UpdateLetterInput;
}>;


export type DataEntryUpdateLetterMutation = { __typename?: 'Mutation', updateLetter?: { __typename?: 'UpdateLetterMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntrySpaceDescriptionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntrySpaceDescriptionQuery = { __typename?: 'Query', spaceDescription?: { __typename?: 'SpaceDescriptionType', id: string, name: string, description: string, hasIdentifiableFeatures: boolean, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export type DataEntryEpisodeEntityLinkQueryVariables = Exact<{
  entity: Scalars['ID']['input'];
  episode: Scalars['ID']['input'];
  entityType: Entity;
}>;


export type DataEntryEpisodeEntityLinkQuery = { __typename?: 'Query', episodeEntityLink?: { __typename?: 'EpisodeAgentType', id: string, note?: string | null, sourceMention: SourceMention, designators?: Array<string> | null, episode: { __typename?: 'EpisodeType', id: string, name: string }, entity: { __typename?: 'AgentDescriptionType', id: string, name: string } | { __typename?: 'EpisodeType', id: string, name: string } | { __typename?: 'GiftDescriptionType', id: string, name: string } | { __typename?: 'LetterDescriptionType', id: string, name: string } | { __typename?: 'SpaceDescriptionType', id: string, name: string } } | { __typename?: 'EpisodeGiftType', id: string, note?: string | null, sourceMention: SourceMention, designators?: Array<string> | null, episode: { __typename?: 'EpisodeType', id: string, name: string }, entity: { __typename?: 'AgentDescriptionType', id: string, name: string } | { __typename?: 'EpisodeType', id: string, name: string } | { __typename?: 'GiftDescriptionType', id: string, name: string } | { __typename?: 'LetterDescriptionType', id: string, name: string } | { __typename?: 'SpaceDescriptionType', id: string, name: string } } | { __typename?: 'EpisodeLetterType', id: string, note?: string | null, sourceMention: SourceMention, designators?: Array<string> | null, episode: { __typename?: 'EpisodeType', id: string, name: string }, entity: { __typename?: 'AgentDescriptionType', id: string, name: string } | { __typename?: 'EpisodeType', id: string, name: string } | { __typename?: 'GiftDescriptionType', id: string, name: string } | { __typename?: 'LetterDescriptionType', id: string, name: string } | { __typename?: 'SpaceDescriptionType', id: string, name: string } } | { __typename?: 'EpisodeSpaceType', id: string, note?: string | null, sourceMention: SourceMention, designators?: Array<string> | null, episode: { __typename?: 'EpisodeType', id: string, name: string }, entity: { __typename?: 'AgentDescriptionType', id: string, name: string } | { __typename?: 'EpisodeType', id: string, name: string } | { __typename?: 'GiftDescriptionType', id: string, name: string } | { __typename?: 'LetterDescriptionType', id: string, name: string } | { __typename?: 'SpaceDescriptionType', id: string, name: string } } | null };

export type DataEntryUpdateEpisodeEntityLinkMutationVariables = Exact<{
  input: UpdateEpisodeEntityLinkInput;
}>;


export type DataEntryUpdateEpisodeEntityLinkMutation = { __typename?: 'Mutation', updateEpisodeEntityLink?: { __typename?: 'UpdateEpisodeEntityLinkMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntryDeleteEpisodeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntryDeleteEpisodeMutation = { __typename?: 'Mutation', deleteEpisode?: { __typename?: 'DeleteEpisodeMutation', ok: boolean, errors: Array<{ __typename?: 'LettercraftErrorType', field: string, messages: Array<string> }> } | null };

export type DataEntrySourceDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DataEntrySourceDetailQuery = { __typename?: 'Query', source: { __typename?: 'SourceType', id: string, name: string, episodes: Array<{ __typename?: 'EpisodeType', id: string, name: string, description: string, summary: string, book: string, chapter: string, page: string, contributors: Array<{ __typename?: 'UserType', id: string, fullName: string }>, agents: Array<{ __typename?: 'AgentDescriptionType', id: string, name: string, isGroup: boolean, identified: boolean }>, gifts: Array<{ __typename?: 'GiftDescriptionType', id: string, name: string }>, letters: Array<{ __typename?: 'LetterDescriptionType', id: string, name: string }>, spaces: Array<{ __typename?: 'SpaceDescriptionType', id: string, name: string, hasIdentifiableFeatures: boolean }> }> } };

export type DataEntrySourceListQueryVariables = Exact<{ [key: string]: never; }>;


export type DataEntrySourceListQuery = { __typename?: 'Query', sources: Array<{ __typename?: 'SourceType', id: string, name: string, editionAuthor: string, editionTitle: string, medievalAuthor: string, medievalTitle: string, numOfEpisodes: number }> };

export type SourceTitleQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type SourceTitleQueryQuery = { __typename?: 'Query', source: { __typename?: 'SourceType', id: string, name: string } };

export type AgentTitleQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type AgentTitleQueryQuery = { __typename?: 'Query', agentDescription?: { __typename?: 'AgentDescriptionType', id: string, name: string, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export type LetterTitleQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type LetterTitleQueryQuery = { __typename?: 'Query', letterDescription?: { __typename?: 'LetterDescriptionType', id: string, name: string, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export type GiftTitleQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GiftTitleQueryQuery = { __typename?: 'Query', giftDescription?: { __typename?: 'GiftDescriptionType', id: string, name: string, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export type SpaceTitleQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type SpaceTitleQueryQuery = { __typename?: 'Query', spaceDescription?: { __typename?: 'SpaceDescriptionType', id: string, name: string, source: { __typename?: 'SourceType', id: string, name: string } } | null };

export const DataEntryAgentDescriptionDocument = gql`
    query DataEntryAgentDescription($id: ID!) {
  agentDescription(id: $id) {
    id
    isGroup
    gender {
      id
      gender
      sourceMention
      note
    }
    location {
      id
      sourceMention
      note
      location {
        id
      }
    }
    source {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryAgentDescriptionGQL extends Apollo.Query<DataEntryAgentDescriptionQuery, DataEntryAgentDescriptionQueryVariables> {
    override document = DataEntryAgentDescriptionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LocationsInSourceListDocument = gql`
    query LocationsInSourceList($id: ID!) {
  spaceDescriptions(sourceId: $id) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LocationsInSourceListGQL extends Apollo.Query<LocationsInSourceListQuery, LocationsInSourceListQueryVariables> {
    override document = LocationsInSourceListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryAgentEpisodesDocument = gql`
    query DataEntryAgentEpisodes($id: ID!) {
  agentDescription(id: $id) {
    id
    source {
      id
      episodes {
        id
        name
      }
    }
    episodes {
      id
      episode {
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
  export class DataEntryAgentEpisodesGQL extends Apollo.Query<DataEntryAgentEpisodesQuery, DataEntryAgentEpisodesQueryVariables> {
    override document = DataEntryAgentEpisodesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryCreateEpisodeEntityLinkDocument = gql`
    mutation DataEntryCreateEpisodeEntityLink($input: CreateEpisodeEntityLinkInput!) {
  createEpisodeEntityLink(data: $input) {
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
  export class DataEntryCreateEpisodeEntityLinkGQL extends Apollo.Mutation<DataEntryCreateEpisodeEntityLinkMutation, DataEntryCreateEpisodeEntityLinkMutationVariables> {
    override document = DataEntryCreateEpisodeEntityLinkDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryDeleteEpisodeEntityLinkDocument = gql`
    mutation DataEntryDeleteEpisodeEntityLink($entity: ID!, $episode: ID!, $entityType: Entity!) {
  deleteEpisodeEntityLink(
    entity: $entity
    episode: $episode
    entityType: $entityType
  ) {
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
  export class DataEntryDeleteEpisodeEntityLinkGQL extends Apollo.Mutation<DataEntryDeleteEpisodeEntityLinkMutation, DataEntryDeleteEpisodeEntityLinkMutationVariables> {
    override document = DataEntryDeleteEpisodeEntityLinkDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryAgentIdentificationDocument = gql`
    query DataEntryAgentIdentification($id: ID!) {
  agentDescription(id: $id) {
    id
    name
    description
    isGroup
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryAgentIdentificationGQL extends Apollo.Query<DataEntryAgentIdentificationQuery, DataEntryAgentIdentificationQueryVariables> {
    override document = DataEntryAgentIdentificationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryAgentDocument = gql`
    query DataEntryAgent($id: ID!) {
  agentDescription(id: $id) {
    id
    name
    description
    isGroup
    identified
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
export const DataEntryUpdateAgentDocument = gql`
    mutation DataEntryUpdateAgent($input: UpdateAgentInput!) {
  updateAgent(agentData: $input) {
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
  export class DataEntryUpdateAgentGQL extends Apollo.Mutation<DataEntryUpdateAgentMutation, DataEntryUpdateAgentMutationVariables> {
    override document = DataEntryUpdateAgentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryDeleteAgentDocument = gql`
    mutation DataEntryDeleteAgent($id: ID!) {
  deleteAgent(id: $id) {
    ok
    errors {
      messages
      field
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryDeleteAgentGQL extends Apollo.Mutation<DataEntryDeleteAgentMutation, DataEntryDeleteAgentMutationVariables> {
    override document = DataEntryDeleteAgentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryCreateAgentDocument = gql`
    mutation DataEntryCreateAgent($input: CreateEntityDescriptionInput!) {
  createAgent(agentData: $input) {
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
  export class DataEntryCreateAgentGQL extends Apollo.Mutation<DataEntryCreateAgentMutation, DataEntryCreateAgentMutationVariables> {
    override document = DataEntryCreateAgentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryCreateGiftDocument = gql`
    mutation DataEntryCreateGift($input: CreateEntityDescriptionInput!) {
  createGift(giftData: $input) {
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
  export class DataEntryCreateGiftGQL extends Apollo.Mutation<DataEntryCreateGiftMutation, DataEntryCreateGiftMutationVariables> {
    override document = DataEntryCreateGiftDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryCreateLetterDocument = gql`
    mutation DataEntryCreateLetter($input: CreateEntityDescriptionInput!) {
  createLetter(letterData: $input) {
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
  export class DataEntryCreateLetterGQL extends Apollo.Mutation<DataEntryCreateLetterMutation, DataEntryCreateLetterMutationVariables> {
    override document = DataEntryCreateLetterDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryCreateSpaceDocument = gql`
    mutation DataEntryCreateSpace($input: CreateEntityDescriptionInput!) {
  createSpace(spaceData: $input) {
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
  export class DataEntryCreateSpaceGQL extends Apollo.Mutation<DataEntryCreateSpaceMutation, DataEntryCreateSpaceMutationVariables> {
    override document = DataEntryCreateSpaceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryEpisodeContentsDocument = gql`
    query DataEntryEpisodeContents($id: ID!) {
  episode(id: $id) {
    id
    summary
    designators
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
export const DataEntryEpisodeCategoriesDocument = gql`
    query DataEntryEpisodeCategories {
  episodeCategories {
    id
    name
    description
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryEpisodeCategoriesGQL extends Apollo.Query<DataEntryEpisodeCategoriesQuery, DataEntryEpisodeCategoriesQueryVariables> {
    override document = DataEntryEpisodeCategoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryEpisodeEntitiesDocument = gql`
    query DataEntryEpisodeEntities($id: ID!) {
  episode(id: $id) {
    id
    source {
      id
      agents {
        id
        name
      }
      letters {
        id
        name
      }
      gifts {
        id
        name
      }
      spaces {
        id
        name
      }
    }
    agents {
      id
      name
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
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryEpisodeEntitiesGQL extends Apollo.Query<DataEntryEpisodeEntitiesQuery, DataEntryEpisodeEntitiesQueryVariables> {
    override document = DataEntryEpisodeEntitiesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryEpisodeIdentificationDocument = gql`
    query DataEntryEpisodeIdentification($id: ID!) {
  episode(id: $id) {
    id
    name
    description
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
    mutation DataEntryUpdateEpisode($episodeData: UpdateEpisodeInput!) {
  updateEpisode(episodeData: $episodeData) {
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
    mutation DataEntryCreateEpisode($episodeData: CreateEpisodeInput!) {
  createEpisode(episodeData: $episodeData) {
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
export const DataEntryGiftCategoriesDocument = gql`
    query DataEntryGiftCategories($id: ID!) {
  giftDescription(id: $id) {
    id
    categorisations {
      id
      sourceMention
      note
      certainty
      category {
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
  export class DataEntryGiftCategoriesGQL extends Apollo.Query<DataEntryGiftCategoriesQuery, DataEntryGiftCategoriesQueryVariables> {
    override document = DataEntryGiftCategoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryAllGiftCategoriesDocument = gql`
    query DataEntryAllGiftCategories {
  letterCategories {
    id
    label
    description
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryAllGiftCategoriesGQL extends Apollo.Query<DataEntryAllGiftCategoriesQuery, DataEntryAllGiftCategoriesQueryVariables> {
    override document = DataEntryAllGiftCategoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryGiftIdentificationDocument = gql`
    query DataEntryGiftIdentification($id: ID!) {
  giftDescription(id: $id) {
    id
    name
    description
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryGiftIdentificationGQL extends Apollo.Query<DataEntryGiftIdentificationQuery, DataEntryGiftIdentificationQueryVariables> {
    override document = DataEntryGiftIdentificationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryGiftSourceTextDocument = gql`
    query DataEntryGiftSourceText($id: ID!) {
  giftDescription(id: $id) {
    id
    book
    chapter
    page
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryGiftSourceTextGQL extends Apollo.Query<DataEntryGiftSourceTextQuery, DataEntryGiftSourceTextQueryVariables> {
    override document = DataEntryGiftSourceTextDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryGiftFormDocument = gql`
    query DataEntryGiftForm($id: ID!) {
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
  export class DataEntryGiftFormGQL extends Apollo.Query<DataEntryGiftFormQuery, DataEntryGiftFormQueryVariables> {
    override document = DataEntryGiftFormDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryUpdateGiftDocument = gql`
    mutation DataEntryUpdateGift($giftData: UpdateGiftInput!) {
  updateGift(giftData: $giftData) {
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
  export class DataEntryUpdateGiftGQL extends Apollo.Mutation<DataEntryUpdateGiftMutation, DataEntryUpdateGiftMutationVariables> {
    override document = DataEntryUpdateGiftDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryLetterCategoriesDocument = gql`
    query DataEntryLetterCategories($id: ID!) {
  letterDescription(id: $id) {
    id
    categorisations {
      id
      sourceMention
      note
      certainty
      category {
        id
        label
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryLetterCategoriesGQL extends Apollo.Query<DataEntryLetterCategoriesQuery, DataEntryLetterCategoriesQueryVariables> {
    override document = DataEntryLetterCategoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryAllLetterCategoriesDocument = gql`
    query DataEntryAllLetterCategories {
  letterCategories {
    id
    label
    description
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryAllLetterCategoriesGQL extends Apollo.Query<DataEntryAllLetterCategoriesQuery, DataEntryAllLetterCategoriesQueryVariables> {
    override document = DataEntryAllLetterCategoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryLetterIdentificationDocument = gql`
    query DataEntryLetterIdentification($id: ID!) {
  letterDescription(id: $id) {
    id
    name
    description
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryLetterIdentificationGQL extends Apollo.Query<DataEntryLetterIdentificationQuery, DataEntryLetterIdentificationQueryVariables> {
    override document = DataEntryLetterIdentificationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryLetterSourceTextDocument = gql`
    query DataEntryLetterSourceText($id: ID!) {
  letterDescription(id: $id) {
    id
    book
    chapter
    page
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryLetterSourceTextGQL extends Apollo.Query<DataEntryLetterSourceTextQuery, DataEntryLetterSourceTextQueryVariables> {
    override document = DataEntryLetterSourceTextDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryLetterFormDocument = gql`
    query DataEntryLetterForm($id: ID!) {
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
  export class DataEntryLetterFormGQL extends Apollo.Query<DataEntryLetterFormQuery, DataEntryLetterFormQueryVariables> {
    override document = DataEntryLetterFormDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryUpdateLetterDocument = gql`
    mutation DataEntryUpdateLetter($letterData: UpdateLetterInput!) {
  updateLetter(letterData: $letterData) {
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
  export class DataEntryUpdateLetterGQL extends Apollo.Mutation<DataEntryUpdateLetterMutation, DataEntryUpdateLetterMutationVariables> {
    override document = DataEntryUpdateLetterDocument;
    
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
    hasIdentifiableFeatures
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
export const DataEntryEpisodeEntityLinkDocument = gql`
    query DataEntryEpisodeEntityLink($entity: ID!, $episode: ID!, $entityType: Entity!) {
  episodeEntityLink(entity: $entity, episode: $episode, entityType: $entityType) {
    id
    note
    sourceMention
    designators
    episode {
      id
      name
    }
    entity {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DataEntryEpisodeEntityLinkGQL extends Apollo.Query<DataEntryEpisodeEntityLinkQuery, DataEntryEpisodeEntityLinkQueryVariables> {
    override document = DataEntryEpisodeEntityLinkDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DataEntryUpdateEpisodeEntityLinkDocument = gql`
    mutation DataEntryUpdateEpisodeEntityLink($input: UpdateEpisodeEntityLinkInput!) {
  updateEpisodeEntityLink(data: $input) {
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
  export class DataEntryUpdateEpisodeEntityLinkGQL extends Apollo.Mutation<DataEntryUpdateEpisodeEntityLinkMutation, DataEntryUpdateEpisodeEntityLinkMutationVariables> {
    override document = DataEntryUpdateEpisodeEntityLinkDocument;
    
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
    episodes {
      id
      name
      description
      summary
      book
      chapter
      contributors {
        id
        fullName
      }
      page
      agents {
        id
        name
        isGroup
        identified
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
        hasIdentifiableFeatures
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
export const SourceTitleQueryDocument = gql`
    query SourceTitleQuery {
  source(id: "") {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SourceTitleQueryGQL extends Apollo.Query<SourceTitleQueryQuery, SourceTitleQueryQueryVariables> {
    override document = SourceTitleQueryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AgentTitleQueryDocument = gql`
    query AgentTitleQuery {
  agentDescription(id: "") {
    id
    name
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
  export class AgentTitleQueryGQL extends Apollo.Query<AgentTitleQueryQuery, AgentTitleQueryQueryVariables> {
    override document = AgentTitleQueryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LetterTitleQueryDocument = gql`
    query LetterTitleQuery {
  letterDescription(id: "") {
    id
    name
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
  export class LetterTitleQueryGQL extends Apollo.Query<LetterTitleQueryQuery, LetterTitleQueryQueryVariables> {
    override document = LetterTitleQueryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GiftTitleQueryDocument = gql`
    query GiftTitleQuery {
  giftDescription(id: "") {
    id
    name
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
  export class GiftTitleQueryGQL extends Apollo.Query<GiftTitleQueryQuery, GiftTitleQueryQueryVariables> {
    override document = GiftTitleQueryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SpaceTitleQueryDocument = gql`
    query SpaceTitleQuery {
  spaceDescription(id: "") {
    id
    name
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
  export class SpaceTitleQueryGQL extends Apollo.Query<SpaceTitleQueryQuery, SpaceTitleQueryQueryVariables> {
    override document = SpaceTitleQueryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }