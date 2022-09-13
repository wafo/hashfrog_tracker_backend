module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
    "jest/globals": true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  plugins: ["prettier", "jest"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    // Add here all the extra rules based on the developer preferences
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
