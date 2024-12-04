import { App } from "vue";
import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache
} from "@apollo/client/core";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { onError } from "@apollo/client/link/error";
import { useToast } from "vue-toastification";
import { debugLink } from "@/boot/apollo.httpTransport";

export default function apolloTroploServices(app: App) {
  const toast = useToast();
  const gqlEndpoint = "https://api.troplo.com/graphql";
  const httpLink = new HttpLink({
    uri: gqlEndpoint
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      const ctx = operation.getContext();
      for (const error of graphQLErrors) {
        if (!ctx.noToast) {
          toast.error(error.message);
        }
      }
    }

    if (networkError) {
      //
    }
  });

  if (import.meta.env.DEV) {
    loadDevMessages();
    loadErrorMessages();
  }

  const networkInspection =
    import.meta.env.DEV ||
    localStorage.getItem("tpuNetworkInspection") === "true";

  const appLink = from([
    ...(networkInspection ? [debugLink()] : []),
    errorLink,
    httpLink
  ]);

  // Create the apollo client
  return new ApolloClient({
    link: appLink,
    cache: new InMemoryCache({
      addTypename: true
    }),
    connectToDevTools: import.meta.env.DEV
  });
}
