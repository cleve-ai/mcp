# Distribution maintenance

This repository connects to Cleve's hosted MCP server; it does not deploy a second server. Its reviewed files are maintained in the Cleve application's canonical distribution package and synchronized by companion pull requests. Make package changes there first so ChatGPT and this portable integration cannot drift silently.

`mcp-contract.json` is the tool contract targeted by this release. It is a release snapshot, not proof that the server is deployed or that a directory has approved the tools. `mcp-release.json` records the source release identity and checksums for the synchronized files. Run `bun test` and `bun scripts/check-distribution.ts` to detect incomplete or edited exports.

The release process separately tracks ChatGPT, Claude, this public repository, Cursor, Smithery, the Official MCP Registry, Glama, and Composio. Updating this GitHub repository does not imply approval or publication anywhere else. After a hosted update, compare actual client tool discovery, complete OAuth and a harmless read in a demo workspace, and record any portal refresh or review outcome.

For published ChatGPT integrations, tool definitions use continuous review; listing metadata and imported skills require a new reviewed version. Preserve published inputs while reviews are pending. Other directories need their own refresh decision; do not assume that every server fix requires a new submission.

Sources: [OpenAI maintenance requirements](https://developers.openai.com/plugins/deploy/app-review#ongoing-maintenance), [Claude directory portal](https://claude.com/resources/articles/build-plugins-for-claude), [Smithery publishing](https://smithery.ai/docs/build/publish).
