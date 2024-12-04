import { App, watch } from "vue";
import { createApolloProvider } from "@vue/apollo-option";
import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from "@apollo/client/core";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { onError } from "@apollo/client/link/error";
import { useToast } from "vue-toastification";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import functions from "@/plugins/functions";
import {
  DefaultApolloClient,
  provideApolloClient
} from "@vue/apollo-composable";
import { useUserStore } from "@/store/user.store";
import { useAppStore } from "@/store/app.store";
import { useDebugStore } from "@/store/debug.store";
import router from "@/router";
import { setupSockets } from "@/boot/sockets";

function getToken(app: App) {
  return (
    app.config.globalProperties.$app.token ?? localStorage.getItem("token")
  );
}

const artificialLatency = parseInt(
  localStorage.getItem("tpuArtificialLatency") ?? "0"
);

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

export default function setup(app: App) {
  const toast = useToast();

  let restartRequestedBeforeConnected = false;
  let gracefullyRestart = () => {
    restartRequestedBeforeConnected = true;
  };

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      const ctx = operation.getContext();
      for (const error of graphQLErrors) {
        if (error.extensions?.code === "UNAUTHORIZED") {
          console.log("ERROR LOGOUT THROWN");
          console.log(error);
          //localStorage.removeItem("token");
          //const user = useUserStore();
          //user.user = null;
        } else if (error.extensions?.code === "BAD_USER_INPUT") {
          for (const err of error.extensions.validationErrors as any[]) {
            const values: string[] = Object.values(err.constraints);

            for (const value of values) {
              toast.error(functions.charUp(value) + ".");
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
        } else if (
          error.extensions?.code === "WEATHER_NOT_RESPONDING" ||
          error.extensions?.code === "EXPERIMENT_NOT_ALLOWED" ||
          error.extensions?.code === "MAINTENANCE"
        ) {
          continue;
        } else if (
          error.extensions?.code === "USERNAME_TAKEN" &&
          appStore.token
        ) {
          continue;
        } else if (!ctx.noToast) {
          toast.error(error.message);
        }
      }
    }

    if (networkError) {
      //
    }
  });

  let reconnect = false;

  const wsClient = createClient({
    url: `${window.location.protocol === "http:" ? "ws" : "wss"}://${
      window.location.host
    }/graphql`,
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
        console.log("[TPU/GraphQL] Disconnected from socket.");
        const appStore = useAppStore();
        reconnect = true;
        appStore.connected = false;
      },
      connected: (socket: any) => {
        setupSockets(app);
        const appStore = useAppStore();
        appStore.connected = true;
        console.log("[TPU/GraphQL] Connected to socket.");
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
  });

  const wsLink = new GraphQLWsLink(wsClient);

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

  const cleanTypeName = new ApolloLink((operation, forward) => {
    if (operation.variables) {
      const omitTypename = (key: any, value: any) =>
        key === "__typename" ? undefined : value;
      operation.variables = JSON.parse(
        JSON.stringify(operation.variables),
        omitTypename
      );
    }
    return forward(operation);
  });

  const networkInspection =
    import.meta.env.DEV ||
    localStorage.getItem("tpuNetworkInspection") === "true";

  const appLink = from([
    cleanTypeName,
    authLink,
    ...(networkInspection ? [debugLink()] : []),
    errorLink,
    wsLink
  ]);

  if (import.meta.env.DEV) {
    loadDevMessages();
    loadErrorMessages();
  }

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: appLink,
    cache: new InMemoryCache({
      addTypename: true
    }),
    connectToDevTools: import.meta.env.DEV
  });

  app.config.globalProperties.$apollo = apolloClient;

  const apolloProvider = createApolloProvider({
    defaultClient: apolloClient
  });

  app.use(apolloProvider);
  app.provide(DefaultApolloClient, apolloClient);
  app.provide("wsClient", wsClient);

  provideApolloClient(apolloClient);

  watch(
    () => useAppStore().token,
    () => {
      gracefullyRestart();
    }
  );

  const appStore = useAppStore();

  appStore.init().then(() => {
    if (!appStore.site.finishedSetup) {
      router.push("/setup");
    }
    console.info("[TPU/CoreStore] Core initialized");
  });
}
