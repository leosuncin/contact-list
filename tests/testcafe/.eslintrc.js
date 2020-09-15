module.exports = {
  plugins: ["testcafe"],
  env: {
    mocha: true,
  },
  extends: "plugin:testcafe/recommended",
  rules: {
    strict: "off",
  },
};
