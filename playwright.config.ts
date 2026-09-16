import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  use: {
    browserName: "chromium",
    viewport: { width: 1440, height: 1000 },
  },
});
