# Playwright Test Script Generator

An agentic Playwright test generator for the Sauce Labs Swag Labs practice application.

## What makes it agentic?

The generator uses a closed loop instead of only converting prose to code:

1. **Explore** – opens the live target page and inspects the DOM, controls, labels, and `data-test` attributes.
2. **Plan** – converts a user story/manual-test description into a structured test plan.
3. **Generate** – emits a runnable Playwright test using a Page Object Model.
4. **Execute** – runs the generated test with Playwright.
5. **Observe failure** – captures stdout/stderr from the failed test run.
6. **Self-heal** – applies a repair strategy and retries up to three times.

The state-machine and repair boundary are intentionally separated so an LLM tool can be plugged into the planner/repair functions without changing the execution loop.

## Scenarios

1. Valid login
2. Add Sauce Labs Backpack and verify cart badge = 1
3. Add two products and verify both names in cart
4. Complete checkout and verify `Thank you for your order!`
5. Optional locked-out user negative test

## Run locally

```bash
npm install
npx playwright install chromium
npm test
```

Run the agent:

```bash
npm run agent -- --story "Log in, add a backpack, open cart and complete checkout"
```

Generate without execution:

```bash
npm run generate -- --story "Add two different products and verify both are in cart"
```

## Target credentials

Defaults are embedded only for the public Sauce Labs practice site. For real projects, set `SAUCE_USERNAME` and `SAUCE_PASSWORD` in the environment.

## Repository layout

```text
src/
  agent/                 agent state machine, planner, explorer, repair loop
  pages/                 Page Object Model
    login.page.ts
    inventory.page.ts
    cart.page.ts
    checkout.page.ts
    swag-labs.app.ts
tests/
  swag-labs.spec.ts      mandatory scenarios
generated/
  generated.spec.ts      latest generated artifact
playwright.config.ts
```

## Design notes

See [DESIGN.md](DESIGN.md) for the architecture, prompts/tool contracts, failure handling, and trade-offs.
