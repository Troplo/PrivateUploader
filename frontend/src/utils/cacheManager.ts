import { DocumentNode } from "graphql/language";
import { ApolloClient } from "@apollo/client/core";

export async function updateCache<P, I>(
  patch: Partial<P> | Partial<P>[],
  queryDocument: DocumentNode,
  key: string,
  input: I,
  apollo: ApolloClient<any>,
  referenceKey: string,
  mergeOptions: { position: "prepend" | "append" } = { position: "append" }
) {
  // If no selected form, we'll do nothing
  // Get the cache object from the GraphQL API client
  const cache = apollo.cache;
  // Read the query that we want to update the cache of
  const cacheObj = await cache.readQuery({
    query: queryDocument,
    variables: { input }
  });
  // Simply re-fetch from the network if there's no cache
  if (!cacheObj) {
    return console.warn("[Flowinity/Cache] Could not find item in cache.", {
      key,
      input,
      queryDocument,
      patch
    });
  }
  if (!patch) {
    cache.evict({ fieldName: key, args: { input } });
    return;
  }

  console.log("MERGE PATCH", patch, cacheObj);

  // Write the updated value back to the cache
  cache.writeQuery({
    query: queryDocument,
    variables: { input },
    data: {
      [key]: patch
    }
  });
}
