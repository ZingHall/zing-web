import { bcs } from "@mysten/sui/bcs";
import { deriveObjectID } from "@mysten/sui/utils";

export const ZING_TREASURY_SHARED_OBJECT_REF = {
  objectId:
    "0xca56bc3982525decbd4b025d3d4ae4de07259d6efc187577bfc3ab212e20574f",
  initialSharedVersion: 645292716,
  mutable: true,
};

export const ZING_STUDIO_CONFIG_SHARED_OBJECT_REF = {
  objectId:
    "0x7e34db1b83f7701e549e6c1d050d42136fee8af942481a15424c4ed3cbb5bd81",
  initialSharedVersion: 645292721,
  mutable: true,
};

export const ZING_STORAGE_TREASURY_SHARED_OBJECT_REF = {
  objectId:
    "0x39e0a65c04e1c2209b3fdb3aaab0ba16f025858621d2317fe301b133c2190094",
  initialSharedVersion: 645292721,
  mutable: true,
};

export const WALRUS_SYSTEM_SHARED_OBJECT_REF = {
  objectId:
    "0x6c2547cbbc38025cf3adac45f63cb0a8d12ecf777cdc75a4971612bf97fdf6af",
  initialSharedVersion: 400185623,
  mutable: true,
};

export const ZING_STUDIO_V0_PACKAGE_ADDRESS =
  "0xf8aa21deb4dac48354ff58043f8a6b3606a81849e5987a8fffa1c77475fa3d82";
export const ZING_STUDIO_PACKAGE_ADDRESS =
  "0x7db47cf60ae88bbea4aa4962e1d83fc140be51a140dc8c597b17380f55e2fdab";
export const ZING_FRAMEWORK_PACKAGE_ADDRESS =
  "0xd851eb5b907b60aa5fd958dd74044d809c49ee60001cad621726f03ea138f943";

export function deriveStudioID(address: string) {
  return deriveObjectID(
    ZING_STUDIO_CONFIG_SHARED_OBJECT_REF.objectId,
    "address",
    bcs.Address.serialize(address).toBytes(),
  );
}

export function deriveStorageID(address: string) {
  const studioId = deriveStudioID(address);
  const key = new Uint8Array(Buffer.from("storage", "utf8"));
  return deriveObjectID(
    studioId,
    "vector<u8>",
    bcs.vector(bcs.u8()).serialize(key).toBytes(),
  );
}
