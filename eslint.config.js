import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    {files: ["**/*.{js,mjs,cjs,ts}"]},
    {files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: {globals: globals.node}},
    js.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier
]);