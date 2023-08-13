// @ts-check
// eslint-disable-next-line no-undef
module.exports = /** @type {import("@typescript-eslint/utils").TSESLint.Linter.Config} */ {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "solid"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:solid/typescript",
    "@unocss"
  ],
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    "brace-style": [
      "error", "stroustrup"
    ],
    "quotes": [
      "error", "double"
    ],
    "indent": [
      "error", 2, { "SwitchCase": 1 }
    ],
    "semi": [
      "error", "always"
    ],

    "n/no-callback-literal": "off",
    "@typescript-eslint/no-extra-semi": "off",

    "@typescript-eslint/member-ordering": "error",

    "solid/jsx-no-undef": "off",
    "solid/no-innerhtml": "off",

    "jsx-quotes": [
      "error", "prefer-double"
    ]
  }
};
