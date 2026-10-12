const { execFileSync } = require("node:child_process");

try {
  execFileSync("git", ["config", "core.hooksPath", ".git-hooks"], {
    stdio: "ignore",
  });
} catch {
  // Hooks are optional in read-only CI/sandbox environments.
}
