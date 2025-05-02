/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_IS_DEV: string;
    readonly VITE_API_URL: string;
    readonly VITE_API_DEV_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}