import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,

  use: {
    headless: true,
    viewport: { width: 950, height: 428 },
    ignoreHTTPSErrors: true,
    video: "off",
  },

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    //{ name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
    //{ name: "webkit", use: { browserName: "webkit" } },
  ],
});
