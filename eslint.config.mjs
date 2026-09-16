import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "packages/assets/svgs/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["packages/**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        console: "readonly",
        document: "readonly",
        window: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
