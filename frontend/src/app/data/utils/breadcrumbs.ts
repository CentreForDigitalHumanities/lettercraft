import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component"

export const sourceBreadcrumbs = (source: {id: string, name: string}): Breadcrumb[] =>
    [
        { label: 'Lettercraft', link: '/' },
        { label: 'Data', link: '/data' },
        {
            label: source.name,
            link: `/data/sources/${source.id}`,
        },
    ];

export const entityDescriptionBreadcrumbs = (obj: {
    id: string,
    name: string,
    source: { id: string, name: string }
}): Breadcrumb[] =>
    sourceBreadcrumbs(obj.source).concat([
        {
            label: obj.name,
            link: '.',
        }
    ]);

export const NOT_FOUND_BREADCRUMBS = [
    { label: 'Lettercraft', link: '/' },
    { label: 'Data', link: '/data' },
    { label: 'Not found', link: '.' },
];
