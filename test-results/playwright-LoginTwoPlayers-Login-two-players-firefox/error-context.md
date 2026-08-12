# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright\LoginTwoPlayers.spec.js >> Login two players
- Location: tests\playwright\LoginTwoPlayers.spec.js:4:1

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://192.168.1.235:5173/", waiting until "load"

```

# Test source

```ts
  1  | export const loginUser = async (browser, user) => {
  2  |   const context = await browser.newContext();
  3  |   const page = await context.newPage();
  4  | 
> 5  |   await page.goto(process.env.FRONTEND_ADDRESS);
     |              ^ Error: page.goto: Target page, context or browser has been closed
  6  | 
  7  |   await page.getByLabel("Email:").fill(user.email);
  8  |   await page.getByLabel("Password:").fill(user.password);
  9  |   await page.getByRole("button", { name: "login" }).click();
  10 | 
  11 |   return { page, context };
  12 | };
  13 | 
```