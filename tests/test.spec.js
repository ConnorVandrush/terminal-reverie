import { test } from "@playwright/test";

test("4 player login and party battle", async ({ context }) => {
  test.setTimeout(0);

  const users = [
    { email: "test@test.com", password: "password" },
    { email: "test2@test.com", password: "password" },
    { email: "test3@test.com", password: "password" },
    { email: "test4@test.com", password: "password" },
  ];

  // --- Helper: login flow for a single user ---
  const loginUser = async (user) => {
    const page = await context.newPage();

    await page.goto("http://46.110.113.183:5173/", {
      waitUntil: "networkidle",
    });

    await page.getByLabel("email").fill(user.email);
    await page.getByLabel("password").fill(user.password);
    await page.getByRole("button", { name: "Login" }).click();

    return page;
  };

  // --- Login all users in parallel ---
  const pages = await Promise.all(users.map(loginUser));
  const [page1, page2, page3, page4] = pages;

  // --- Helper: movement buttons for a page ---
  const movement = (page) => ({
    up: page.getByTestId("move-up"),
    down: page.getByTestId("move-down"),
    left: page.getByTestId("move-left"),
    right: page.getByTestId("move-right"),
  });

  // --- Wait for UI to be ready ---
  await Promise.all([
    movement(page2).left.waitFor(),
    movement(page3).down.waitFor(),
    movement(page4).right.waitFor(),
  ]);

  // --- Wait 3 seconds before moving ---
  await page2.waitForTimeout(3000);

  // --- Perform movement ---
  await movement(page2).left.click();
  await movement(page3).down.click();
  await movement(page4).right.click();

  const partyButton = (page) => page.getByTestId("invite-to-party-button");
  const joinInviteButton = (page) => page.getByTestId("join-invite-button");
  const cancelButton = (page) => page.getByTestId("cancel-button");

  // Click party button on all pages
  await Promise.all([
    partyButton(page1).click(),
    partyButton(page2).click(),
    partyButton(page3).click(),
    partyButton(page4).click(),
  ]);

  // Wait for the join/invite button to be visible on each page
  await Promise.all([
    joinInviteButton(page1).waitFor(),
    joinInviteButton(page2).waitFor(),
    joinInviteButton(page3).waitFor(),
    joinInviteButton(page4).waitFor(),
  ]);

  // Now click join/invite
  await Promise.all([
    joinInviteButton(page1).click(),
    joinInviteButton(page2).click(),
    joinInviteButton(page3).click(),
    joinInviteButton(page4).click(),
  ]);

  await page1.getByPlaceholder("Enter player name to invite").fill("Lunk");
  await page1.getByRole("button", { name: "Send Invite" }).click();
  await page1.getByPlaceholder("Enter player name to invite").fill("Remma");
  await page1.getByRole("button", { name: "Send Invite" }).click();
  await page1.getByPlaceholder("Enter player name to invite").fill("Dilp");
  await page1.getByRole("button", { name: "Send Invite" }).click();

  const acceptInvite = (page) => page.getByRole("button", { name: "Accept" });

  // Wait for accept buttons
  await Promise.all([
    acceptInvite(page2).waitFor(),
    acceptInvite(page3).waitFor(),
    acceptInvite(page4).waitFor(),
  ]);

  // Click accept on each page
  await Promise.all([
    acceptInvite(page2).click(),
    acceptInvite(page3).click(),
    acceptInvite(page4).click(),
  ]);

  await Promise.all([
    cancelButton(page1).click(),
    cancelButton(page2).click(),
    cancelButton(page3).click(),
    cancelButton(page4).click(),
  ]);

  const allyList = page1.getByTestId("ally-list");
  const left = movement(page1).left;

  // Hold left movement
  await left.dispatchEvent("mousedown");

  // Wait for ally list to appear
  await allyList.waitFor();

  await page1.waitForTimeout(3000);

  const clickGoblin = async (page, preferredNumber) => {
    const preferred = page.getByRole("button", {
      name: `Goblin ${preferredNumber}`,
    });
    const fallback = page.getByRole("button", { name: "Goblin 1" });

    // Check if preferred goblin exists
    if (await preferred.count()) {
      await preferred.click();
    } else {
      await fallback.click();
    }
  };

  await Promise.all([
    clickGoblin(page1, 1),
    clickGoblin(page2, 1),
    clickGoblin(page3, 2),
    clickGoblin(page4, 2),
  ]);

  const attackButton = (page) => page.getByRole("button", { name: "Attack" });

  await attackButton(page1).click();
  await attackButton(page2).click();
  await attackButton(page3).click();
  await attackButton(page4).click();

  await partyButton(page1).waitFor({ timeout: 0 });
  await page1.waitForTimeout(3000);
  await context.close();
});
