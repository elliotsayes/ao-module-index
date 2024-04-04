import { Transaction } from "./gql";

const getTag1 = (
  gqlTransaction: Transaction,
  tagName: string
): string => {
  const tag = gqlTransaction.tags.find((tag) => tag.name === tagName);
  if (tag === undefined) {
    throw new Error(`Tag ${tagName} not found`);
  }
  return tag.value;
};

const getTagO1 = (
  gqlTransaction: Transaction,
  tagName: string
): string | undefined => {
  return gqlTransaction.tags.find((tag) => tag.name === tagName)?.value;
};

const getTag0N = (
  gqlTransaction: Transaction,
  tagName: string
): string[] => {
  return gqlTransaction.tags.filter((tag) => tag.name === tagName).map(n => n.value);
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
    contentType: getTagO1(gqlTransaction, "Content-Type"),
    dataProtocol: getTag1(gqlTransaction, "Data-Protocol"),
    type: getTag1(gqlTransaction, "Type"),
    variant: getTag1(gqlTransaction, "Variant"),
    moduleFormat: getTag1(gqlTransaction, "Module-Format"),
    inputEncoding: getTag1(gqlTransaction, "Input-Encoding"),
    outputEncoding: getTag1(gqlTransaction, "Output-Encoding"),
    memoryLimit: getTagO1(gqlTransaction, "Memory-Limit"),
    computeLimit: (function () {
      const tagValue = getTagO1(gqlTransaction, "Compute-Limit") ?? "0";
      if (typeof tagValue === "string") return parseInt(tagValue);
    })(),
    extensions: getTag0N(gqlTransaction, "Extension"),
  };
};

export type ModuleData = ReturnType<typeof parseModuleTransaction>;
