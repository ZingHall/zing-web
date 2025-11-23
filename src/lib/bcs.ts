import { bcs } from "@mysten/sui/bcs";
import { blobIdFromInt, blobIdToInt } from "@mysten/walrus";

export const BlobId = bcs.u256().transform({
  input: (blobId: string | bigint) =>
    typeof blobId === "string" ? blobIdToInt(blobId) : blobId,
  output: (id: string) => blobIdFromInt(id),
});
export const QuiltPatchId = bcs.struct("QuiltPatchId", {
  quiltId: BlobId,
  patchId: bcs.struct("InternalQuiltPatchId", {
    version: bcs.u8(),
    startIndex: bcs.u16(),
    endIndex: bcs.u16(),
  }),
});
