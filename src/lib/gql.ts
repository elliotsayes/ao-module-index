import arweaveGraphql, {
  GetTransactionsQuery,
  SortOrder,
} from "arweave-graphql";

const graphqlUrl = "arweave.net/graphql";
const gql = arweaveGraphql(graphqlUrl);

type TransactionEdge = GetTransactionsQuery["transactions"]["edges"][0];

export type Transaction = TransactionEdge["node"];

export type GetObserverReportTxIdsArgs = Parameters<
  typeof gql.getTransactions
>["0"];

export async function queryModuleTransactions(
  args: GetObserverReportTxIdsArgs
) {
  const pageArgs: GetObserverReportTxIdsArgs = {
    tags: [
      { name: 'Data-Protocol', values: ['ao'] },
      { name: 'Type', values: ['Module'] },
    ],
    first: 100,
    sort: SortOrder.HeightDesc,
    ...args,
  };
  const queryRes = await gql.getTransactions(pageArgs);
  return queryRes;
}

export async function querySingleTransaction(id: string) {
  const results = await gql.getTransactions({
    ids: [id],
  });
  if (results.transactions.edges.length === 0) {
    throw new Error(`Transaction not found: ${id}`);
  }
  return results.transactions.edges[0].node;
}
