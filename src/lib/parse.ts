import { Transaction } from "./gql";

const getTagRequired = (
  gqlTransaction: Transaction,
  tagName: string
): string => {
  const tag = gqlTransaction.tags.find((tag) => tag.name === tagName);
  if (tag === undefined) {
    throw new Error(`Tag ${tagName} not found`);
  }
  return tag.value;
};

const getTagOptional = (
  gqlTransaction: Transaction,
  tagName: string
): string | undefined => {
  const tag = gqlTransaction.tags.find((tag) => tag.name === tagName);
  return tag?.value;
};

export const parseModuleTransaction = (
  gqlTransaction: Transaction
) => {
  return {
    txId: gqlTransaction.id,
    ownerId: gqlTransaction.owner.address,
    size: parseInt(gqlTransaction.data.size),
    timestamp: gqlTransaction.block?.timestamp,
    blockId: gqlTransaction.block?.id,
    bundleId: gqlTransaction.bundledIn?.id,
    dataProtocol: getTagRequired(gqlTransaction, "Data-Protocol"),
    type: getTagRequired(gqlTransaction, "Type"),
    contentType: getTagOptional(gqlTransaction, "Content-Type"),
    variant: getTagOptional(gqlTransaction, "Variant"),
    format: getTagOptional(gqlTransaction, "Format"),
    inputEncoding: getTagOptional(gqlTransaction, "Input-Encoding"),
    outputEncoding: getTagOptional(gqlTransaction, "Output-Encoding"),
    memoryLimit: getTagOptional(gqlTransaction, "Memory-Limit") ?? "0",
    computeLimit: parseInt(getTagOptional(gqlTransaction, "Compute-Limit") ?? "0"),
  };
};

export type ModuleData = ReturnType<typeof parseModuleTransaction>;
