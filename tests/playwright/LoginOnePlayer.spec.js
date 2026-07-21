import { test } from "@playwright/test";
import { loginUser } from "../helpers";

test("Login one player", async ({ browser }) => {
  test.setTimeout(0);

  const [{ page: page1 }] = await Promise.all([
    loginUser(browser, {
      email: "test@test.com",
      password: "password",
    }),
  ]);

  await page1.waitForEvent("close");
});
