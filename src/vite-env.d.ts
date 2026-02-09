interface ImportMetaEnv {
  // built-in
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: "development" | "production";

  readonly VITE_NETWORK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
