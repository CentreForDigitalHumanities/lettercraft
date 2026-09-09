import {  provideApollo} from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { inject, NgModule } from "@angular/core";
import { ApolloClientOptions, InMemoryCache } from "@apollo/client/core";
import { environment } from "@env";

export function createApollo(): ApolloClientOptions<any> {
    const httpLink = inject(HttpLink);
    return {
        link: httpLink.create({ uri: environment.graphqlUrl }),
        cache: new InMemoryCache({
            typePolicies: {
                SourceType: {
                    fields: {
                        episodes: {
                            merge(existing, incoming) {
                                // https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-arrays
                                return incoming;
                            },
                        },
                    },
                },
            },
        }),
    };
}

@NgModule({
    exports: [],
    providers: [
        provideApollo(createApollo),
    ],
})
export class GraphQLModule { }
