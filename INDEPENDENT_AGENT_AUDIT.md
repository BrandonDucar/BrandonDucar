# Independent Agent Audit Contract

This document is a reusable prompt for any external coding or research agent
auditing DreamNet. It is intentionally adversarial: do not accept DreamNet's
descriptions unless source, tests, CI, receipts, or a reproducible run support
them.

## Mission

Audit the public repositories owned by `BrandonDucar` and determine:

1. What is implemented, tested, and independently reproducible?
2. What is partial, simulated, synthetic, paper-only, or aspirational?
3. Which components complement an existing agent framework without replacing
   its working runtime?
4. What is the smallest reversible integration canary worth attempting?

Use `PUBLIC_EVIDENCE.json` only as a discovery index. Re-fetch every branch,
commit, workflow, and release before making a current claim.

## Evidence Rules

- Pin every finding to a repository and exact commit SHA.
- Cite file paths, tests, workflow runs, releases, or runtime receipts.
- Treat README prose, screenshots, counters, roadmaps, and architecture diagrams
  as claims until corroborated.
- Separate registered capacity from active workers and deployed services from
  services processing real work.
- Label every capability `IMPLEMENTED`, `PARTIAL`, `SIMULATED`, `ASPIRATIONAL`,
  or `UNVERIFIED`.
- A failing or missing CI lane is material evidence, not a cosmetic issue.
- Reject self-certification. A producing component cannot be its only verifier.
- Do not request or inspect private prompts, production credentials, customer
  data, signing keys, wallet authority, or unrestricted infrastructure access.

## Recommended Audit Order

1. `Dreamnet`: public contracts and deterministic validation.
2. `dreamnet-institutional-protocol`: end-to-end institutional composition.
3. `dreamloops`: persistent bounded execution, recovery, and succession.
4. `dreamnet-spore-sdk`: federation envelopes, verification, and transport.
5. `dreamnet-claim-factory`: producing and independent verification factories.
6. `warper-keeper` and `warper-keeper-trapper-sdk`: user-owned portable context.
7. `dreamnet-cerberus`: offline supply-chain admission.
8. `dreamnet-git-grid`: append-only provenance and rebuildable indexes.
9. `toolgym`: competency exercises and portable mastery evidence.
10. `dreamnet-trading-trappers`: paper-only research integration example.
11. `dreamnet-whale-league`: paper-only market research and battle product.
12. `proof-drop-zabal`: local-first evidence receipt product.
13. `dreamnet-quorum-lab-ethnyc`: independent multi-agent decision receipts and
    the ETHGlobal New York demonstration.

## ElizaOS Integration Lens

Do not ask ElizaOS to adopt DreamNet wholesale. Test whether one or more public
components fit existing Eliza extension surfaces:

| DreamNet component | Candidate Eliza surface | Question to falsify |
| --- | --- | --- |
| Warper Keeper | provider, service, app view | Can user-owned context survive a model/runtime switch without granting root authority? |
| Spore SDK | service, event, transport adapter | Can two independent runtimes exchange a signed evidence object and reject tampering or replay? |
| DreamLoops | action, service, task runtime | Does bounded recovery add value beyond Eliza's existing task lifecycle? |
| Claim Factory | evaluator, service | Can production and verification remain operationally independent? |
| ToolGym | evaluator, test plugin | Can an Eliza agent earn portable competency evidence from real tool use? |
| Cerberus | pre-install admission gate | Can an imported plugin or bundle be screened offline before execution? |
| Whale League | action, evaluator, app view | Can an agent perform a paper-only research round and return a tamper-evident receipt without wallet authority? |
| Proof Drop | evaluator, evidence adapter | Can an Eliza execution produce a portable receipt that a second runtime verifies independently? |
| Quorum Lab | evaluator, independent reviewer | Can multiple distinct reviewers reach a receipt-backed verdict without accepting producer self-certification? |

For each row, return `USE`, `ADAPT`, `PARTNER`, or `IGNORE`, with supporting
evidence and estimated integration risk.

## Required Deliverable

Return one concise report containing:

1. An evidence-vs-claim matrix.
2. Security and authority-boundary findings, ordered by severity.
3. Overlap and complementarity with the target framework.
4. Current CI/reproducibility status at exact SHAs.
5. One smallest reversible canary with rollback instructions.
6. Five measurements: latency, cost, replay/idempotency rejection, cold-start
   versus retained-context success, and repeated-trial success rate.
7. A final verdict: `NO_SIGNAL`, `REVISIT_AFTER_FIXES`, `RUN_CANARY`, or
   `DISCUSS_PARTNERSHIP`.

## Preferred Canary

Run one bounded, read-only path:

```text
external agent
  -> user-authorized Warper Keeper Trapper
  -> scoped context retrieval
  -> bounded task
  -> receipt / evidence object
  -> Spore transport
  -> second independent agent verifies
  -> Quorum receipt records the decision
  -> receiving agent continues
```

The canary must not expose private memory, mint credentials, publish socially,
move money, execute a real trade, or grant wildcard infrastructure access.

The useful result is not agreement with DreamNet's framing. The useful result
is an independently reproducible finding about whether these contracts improve
an existing agent system.
