import { APOLLO_OPTIONS, ApolloModule } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { NgModule } from "@angular/core";
import { ApolloClientOptions, InMemoryCache } from "@apollo/client/core";
import { environment } from "@env";

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
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
    exports: [ApolloModule],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink],
        },
    ],
})
export class GraphQLModule {}
