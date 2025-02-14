import { App, watch } from "vue";
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
import { getMainDefinition } from "@apollo/client/utilities";
import { useDebugStore } from "@/store/debug.store";
import { useUserStore } from "@/store/user.store";
import { useEndpointsStore } from "@/store/endpoints.store";
import { setupSockets } from "./sockets";
import { useApolloClient } from "@vue/apollo-composable";
import { GraphQLError } from "graphql/error";

function getToken(app: App) {
  return (
    app.config.globalProperties.$app.token ?? localStorage.getItem("token")
  );
}

export function debugLink() {
  const debugStore = useDebugStore();

  // @ts-ignore
  return new ApolloLink((operation, forward) => {
    const id = new Date().getTime() + "-" + Math.random();
    const startTime = performance.now();
    debugStore.recentOperations.unshift({
      id,
      name: operation.operationName,
      args: operation.variables,
      result: {},
      time: 0,
      //@ts-ignore
      type: operation.query.definitions[0]?.operation,
      timestamp: new Date().getTime(),
      pending: true,
      sdl: operation.query.loc?.source.body
    });
    return forward(operation).map((response) => {
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;

      const op = debugStore.recentOperations.find((op) => op.id === id);

      if (op) {
        op.pending = false;
        op.result = response;
        op.time = elapsedTime;
      }

      return response;
    });
  });
}

export default function apolloFlowinity(app: App) {
  // WebSocket reset
  let restartRequestedBeforeConnected = false;
  let gracefullyRestart = () => {
    restartRequestedBeforeConnected = true;
  };

  const appStore = useAppStore();
  const toast = useToast();
  const gqlEndpoint = useEndpointsStore().selected.gql.url;
  const httpLink = new HttpLink({
    uri: gqlEndpoint
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      const ctx = operation.getContext();
      for (const error of graphQLErrors) {
        if (error.extensions?.code === "UNAUTHORIZED") {
          console.log("ERROR LOGOUT THROWN");
          console.log(error);
          localStorage.removeItem("token");
          const user = useUserStore();
          const loggedIn = !!user.user;
          user.user = null;
          if (loggedIn) window._tpu_router.push("/login");
        } else if (error.extensions?.code === "BAD_USER_INPUT") {
          for (const err of error.extensions.validationErrors as any[]) {
            const values: string[] = Object.values(err.constraints);

            if (ctx.noToast) {
            } else {
              for (const value of values) {
                toast.error(functions.charUp(value) + ".");
              }
            }
          }
        } else if (error.extensions?.code === "CHAT_NOT_FOUND") {
          if (
            app.config.globalProperties.$route.path.startsWith(
              "/communications/"
            )
          ) {
            app.config.globalProperties.$router.push("/communications/home");
          }
        } else if (error.extensions?.code === "WEATHER_NOT_RESPONDING") {
          //
        } else if (!ctx.noToast) {
          toast.error(error.message);
        }
      }
    }

    if (networkError) {
      //
    }
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: gqlEndpoint.replace("http", "ws"),
      connectionParams: async () => {
        return {
          authorization: getToken(app),
          "x-tpu-client-version": import.meta.env.TPU_VERSION,
          "x-tpu-client": window.electron ? "FlowinityElectron" : "TPUvNEXT"
        };
      },
      lazy: false,
      keepAlive: 5000,
      on: {
        error: () => {
          console.log("[Flowinity/GraphQL] Disconnected from socket.");
          const appStore = useAppStore();
          appStore.connected = false;
        },
        connected: (socket: any) => {
          setupSockets(app);
          const appStore = useAppStore();
          appStore.connected = true;
          console.log("[Flowinity/GraphQL] Connected to socket.");
          gracefullyRestart = () => {
            if (socket.readyState === WebSocket.OPEN) {
              appStore.connected = false;
              socket.close(4205, "Client Restart");
            }
          };

          if (restartRequestedBeforeConnected) {
            restartRequestedBeforeConnected = false;
            gracefullyRestart();
          }
        }
      }
    })
  );

  watch(
    () => appStore.token,
    () => {
      gracefullyRestart();
    }
  );

  const authLink = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    const token = getToken(app);
    operation.setContext({
      headers: {
        authorization: token,
        "x-tpu-client-version": import.meta.env.TPU_VERSION,
        "x-tpu-client": window.electron ? "FlowinityElectron" : "TPUvNEXT"
      }
    });
    return forward(operation);
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  if (import.meta.env.DEV) {
    loadDevMessages();
    loadErrorMessages();
  }

  const networkInspection =
    import.meta.env.DEV ||
    localStorage.getItem("tpuNetworkInspection") === "true";

  const appLink = from([
    authLink,
    ...(networkInspection ? [debugLink()] : []),
    errorLink,
    splitLink
  ]);

  // Create the apollo client
  return new ApolloClient({
    link: appLink,
    cache: new InMemoryCache({
      addTypename: true,
      typePolicies: {
        Query: {
          fields: {
            messages: {
              keyArgs: ["input"],
              merge(_, incoming) {
                return incoming;
              }
            },
            readReceipts: {
              merge(_, incoming) {
                return incoming;
              }
            }
          }
        },
        Chat: {
          fields: {
            typing: {
              merge(_, incoming) {
                return incoming;
              }
            }
          }
        }
      }
    }),
    connectToDevTools: import.meta.env.DEV
  });
}
