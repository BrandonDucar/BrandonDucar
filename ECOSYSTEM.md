# DreamNet Ecosystem Map

Snapshot: 2026-09-22. This file is a projection. A repo existing is not evidence that DreamNet uses it.

Canonical runtime: private `BrandonDucar/dream-net`.
Public contracts: `Dreamnet` (@dreamnet/public-core, not published to npm yet).
Receipt family converging: `RCPT-{YYYYMMDD}-{SURFACE}-{SEQ}`.
ProofStack production writer/readback: not closed.

Machine-readable seed: `dreamnet.yml` in this repo. Each public repo should grow the same block.

Roles: protocol | library | product | lab | satellite | archive-candidate.
Maturity: stable | early | experiment | inactive-not-obsolete.

`dreamnet-temporal` is listed in older maps and is **not** in the current public set. Do not invent it here.

## Protocol and library

| Repo | Role | Maturity | Last push (approx) | Notes |
| --- | --- | --- | --- | --- |
| [Dreamnet](https://github.com/BrandonDucar/Dreamnet) | protocol | early | 2026-07-28 | Public Core. Install still GitHub URL. npm publish not done. |
| [dreamloops](https://github.com/BrandonDucar/dreamloops) | library | early | 2026-07-19 | Loops + Capsules. ZOL grafts are independent evidence. |
| [dreamnet-institutional-protocol](https://github.com/BrandonDucar/dreamnet-institutional-protocol) | protocol | early | 2026-07-28 | Overlay, not the private runtime. |
| [dreamnet-spore-sdk](https://github.com/BrandonDucar/dreamnet-spore-sdk) | protocol | early | 2026-09-10 | Live `https://dreamnet.ink/.well-known/spore` ACTIVE. Manifest digest sha256:87a354d8… |
| [dreamnet-git-grid](https://github.com/BrandonDucar/dreamnet-git-grid) | library | early | 2026-07-28 | Git-native events. |
| [dreamnet-claim-factory](https://github.com/BrandonDucar/dreamnet-claim-factory) | library | early | 2026-07-29 | Separate produce vs verify. |
| [dreamnet-cerberus](https://github.com/BrandonDucar/dreamnet-cerberus) | library | early | 2026-07-28 | Offline supply-chain scan. |
| [proof-drop-zabal](https://github.com/BrandonDucar/proof-drop-zabal) | library | early | 2026-06-30 | Local hash receipts. |
| [dreamnet-ens](https://github.com/BrandonDucar/dreamnet-ens) | library | early | 2026-07-19 | Identity profiles. |
| [warper-keeper-trapper-sdk](https://github.com/BrandonDucar/warper-keeper-trapper-sdk) | library | early | 2026-07-29 | Trapper CLI. |
| [toolgym](https://github.com/BrandonDucar/toolgym) | library | early | 2026-09-13 | 11 open issues. |
| [dreamnet-quillcode](https://github.com/BrandonDucar/dreamnet-quillcode) | library | experiment | 2026-06-15 | Proposal compiler. |

No recent commits ≠ obsolete. Classify before archive.

## Products

| Repo | Role | Maturity | Demo |
| --- | --- | --- | --- |
| [memory-weaver](https://github.com/BrandonDucar/memory-weaver) | product | early | https://memory-weaver.bd420chef.chatgpt.site |
| [dreamnet-whale-league](https://github.com/BrandonDucar/dreamnet-whale-league) | product | early | https://dreamnet-whale-league.pages.dev (paper-only) |
| [dreamnet-whale-league-site](https://github.com/BrandonDucar/dreamnet-whale-league-site) | product | early | marketing site |
| [warper-keeper](https://github.com/BrandonDucar/warper-keeper) | product | early | https://warper-keeper.dreamnet-intel.workers.dev |
| [dreamnet-intelligence-atlas](https://github.com/BrandonDucar/dreamnet-intelligence-atlas) | product | experiment | Worker homepage |
| [dreamnet-songs](https://github.com/BrandonDucar/dreamnet-songs) | product | early | https://dreamnet-songs.pages.dev |
| [dreamnet-trading-trappers](https://github.com/BrandonDucar/dreamnet-trading-trappers) | product | experiment | paper-only research |

## Labs — not production infrastructure

Do not archive yet. Trace deploys/webhooks/homepages first.

- [wavewarz-gravity-board](https://github.com/BrandonDucar/wavewarz-gravity-board)
- [zabal-recording-scout](https://github.com/BrandonDucar/zabal-recording-scout)
- [pi-boost](https://github.com/BrandonDucar/pi-boost)
- [FlockGPScameras](https://github.com/BrandonDucar/FlockGPScameras)
- [zaostock-live-command](https://github.com/BrandonDucar/zaostock-live-command)
- [dreamnet-quorum-lab-ethnyc](https://github.com/BrandonDucar/dreamnet-quorum-lab-ethnyc) (hackathon lab with a live Worker)

## Honest wiring

Sibling repos may connect by HTTP, MCP, NATS, Temporal, webhook, CLI, contract, or federation. Absence of an npm import in private `dream-net` is not absence of architecture. Production ProofStack join is still the missing canonical writer.

Do not add a private→public dependency just to make the graph look connected.
