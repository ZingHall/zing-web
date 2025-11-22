import { bcs } from "@mysten/sui/bcs";
import { deriveObjectID } from "@mysten/sui/utils";

export const ZING_STUDIO_CONFIG_SHARED_OBJECT_REF = {
  objectId:
    "0x7e34db1b83f7701e549e6c1d050d42136fee8af942481a15424c4ed3cbb5bd81",
  initialSharedVersion: 645292721,
  mutable: true,
};

export const ZING_STUDIO_PACKAGE_ADDRESS =
  "0xf8aa21deb4dac48354ff58043f8a6b3606a81849e5987a8fffa1c77475fa3d82";

export function deriveStudioID(address: string) {
  return deriveObjectID(
    ZING_STUDIO_CONFIG_SHARED_OBJECT_REF.objectId,
    "address",
    bcs.Address.serialize(address).toBytes(),
  );
}
