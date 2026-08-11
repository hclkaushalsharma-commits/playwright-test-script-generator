# Design Write-up

## 1. Problem

The goal is to turn a feature/user story or manual test case into runnable Playwright automation. A prompt-only code generator is insufficient because selectors can be unknown or unstable, assertions may not match the real application, and a generated script can fail at runtime.

The solution therefore treats test generation as an agent loop: **observe → plan → generate → execute → inspect failure → repair → execute again**.

## 2. Architecture

```text
User story / manual test
          |
          v
   Scenario Planner
          |
          v
 Live Page Explorer ----> DOM snapshot + controls + URL
          |
          v
   POM Test Generator
          |
          v
 generated/generated.spec.ts
          |
          v
   Playwright Executor
       /       \
    pass       fail
     |           |
     v           v
   done     Failure Analyzer
                   |
                   v
             Repair Strategy
                   |
                   +----> retry (max 3)
```

### Components

- **Explorer:** Playwright opens the target page and extracts visible text plus interactive element metadata.
- **Planner:** maps natural-language input to a structured `Plan` with actions and assertions.
- **POM generator:** writes a test against reusable page objects rather than embedding locators throughout the test.
- **Executor:** invokes the real Playwright CLI and captures failure output.
- **Repairer:** uses the observed failure as feedback and rewrites the generated artifact before retrying.

## 3. Tool design

The agent's conceptual tools are:

| Tool | Input | Output | Purpose |
|---|---|---|---|
| `navigate` | URL/path | current URL | reach target page |
| `inspect_page` | page | DOM/control snapshot | discover locators and page state |
| `generate_test` | plan + observations | TypeScript test | create runnable artifact |
| `run_test` | test path | exit code + logs | validate against live app |
| `repair_test` | test + failure | revised test | self-heal |

The implementation currently uses Playwright directly for exploration and Node's process execution for the run tool. The repair boundary is isolated so an LLM-backed repair tool can be added without changing the core state machine.

## 4. Prompt design

For an LLM-backed implementation, the planner prompt should require structured output:

```text
You are a Playwright test-planning agent.
Given a user story and a live-page observation, produce JSON only:
- scenario
- pages
- actions
- locator candidates
- assertions
- test data
Prefer data-test attributes, accessible roles/names, and stable text.
Never invent a selector when the page observation provides evidence.
```

The repair prompt should be failure-driven:

```text
You are repairing a failing Playwright test.
Inputs: current test, observed page snapshot, exact Playwright failure.
Return the smallest safe code change that fixes the failure.
Preserve the scenario and assertions unless the failure proves an assertion is incorrect.
Prefer stable data-test/role locators over CSS generated from layout.
```

## 5. Self-healing strategy

The key requirement is not merely having a `repair()` function; it is feeding the actual runtime failure back into the agent. The executor captures Playwright output and passes it to the repair stage. The loop is bounded to three attempts to prevent infinite retries.

A production extension would add:

- DOM re-inspection after a locator failure
- screenshot/trace inspection
- locator ranking: `data-test` > role/name > label > text > CSS/XPath
- assertion correction only when supported by fresh page evidence
- an LLM repair tool for unfamiliar failures

## 6. What can break and how it is handled

### Locator changes

If a selector stops matching, the agent should inspect the live page again and choose the most stable available locator. Swag Labs exposes `data-test` attributes, so these are preferred.

### Assertion mismatch

The failure analyzer distinguishes locator timeout from assertion mismatch. A locator issue should trigger locator discovery; an assertion issue should trigger a fresh page-state observation before changing expected text.

### Multi-page state

The checkout scenario crosses login → inventory → cart → checkout → confirmation. Page objects keep this stateful workflow readable while the test remains one end-to-end scenario.

### Flaky timing

Playwright's web-first assertions and auto-waiting are preferred over arbitrary sleeps. The config also retains traces, screenshots, and video on failure.

## 7. Why this meets the assignment

- Mandatory scenarios 1–4 are implemented and runnable.
- Scenario 5 is included as the optional stretch test.
- The solution uses Page Object Model.
- The agent explores the live application before generation.
- Generated tests are actually executed.
- Runtime failures are captured and fed into a bounded self-healing loop.
- The generated artifact is persisted in `generated/generated.spec.ts` for inspection/review.
