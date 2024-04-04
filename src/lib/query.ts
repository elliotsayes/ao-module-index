import {
  QueryClient, infiniteQueryOptions,
} from '@tanstack/react-query'
import { queryModuleTransactions } from './gql';

export const queryClient = new QueryClient()

export const modulueGqlQuery = (pageSize = 10) => infiniteQueryOptions({
  queryKey: ['moduleGql', pageSize], 
  queryFn: async ({ pageParam }) => {
    const queryRes = await queryModuleTransactions({
      after: pageParam,
      first: pageSize,
    });
    return queryRes;
  },
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (lastPage) => {
    if (!lastPage.transactions.pageInfo.hasNextPage) return undefined;
    const edges = lastPage.transactions.edges;
    return edges[edges.length - 1].cursor;
  },
  getPreviousPageParam: undefined,
})
