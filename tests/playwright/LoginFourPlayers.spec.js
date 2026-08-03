import { test } from "@playwright/test";
import { loginUser } from "../helpers";

test("Login two players", async ({ browser }) => {
  test.setTimeout(0);

  const users = [
    { email: "test@test.com", password: "password" },
    { email: "test1@test.com", password: "password" },
    { email: "test2@test.com", password: "password" },
    { email: "test3@test.com", password: "password" },
  ];

  const [{ page: page1 }, { page: page2 }, { page: page3 }, { page: page4 }] =
    await Promise.all(users.map((u) => loginUser(browser, u)));

  await Promise.all([
    page1.waitForEvent("close"),
    page2.waitForEvent("close"),
    page3.waitForEvent("close"),
    page4.waitForEvent("close"),
  ]);
});
