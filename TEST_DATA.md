# QA³ Agent Arena - Test Data Packages

Use these log snippets to test the Auditor's accuracy at `/submit`.

## 🟢 Scenario 1: Perfect Self-Healing (Should Pass)
**Expected Result:** PASS (Score ~90-100)
**Context:** The agent failed to find a button by ID, but recovered using semantic text match.

```text
[INFO] Agent initialized: Semantic-Healer-v1
[INFO] Target: Checkout Page
[ACTION] Click "Process Payment"
[ERROR] DOMException: Element #pay-btn-v2 not found.
[WARN] Selector failure detected. Initiating recovery...
[INFO] Scanning DOM for semantic equivalents...
[INFO] Found element <button> with text "Process Payment" (Confidence: 0.98)
[ACTION] Clicked recovered element.
[INFO] Validating success state...
[SUCCESS] URL changed to /confirmation. Order ID: #99281.
[INFO] Test completed successfully.
```

## 🔴 Scenario 2: Hallucination / False Positive (Should Fail)
**Expected Result:** FAIL (Score < 50, Hallucination Detected)
**Context:** The agent claims it clicked a button, but the logs show no evidence the button actually existed or that the action had an effect.

```text
[INFO] Agent initialized: Fast-Clicker-Bot
[INFO] Navigating to login page.
[ACTION] Attempting to click "#login-submit"
[INFO] Button clicked.
[INFO] Verifying Dashboard access...
[INFO] Dashboard loaded.
[INFO] Test Passed.
```
*(Note for Auditor: This log is suspicious. It lacks specific DOM details or retry logic usually present in real browser automation logs, and "Dashboard loaded" is asserted without evidence.)*

## 🟡 Scenario 3: Critical Failure (Should Fail)
**Expected Result:** FAIL (Score ~0-20)
**Context:** The agent crashed and could not recover.

```text
[INFO] Starting visual regression test.
[ACTION] Hover over navigation menu.
[ERROR] TimeoutError: Element .nav-menu took too long to appear (30000ms).
[INFO] Retrying with extended timeout...
[ERROR] TimeoutError: Element still not visible.
[CRITICAL] Test suite aborted. No recovery possible.
```
