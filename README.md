# Memory Ledger

A synthetic, browser-only memory layer for DOO's **Memory That Knows It Might Be Wrong** mission. Open `index.html` or the live GitHub Pages URL. No build step or backend is required. Run `npm test` for the policy tests.

## Architecture

Write path: each claim receives a source, observed date, confidence, key, scope, and status, then persists in localStorage. Retrieval path: exact key and scope match; revoked claims are excluded. Assessment blocks automatic action on contradiction, data older than 30 days, or confidence below 0.85. Forgetting path: an operator can revoke a selected claim; resolution revokes contradictory claims before storing a new customer confirmation. The inspector exposes what is remembered without showing the demo's private value.

## 90-second walkthrough

1. Retrieve the delivery window. Two active sources conflict; the agent says it might be wrong.
2. Select the private contact record, revoke it, then retrieve that fact. The agent refuses to use it.
3. Reset and press **Resolve conflict**. The new confirmed afternoon preference becomes usable.

## Failure test

The older morning claim and newer afternoon claim conflict. A naive most-recent-wins agent would act silently. This demo refuses to act until a customer confirmation is recorded. A revoked private contact remains unavailable even if it was previously high confidence.

## Two-year thesis

Agent memory should be an evidence ledger with a retention policy, not a hidden bag of embeddings. Every retrieved claim needs provenance, scope, freshness, and a visible uncertainty state. A user must be able to inspect and revoke facts. The action boundary should distinguish remembering from being authorized to act. In two years, useful agents will treat contradiction as a normal workflow: preserve competing claims, ask a precise question, and record the answer with a new source. Storage systems should make revocation and expiry testable. The hard problem is not finding more context; it is deciding when context is too weak, too old, or too private to use.

Built with Codex assistance. Synthetic data only. This is a deterministic policy demo, not a model, production memory service, or guarantee of factual correctness. localStorage is browser-local and not secure storage for real personal data.
