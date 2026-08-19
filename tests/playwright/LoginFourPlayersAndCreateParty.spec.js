import { test } from "@playwright/test";
import { loginUser } from "../helpers";

test("Login four players and form party", async ({ browser }) => {
  test.setTimeout(0);

  const users = [
    { email: "test@test.com", password: "password" },
    { email: "test1@test.com", password: "password" },
    { email: "test2@test.com", password: "password" },
    { email: "test3@test.com", password: "password" },
  ];

  const [{ page: page1 }, { page: page2 }, { page: page3 }, { page: page4 }] =
    await Promise.all(users.map((u) => loginUser(browser, u)));

  const partyButton = (page) => page.getByTestId("partyButton");
  const partyJoinInviteButton = (page) =>
    page.getByTestId("partyJoinInviteButton");
  const sendPartyInviteButton = (page) =>
    page.getByTestId("sendPartyInviteButton");
  const acceptPartyInviteButton = (page) =>
    page.getByTestId("acceptPartyInviteButton");
  const sendPartyInviteInput = (page) =>
    page.getByTestId("sendPartyInviteInput");

  await Promise.all([
    partyButton(page1).click(),
    partyButton(page2).click(),
    partyButton(page3).click(),
    partyButton(page4).click(),
  ]);

  await Promise.all([
    partyJoinInviteButton(page1).click(),
    partyJoinInviteButton(page2).click(),
    partyJoinInviteButton(page3).click(),
    partyJoinInviteButton(page4).click(),
  ]);

  await sendPartyInviteInput(page1).fill("Loy");
  await sendPartyInviteButton(page1).click();
  await sendPartyInviteInput(page1).fill("Lunk");
  await sendPartyInviteButton(page1).click();
  await sendPartyInviteInput(page1).fill("Mar");
  await sendPartyInviteButton(page1).click();

  await Promise.all([
    acceptPartyInviteButton(page2).waitFor(),
    acceptPartyInviteButton(page3).waitFor(),
    acceptPartyInviteButton(page4).waitFor(),
  ]);

  await Promise.all([
    acceptPartyInviteButton(page2).click(),
    acceptPartyInviteButton(page3).click(),
    acceptPartyInviteButton(page4).click(),
  ]);

  await Promise.all([
    partyButton(page1).click(),
    partyButton(page2).click(),
    partyButton(page3).click(),
    partyButton(page4).click(),
  ]);

  await Promise.all([
    partyButton(page1).click(),
    partyButton(page2).click(),
    partyButton(page3).click(),
    partyButton(page4).click(),
  ]);

  await Promise.all([
    page1.waitForEvent("close"),
    page2.waitForEvent("close"),
    page3.waitForEvent("close"),
    page4.waitForEvent("close"),
  ]);
});
