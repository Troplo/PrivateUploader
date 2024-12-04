import { App, watch } from "vue";
import { createApolloProvider } from "@vue/apollo-option";
import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
  split
} from "@apollo/client/core";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { onError } from "@apollo/client/link/error";
import { useToast } from "vue-toastification";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import functions from "@/plugins/functions";
import { useAppStore } from "@/store/app.store";
import router from "@/router";
import { getMainDefinition } from "@apollo/client/utilities";
import { useDebugStore } from "@/store/debug.store";
import { useUserStore } from "@/store/user.store";
import { useRoute, useRouter } from "vue-router";
import { useEndpointsStore } from "@/store/endpoints.store";
import { debugLink } from "@/boot/apollo.httpTransport";

function getToken(app: App) {
  return (
    app.config.globalProperties.$app.token ?? localStorage.getItem("token")
  );
}

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
    connectToDevTools: true
  });
}
