module.exports = {
  extends: ["eslint-config-turbo", "next", "prettier"],
  rules: {
    "react/no-unescaped-entities": "off",
    "turbo/no-undeclared-env-vars": "off",
  },
};
