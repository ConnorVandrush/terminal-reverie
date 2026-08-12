# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright\LoginFourPlayers.spec.js >> Login two players
- Location: tests\playwright\LoginFourPlayers.spec.js:4:1

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('button', { name: 'login' })
    - locator resolved to <button type="button" aria-label="login">Login</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - performing click action

```

# Page snapshot

```yaml
- generic [ref=e5]:
  - heading "Login" [level=3] [ref=e7]
  - generic [ref=e8]:
    - generic [ref=e9]:
      - generic [ref=e10]: "Email:"
      - textbox "Email:" [ref=e11]: test@test.com
    - generic [ref=e12]:
      - generic [ref=e13]: "Password:"
      - textbox "Password:" [active] [ref=e14]: password
    - button "login" [ref=e16]: Login
    - button "Register" [ref=e18]
```

# Test source

```ts
  1  | export const loginUser = async (browser, user) => {
  2  |   const context = await browser.newContext();
  3  |   const page = await context.newPage();
  4  | 
  5  |   await page.goto(process.env.FRONTEND_ADDRESS);
  6  | 
  7  |   await page.getByLabel("Email:").fill(user.email);
  8  |   await page.getByLabel("Password:").fill(user.password);
> 9  |   await page.getByRole("button", { name: "login" }).click();
     |                                                     ^ Error: locator.click: Target page, context or browser has been closed
  10 | 
  11 |   return { page, context };
  12 | };
  13 | 
```