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
    "0x4257dc4f3a3fe73e5f8d8c86c2233210876c35dc9b369f72d6aab0521733e57e",
  initialSharedVersion: 723767900,
  mutable: true,
};

export const ZING_STORAGE_TREASURY_SHARED_OBJECT_REF = {
  objectId:
    "0xde26730698493f851a7d9cd4d49b5b56f6781d902d3a63e24aa1f25820924cc8",
  initialSharedVersion: 723767900,
  mutable: true,
};

export const WALRUS_SYSTEM_SHARED_OBJECT_REF = {
  objectId:
    "0x6c2547cbbc38025cf3adac45f63cb0a8d12ecf777cdc75a4971612bf97fdf6af",
  initialSharedVersion: 400185623,
  mutable: true,
};

export const ZING_STUDIO_V0_PACKAGE_ADDRESS =
  "0x455bd1ba1afe47158c9155001f33b4069c9f008d091eef28f61c47c857bf60aa";
export const ZING_STUDIO_PACKAGE_ADDRESS =
  "0x455bd1ba1afe47158c9155001f33b4069c9f008d091eef28f61c47c857bf60aa";
export const ZING_FRAMEWORK_PACKAGE_ADDRESS =
  "0xd851eb5b907b60aa5fd958dd74044d809c49ee60001cad621726f03ea138f943";
export const WAL_TESTNET_PACKAGE_ADDRESS =
  "0xa998b8719ca1c0a6dc4e24a859bbb39f5477417f71885fbf2967a6510f699144";
export const ZING_STUDIO_ARTICLE_TYPES =
  "0x455bd1ba1afe47158c9155001f33b4069c9f008d091eef28f61c47c857bf60aa::article::Article";
export const WAL_TESTNET_TYPE =
  "0x8270feb7375eee355e64fdb69c50abb6b5f9393a722883c1cf45f8e26048810a::wal::WAL";
export const WAL_PACKAGE_ADDRESS =
  "0xa998b8719ca1c0a6dc4e24a859bbb39f5477417f71885fbf2967a6510f699144";

export const FIXED_FILE_IV = new Uint8Array([
  4, 122, 105, 110, 103, 0, 0, 0, 0, 0, 0, 0,
]);

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

export function deriveWorksID(address: string) {
  const studioId = deriveStudioID(address);
  const key = new Uint8Array(Buffer.from("works", "utf8"));
  return deriveObjectID(
    studioId,
    "vector<u8>",
    bcs.vector(bcs.u8()).serialize(key).toBytes(),
  );
}

/**
 * Encrypt data using AES-256-GCM.
 * @returns {Uint8Array} Concatenated [IV | ciphertext]
 */
export async function encryptData(
  key: CryptoKey,
  data: ArrayBuffer | Uint8Array,
  iv: Uint8Array, // Accept IV as parameter
): Promise<Uint8Array> {
  const encoded = data instanceof Uint8Array ? data : new Uint8Array(data);
  const cleanEncoded = new Uint8Array(encoded);
  const cleanivBytes = new Uint8Array(iv);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: cleanivBytes },
      key,
      cleanEncoded,
    ),
  );

  // Combine IV + ciphertext for easy storage
  const combined = new Uint8Array(iv.length + ciphertext.length);
  combined.set(iv);
  combined.set(ciphertext, iv.length);
  return combined;
}

/**
 * Decrypt data using AES-256-GCM.
 * Input must be the combined [IV | ciphertext] format.
 */
export async function decryptData(
  key: CryptoKey,
  encrypted: ArrayBuffer | Uint8Array,
): Promise<Uint8Array> {
  const bytes =
    encrypted instanceof Uint8Array ? encrypted : new Uint8Array(encrypted);
  const iv = bytes.slice(0, 12);
  const ciphertext = bytes.slice(12);

  console.log({ iv, ciphertext });

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );
  return new Uint8Array(plaintext);
}

export const formatStorageSize = (bytes: string) => {
  const size = parseInt(bytes);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const formatFileSize = (bytes: string) => {
  const size = parseInt(bytes);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};
