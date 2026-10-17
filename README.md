# Cleve MCP

![Cleve](assets/cleve-icon-square.svg)

[![Smithery](https://smithery.ai/badge/cleve/cleve)](https://smithery.ai/servers/cleve/cleve)

Bring your Cleve workspace into your AI agent. Find relevant docs and project knowledge, read the source material, and use it as context for your work. Capture ideas and outcomes as new docs, update existing docs, and organize knowledge into folders. When you want to share something publicly, create a summary with a read-only link others can open.

This repository contains Cleve's public integration configuration, reusable agent skills, and branding. It connects to the existing hosted MCP server; it does not contain Cleve's application backend or run another server.

## Connection

- MCP endpoint: `https://app.cleve.ai/mcp`
- Transport: Streamable HTTP
- Authentication: OAuth; sign in with a free Cleve account and approve the connection. No separate API key is needed.
- Documentation: [Cleve MCP developer guide](https://docs.cleve.ai/developers/mcp)

Use a personal or shared workspace available to your connected account. The skills resolve the destination and pass the workspace explicitly. A workspace picker alone is not a claim about server-side isolation.

## Cursor

The root `plugin.json` and `mcp.json` use the portable Agent Plugins format supported by Cursor. The four skills are discovered from `skills/`.

For a local test, copy this repository's plugin files into `~/.cursor/plugins/local/cleve/`, then reload Cursor and check Customize for Cleve's MCP server and skills. A symlink to a repository outside the local plugins directory is not supported. Authenticate the MCP connection before testing a read. This repository has not yet been tested inside Cursor.

For MCP-only setup, add this entry to your existing Cursor MCP configuration, preserving other servers:

```json
{
  "mcpServers": {
    "cleve": {
      "url": "https://app.cleve.ai/mcp"
    }
  }
}
```

See [Cursor preparation and review](docs/cursor.md) for the remaining publishing checks.

The public repository to use for the Cursor submission is [cleve-ai/mcp](https://github.com/cleve-ai/mcp). Hosting this repository does not itself publish a Cursor Marketplace listing.

Cleve calls workspace content **docs**. Existing MCP names such as `cleve_read_note`, input fields such as `noteId`, and `/notes/` URLs stay compatible.

## Reusable skills

- **save**: save a useful summary of the available conversation as one new private doc.
- **share**: create a conversation summary with a public, read-only link after establishing public-sharing intent.
- **recall**: search and read relevant Cleve docs, then explain the findings with sources; no writes.
- **update**: incorporate new decisions and next steps into the intended existing doc using narrow edits; no fallback duplicate doc.

Invoke skills from the host's picker (names may be namespaced), or ask naturally:

- “Save the decisions and next steps from this conversation to Cleve.”
- “Bring in relevant Cleve context about the product roadmap and explain what we already decided.”
- “Update the Cleve doc linked above with our agreed next steps. Do not create another doc.”
- “Create a public, read-only link to a summary of this conversation. Leave out private details.”

Skills describe workflows; installing or connecting alone does not save, edit, or publish anything. They depend on the Cleve MCP tools exposed by the connected host. A plain MCP connection does not automatically install these skills.

## Smithery

Publish the existing hosted endpoint through Smithery's URL flow. No repository deployment or second server is required. Smithery scans the server's tools and may request OAuth authorization to complete the scan. The skills in this repository are not automatically included in a URL-based MCP listing.

See the [Cleve Smithery listing](https://smithery.ai/servers/cleve/cleve) and [Smithery connection notes](docs/smithery.md). Its hosted endpoint listing is separate from this repository and does not install these skills automatically.

## Privacy and support

Only send Cleve the content the user asks to save or edit. Never include passwords, tokens, hidden instructions, or unrelated local source files in conversation summaries. Saving and editing do not authorize changing public access. Public summary links can be read and redistributed by anyone with the link.

- [Support](https://cleve.ai/support) · [Privacy](https://cleve.ai/privacy) · [Terms](https://cleve.ai/terms)
- Contact: support@cleve.ai
- [Demo video](https://www.youtube.com/watch?v=z2zb765Tjls)
- Branding: `assets/cleve-icon-square.svg` is a square, icon-only SVG. `assets/cleve-icon-square-white.svg` and `assets/cleve-icon-square-white.png` are the same square artwork on a solid white background plate. `assets/directory-logo.png` is the supplied square directory PNG.

## Checks and publication status

With Bun installed, run `bun test`. These checks validate the local package and its path/credential boundaries. They do not prove authenticated tool execution, formatting preservation, signed-out public-link access, or marketplace acceptance.

The public integration repository is [cleve-ai/mcp](https://github.com/cleve-ai/mcp). No Cursor Marketplace submission has been made for this package, and authenticated testing inside Cursor remains outstanding. Do not add reviewer credentials, private workspace data, or secure credential-sharing links to this repository. Publishing these files does not deploy or change the hosted MCP server.

## License

The integration configuration, skills, documentation, and tests are licensed under [MIT](LICENSE). Cleve's logos and other files under `assets/` are excluded; no trademark rights are granted. The hosted Cleve service and its backend are not licensed by this repository. See [license scope](LICENSE-SCOPE.md) for the boundaries.

## Release checks

See [distribution maintenance](docs/distribution.md) for the synchronized contract, checks, and per-directory release process.
