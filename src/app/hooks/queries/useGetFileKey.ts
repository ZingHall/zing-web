import { useQuery } from "@tanstack/react-query";
import { useSessionKey } from "./useSessionKey";
import { useGetStudio } from "./useGetStudio";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useAppContext } from "@/app/context/appContext";

export function useGetFileKey() {
  const { sealClient } = useAppContext();
  const currentAccount = useCurrentAccount();
  const { data: studio } = useGetStudio();
  const { sessionKey, txBytes } = useSessionKey(
    currentAccount?.address || null,
    !!currentAccount?.address,
  );
  return useQuery({
    queryKey: ["fileKey", currentAccount?.address],
    queryFn: async () => {
      if (!studio?.encrypted_file_key || !sessionKey || !txBytes) return null;
      const decryptedKey = await sealClient.decrypt({
        data: new Uint8Array(studio.encrypted_file_key),
        sessionKey,
        txBytes,
      });
      console.log({ decryptedKeyBytes: decryptedKey });
      return await importFileKey(decryptedKey);
    },
    enabled: Boolean(
      currentAccount?.address &&
        sessionKey &&
        studio?.encrypted_file_key &&
        txBytes,
    ),
  });
}

export async function importFileKey(
  raw: Uint8Array | ArrayBuffer,
): Promise<CryptoKey> {
  // Convert to Uint8Array and create a clean copy
  const keyBytes = raw instanceof Uint8Array ? raw : new Uint8Array(raw);
  const cleanBytes = new Uint8Array(keyBytes);

  return crypto.subtle.importKey(
    "raw",
    cleanBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
}
