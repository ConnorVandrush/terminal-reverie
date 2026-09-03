import { test } from "@playwright/test";
import { loginUser } from "../helpers";

test("Login two players and form party", async ({ browser }) => {
  test.setTimeout(0);

  const users = [
    { email: "test@test.com", password: "password" },
    { email: "test1@test.com", password: "password" },
  ];

  const [{ page: page1 }, { page: page2 }] = await Promise.all(
    users.map((u) => loginUser(browser, u)),
  );

  const partyButton = (page) => page.getByTestId("partyButton");

  const partyJoinInviteButton = (page) =>
    page.getByTestId("partyJoinInviteButton");

  const sendPartyInviteButton = (page) =>
    page.getByTestId("sendPartyInviteButton");

  const acceptPartyInviteButton = (page) =>
    page.getByTestId("acceptPartyInviteButton");

  const sendPartyInviteInput = (page) =>
    page.getByTestId("sendPartyInviteInput");

  // Open the party window for both players.
  await Promise.all([partyButton(page1).click(), partyButton(page2).click()]);

  // Open Join/Invite for both players.
  await Promise.all([
    partyJoinInviteButton(page1).click(),
    partyJoinInviteButton(page2).click(),
  ]);

  // Player 1 invites Player 2.
  await sendPartyInviteInput(page1).fill("Loy");
  await sendPartyInviteButton(page1).click();

  // Wait for Player 2 to receive the invite.
  await acceptPartyInviteButton(page2).waitFor();

  // Player 2 accepts.
  await acceptPartyInviteButton(page2).click();

  // Return to party window for both players.
  await Promise.all([partyButton(page1).click(), partyButton(page2).click()]);

  // Give the server/client synchronization a chance to settle.
  await Promise.all([
    page1.getByText("Leave Party").waitFor(),
    page2.getByText("Leave Party").waitFor(),
  ]);

  // Close both pages.
  await Promise.all([page1.waitForEvent("close"), page2.waitForEvent("close")]);
});
