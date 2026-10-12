# Contribute To The Public DreamNet Projects

Start with one independently useful product. Small reproductions, clearer setup
instructions, accessibility fixes and compatibility tests are valuable contributions.

1. Find the owning repository in the [directory](https://brandonducar.github.io/BrandonDucar/).
2. Read that repository's license, contribution instructions and current limitations.
3. Search its issues. For larger work, agree on the problem and acceptance test first.
4. Submit a focused pull request to that repository with tests and a reproducible example.
5. State what you tested locally and what you could not verify. Do not describe mocked results as live integration.

For this repository, update `docs/catalog.json` or the generator rather than
editing generated pages. Follow [directory maintenance](DIRECTORY_MAINTENANCE.md).

## Integration Proposals

Describe the user outcome, producer and consumer versions, public input/output
contracts, data ownership, permissions, failure behavior and a small acceptance
test. Start with synthetic data and a read-only example when possible. No private
DreamNet runtime, shared credential store or internal topology is required to
propose a public integration. Do not promise compatibility before testing it.

Each repository retains its own release and review process. A working adapter
does not merge the products, licenses, data stores or execution permissions.

## Public-Safe Contributions

Keep credentials, private source, customer data and internal operational context
out of issues, commits and screenshots. Follow [support guidance](SUPPORT.md) for
security-sensitive findings. Preserve upstream attribution when working with forks.
