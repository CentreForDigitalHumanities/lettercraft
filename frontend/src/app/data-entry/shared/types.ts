export type FormStatus = 'idle' | 'invalid' | 'loading' | 'saved' | 'error';

export type EntityType = 'agent';

export type SelectOptions<T> = { value: T, label: string }[];