export const loginUser = async (browser, user) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(process.env.FRONTEND_ADDRESS);

  await page.getByLabel("Email:").fill(user.email);
  await page.getByLabel("Password:").fill(user.password);
  await page.getByRole("button", { name: "login" }).click();

  return { page, context };
};
