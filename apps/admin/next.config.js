const { withAxiom } = require("next-axiom");

/** @type {import("next").NextConfig} */
module.exports = withAxiom({
  transpilePackages: ["@mcsph/ui", "@mcsph/supabase", "@mcsph/utils"],
});
