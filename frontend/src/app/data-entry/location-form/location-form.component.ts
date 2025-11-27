import { Component, DestroyRef } from "@angular/core";
import { Router } from "@angular/router";
import { actionIcons, dataIcons } from "@shared/icons";
import {
    DataEntryDeleteLocationGQL,
    DataEntryDeleteLocationMutation,
    DataEntrySpaceDescriptionGQL,
    DataEntrySpaceDescriptionQuery,
} from "generated/graphql";
import { map, share, switchMap } from "rxjs";
import { FormService } from "../shared/form.service";
import { ModalService } from "@services/modal.service";
import { ToastService } from "@services/toast.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ApolloCache } from "@apollo/client/core";
import { MutationResult } from "apollo-angular";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";

type QueriedLocation = NonNullable<
    DataEntrySpaceDescriptionQuery["spaceDescription"]
>;

@Component({
    selector: "lc-location-form",
    templateUrl: "./location-form.component.html",
    styleUrls: ["./location-form.component.scss"],
    providers: [FormService],
    standalone: false
})
export class LocationFormComponent {
    public id$ = this.formService.id$;

    public status$ = this.formService.status$;

    public data$ = this.id$.pipe(
        switchMap((id) => this.locationQuery.watch({ id }).valueChanges),
        map((result) => result.data),
        share()
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;
    public deletingInProgress = false;

    constructor(
        private destroyRef: DestroyRef,
        private router: Router,
        private modalService: ModalService,
        private toastService: ToastService,
        private formService: FormService,
        private locationQuery: DataEntrySpaceDescriptionGQL,
        private deleteLocation: DataEntryDeleteLocationGQL
    ) {}

    public getBreadcrumbs(data: DataEntrySpaceDescriptionQuery): Breadcrumb[] {
        if (!data.spaceDescription) {
            return [
                { link: "/", label: "Lettercraft" },
                { link: "/data-entry", label: "Data entry" },
                { link: "", label: "Location not found" },
            ];
        }
        return [
            { link: "/", label: "Lettercraft" },
            { link: "/data-entry", label: "Data entry" },
            {
                link: `/data-entry/sources/${data.spaceDescription.source.id}`,
                label: data.spaceDescription.source.name,
            },
            {
                link: `/location-entry/locations/${data.spaceDescription.id}`,
                label: data.spaceDescription.name,
            },
        ];
    }

    public onClickDelete(location: QueriedLocation): void {
        this.modalService
            .openConfirmationModal({
                title: "Delete location",
                message: `Are you sure you want to delete this location? (${location.name})`,
            })
            .then(() => this.performDelete(location.id, location.source.id))
            .catch(() => {
                // Do nothing on cancel / dismissal.
            });
    }

    private performDelete(locationId: string, sourceId: string): void {
        this.deletingInProgress = true;
        this.deleteLocation
            .mutate(
                {
                    id: locationId,
                },
                {
                    update: (cache) => this.updateCache(cache, locationId),
                }
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => this.onMutationResult(result, sourceId));
    }

    private onMutationResult(
        result: MutationResult<DataEntryDeleteLocationMutation>,
        sourceId: string
    ): void {
        this.deletingInProgress = false;
        const errors = result.data?.deleteSpace?.errors;
        if (errors && errors.length > 0) {
            this.toastService.show({
                body: errors.map((error) => error.messages).join("\n"),
                type: "danger",
                header: "Deletion failed",
            });
        } else {
            this.toastService.show({
                body: "Location deleted",
                type: "success",
                header: "Success",
            });
        }
        this.router.navigate([`/data-entry/sources/${sourceId}`]);
    }

    private updateCache(cache: ApolloCache<unknown>, locationId: string): void {
        const identified = cache.identify({
            __typename: "SpaceDescriptionType",
            id: locationId,
        });
        cache.evict({ id: identified });
        cache.gc();
    }
}
