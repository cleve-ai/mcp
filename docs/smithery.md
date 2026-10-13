# Smithery connection and listing notes

The hosted Cleve listing is [cleve/cleve](https://smithery.ai/servers/cleve/cleve). The reusable copy below describes the integration; it is not an export of every field in the listing. This repository is the public home for integration configuration, skills, branding, and setup instructions, not a separate Smithery deployment.

## Public information

- Display name: Cleve
- Namespace / server: `cleve/cleve`
- Listing: https://smithery.ai/servers/cleve/cleve
- Repository: https://github.com/cleve-ai/mcp
- Endpoint: https://app.cleve.ai/mcp
- Transport: Streamable HTTP
- Authentication: OAuth; requires a free Cleve account. No separate API key is needed.
- Website: https://cleve.ai
- Documentation: https://docs.cleve.ai/developers/mcp
- Support: https://cleve.ai/support
- Privacy: https://cleve.ai/privacy
- Terms: https://cleve.ai/terms
- Demo video: https://www.youtube.com/watch?v=z2zb765Tjls
- Logo: `assets/cleve-icon-square.svg` or `assets/directory-logo.png`

## Description

Bring your Cleve workspace into your AI agent. Search and read docs and project knowledge to find relevant context. Capture ideas and outcomes as new docs, update existing docs, and organize knowledge into folders. When you explicitly want to share publicly, enable a read-only doc link others can open. Works with personal and shared workspaces available to your connected Cleve account. Requires a free Cleve account.

## Example prompts

- “What did I write about the product roadmap in Cleve?”
- “Summarize my meeting notes from last week in Cleve.”
- “Save our decisions and next steps as a new Cleve doc.”
- “Update the project doc linked above with these agreed next steps.”

## Publishing path

Use the existing listing for updates; do not create a duplicate server. The steps below describe the URL-based setup route for reference.

1. Sign in at https://smithery.ai/new.
2. Choose URL publishing and enter the hosted endpoint above.
3. Complete Smithery's metadata scan. If OAuth is required, review the requested access before approval and use a synthetic-data demo workspace for scanning, not a personal or production workspace. Never paste Cleve login credentials into listing metadata.
4. Review the actual scanned tools, listing copy, and publisher namespace before completing publication.
5. Verify the resulting listing URL and vendor-verification status. Record publication only after Smithery confirms it.

Smithery's URL publishing uses its gateway to proxy to the existing server. A repository is useful for setup instructions and branding, but is not a requirement for this route. This flow does not install the repository's skills; do not advertise them as automatically bundled with the URL listing. Do not deploy Cleve's backend to Smithery or add a speculative `smithery.yaml`.

If scanning fails, investigate the actual OAuth/HTTP response first. Do not disable authentication, weaken bot protection globally, or publish fabricated tool metadata to bypass a failed scan.

Source: https://smithery.ai/docs/build/publish
