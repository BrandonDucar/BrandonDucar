# DreamNet Ecosystem Map

DreamNet's public repositories are organized by responsibility. Each repository
should solve one legible problem, declare its relationship to the public core,
and expose tests, receipts, or a runnable product surface.

## 1. Core and Runtime

| Repository | Responsibility |
| --- | --- |
| [Institutional Protocol](https://github.com/BrandonDucar/dreamnet-institutional-protocol) | Composes competency, bounded execution, claims, independent verification, federation, and scoped reputation |
| [DreamNet Public Core](https://github.com/BrandonDucar/Dreamnet) | Shared contracts and deterministic validation |
| [DreamLoops](https://github.com/BrandonDucar/dreamloops) | Persistent work, recovery, succession, and bounded capability Capsules |
| [Temporal Worker](https://github.com/BrandonDucar/dreamnet-temporal) | Durable workflow examples, compensation, and recovery |

## 2. Knowledge Manufacturing

| Repository | Responsibility |
| --- | --- |
| [Claim Factory](https://github.com/BrandonDucar/dreamnet-claim-factory) | Evidence-backed claims and independent verification factories |
| [GitGrid](https://github.com/BrandonDucar/dreamnet-git-grid) | Git-native append-only events, provenance, and rebuildable indexes |
| [Cerberus](https://github.com/BrandonDucar/dreamnet-cerberus) | Offline supply-chain inspection before untrusted code executes |
| [ToolGym](https://github.com/BrandonDucar/toolgym) | Competency exercises, grading, and portable mastery evidence |
| [Quorum Lab](https://github.com/BrandonDucar/dreamnet-quorum-lab-ethnyc) | Multi-agent decisions with visible uncertainty and human gates |
| [Proof Drop](https://github.com/BrandonDucar/proof-drop-zabal) | Sanitized, portable evidence bundles |
| [QuillCode](https://github.com/BrandonDucar/dreamnet-quillcode) | Bounded engineering packets compiled from approved proposals |

The shared lifecycle is:

```text
observation
  -> evidence
  -> receipt
  -> claim
  -> counterclaim
  -> verification
  -> reputation
  -> trust
  -> reusable knowledge
```

## 3. Federation, Identity, and Transport

| Repository | Responsibility |
| --- | --- |
| [Spore SDK](https://github.com/BrandonDucar/dreamnet-spore-sdk) | Portable observations, assignments, evidence, receipts, and claims |
| [DreamNet ENS](https://github.com/BrandonDucar/dreamnet-ens) | Operator-owned agent identity and service discovery |

## 4. User Products

| Repository | Responsibility |
| --- | --- |
| [Whale Intelligence League](https://github.com/BrandonDucar/dreamnet-whale-league) | Holdings-backed paper trading, market intelligence, and player battles |
| [Memory Weaver](https://github.com/BrandonDucar/memory-weaver) | Local-first context discovery, memory stewardship, and remixing |

## 5. Labs and Public Experiments

Labs are useful demonstrations, but they are not presented as production
infrastructure. They use the `dreamnet-lab` topic so visitors can distinguish
experiments from supported products.

- [WaveWarZ Gravity Board](https://github.com/BrandonDucar/wavewarz-gravity-board)
- [ZABAL Recording Scout](https://github.com/BrandonDucar/zabal-recording-scout)
- [Flock GPS Cameras](https://github.com/BrandonDucar/FlockGPScameras)
- [Pi Boost](https://github.com/BrandonDucar/pi-boost)

## Repository Contract

New public repositories use these rules:

1. Use lowercase kebab-case names, normally prefixed with `dreamnet-`.
2. Add exactly one family topic: `dreamnet-core`, `dreamnet-runtime`,
   `dreamnet-trust`, `dreamnet-data`, `dreamnet-integration`,
   `dreamnet-product`, or `dreamnet-lab`.
3. Include a concise description, homepage when one exists, license, quick
   start, security boundary, and current maturity status.
4. State whether examples are live, simulated, synthetic, or paper-only.
5. Link back to this map and the DreamNet Public Core.
6. Archive superseded repositories only after dependency, deployment, package,
   webhook, and documentation references have been checked.

## Public and Private Boundary

Public repositories contain reusable contracts, reference implementations,
verification tooling, and user-facing products. The production monorepo,
credentials, customer data, internal prompts, private agent topology, and
proprietary routing policy remain private.
