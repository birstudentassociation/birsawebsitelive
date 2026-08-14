/**
 * ESLint flat config, replacing the old `.eslintrc.json`.
 *
 * Two things forced this migration at once. ESLint 9 dropped eslintrc as the
 * default format, and Next.js 16 removed the `next lint` command that had
 * been papering over the gap — `npm run lint` now calls the ESLint CLI
 * directly, which only reads `eslint.config.*`. Until now CI skipped linting
 * entirely for exactly this reason (see .github/workflows/ci.yml), so this
 * also puts the lint step back into the pipeline.
 *
 * `eslint-config-next` ships its shareable configs as flat-config arrays, so
 * the old `extends: ["next/core-web-vitals", "next/typescript"]` becomes a
 * spread of the two matching entry points.
 */
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  {
    // Flat config has no `.eslintignore`; ignores live here instead. Build
    // output and dependencies only, so everything the repo actually authors
    // stays linted.
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      // Carried over from .eslintrc.json: a leading underscore marks a
      // deliberately unused binding (unused server-action parameters, for
      // instance), and those should not be warnings.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;
