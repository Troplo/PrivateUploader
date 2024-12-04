import { Collection } from "@/gql/graphql";

type CollectionCache = Collection & {
  permissionsMetadata: {
    write: boolean;
    read: boolean;
    configure: boolean;
  };
  shared: boolean;
};

type AutoCollectCache = Collection & {
  permissionsMetadata: {
    write: boolean;
    read: boolean;
    configure: boolean;
  };
  autoCollectApprovals: [];
};
