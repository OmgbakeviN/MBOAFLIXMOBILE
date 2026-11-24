const userAgent = process.env.npm_config_user_agent || "";

if (!userAgent.startsWith("pnpm/")) {
  console.error("This project uses pnpm. Run: pnpm install");
  process.exit(1);
}

console.log("Package manager verified: pnpm");