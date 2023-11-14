const { withAxiom } = require("next-axiom");

/** @type {import("next").NextConfig} */
module.exports = withAxiom({
  transpilePackages: ["@erp/ui", "@erp/supabase", "@erp/utils"],
});
